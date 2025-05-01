const BaseAnalyzer = require("./baseAnalyzer");
const Jimp = require("jimp");

/**
 * Analyzer for land use classification in satellite imagery
 */
class LandUseClassifier extends BaseAnalyzer {
  constructor() {
    super(
      "Land Use Classifier",
      "Classifies satellite imagery into different land use categories including urban, agriculture, forest, water, and barren land."
    );

    // Define color mapping for visualization
    this.colorMap = {
      urban: Jimp.rgbaToInt(255, 0, 0, 255), // Red
      agriculture: Jimp.rgbaToInt(255, 255, 0, 255), // Yellow
      forest: Jimp.rgbaToInt(0, 128, 0, 255), // Dark Green
      water: Jimp.rgbaToInt(0, 0, 255, 255), // Blue
      barren: Jimp.rgbaToInt(150, 150, 150, 255), // Gray
      unknown: Jimp.rgbaToInt(255, 255, 255, 255), // White
    };

    // Define land use class descriptions
    this.classDescriptions = {
      urban:
        "Urban/built-up areas (buildings, roads, and other human-made structures)",
      agriculture:
        "Agricultural land (cropland, pastures, and managed vegetation)",
      forest:
        "Forest and natural vegetation (dense tree cover and natural ecosystems)",
      water: "Water bodies (rivers, lakes, ponds, and oceans)",
      barren: "Barren land (exposed soil, sand, rocks with minimal vegetation)",
      unknown: "Unclassified areas",
    };

    // Arabic class descriptions
    this.classDescriptionsAr = {
      urban:
        "المناطق الحضرية/المبنية (المباني والطرق وغيرها من الهياكل التي صنعها الإنسان)",
      agriculture:
        "الأراضي الزراعية (الأراضي الصالحة للزراعة والمراعي والنباتات المدارة)",
      forest:
        "الغابات والغطاء النباتي الطبيعي (غطاء شجري كثيف ونظم بيئية طبيعية)",
      water: "المسطحات المائية (الأنهار والبحيرات والبرك والمحيطات)",
      barren:
        "الأراضي الجرداء (التربة المكشوفة والرمال والصخور مع الحد الأدنى من الغطاء النباتي)",
      unknown: "مناطق غير مصنفة",
    };
  }

  /**
   * Classify land use in an image
   * @param {Buffer} imageBuffer - Image buffer to analyze
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} - Analysis results
   */
  async analyze(imageBuffer, options = {}) {
    try {
      console.log(
        "Starting LandUseClassifier.analyze with imageBuffer:",
        typeof imageBuffer
      );

      const image = await this.processImage(imageBuffer);
      console.log(
        "Image processed successfully, dimensions:",
        image.getWidth(),
        "x",
        image.getHeight()
      );

      // Get image dimensions
      const width = image.getWidth();
      const height = image.getHeight();
      const totalPixels = width * height;

      // Initialize counters for each land use type
      const landUseCount = {
        urban: 0,
        agriculture: 0,
        forest: 0,
        water: 0,
        barren: 0,
        unknown: 0,
      };

      // Create a copy for visualization
      const visualizationImage = image.clone();

      // Save colorMap in a local variable to avoid 'this' binding issues
      const colorMap = this.colorMap;

      // Analyze each pixel
      image.scan(0, 0, width, height, function (x, y, idx) {
        // Get RGB values
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];

        // Calculate some helper values for classification
        const brightness = (r + g + b) / 3;
        const maxChannel = Math.max(r, g, b);
        const minChannel = Math.min(r, g, b);
        const saturation =
          maxChannel === 0 ? 0 : (maxChannel - minChannel) / maxChannel;

        // Calculate vegetation indices
        const pseudoNDVI = g > 0 ? (g - r) / (g + r + 0.01) : 0;

        // Land use classification logic:
        let landUseType = "unknown";

        // Water detection (high blue relative to other channels)
        if (b > r * 1.2 && b > g * 1.2 && b > 80) {
          landUseType = "water";
        }
        // Forest detection (high green, moderately low brightness, high NDVI)
        else if (pseudoNDVI > 0.2 && g > r * 1.15 && g > b && g > 60) {
          landUseType = "forest";
        }
        // Agriculture detection (moderate NDVI, more uniform texture than forest)
        else if (pseudoNDVI > 0.1 && pseudoNDVI <= 0.2 && g > r && g > 70) {
          landUseType = "agriculture";
        }
        // Urban detection (low saturation, moderate to high brightness, similar RGB values)
        else if (
          saturation < 0.2 &&
          brightness > 80 &&
          Math.abs(r - g) < 30 &&
          Math.abs(g - b) < 30 &&
          Math.abs(r - b) < 30
        ) {
          landUseType = "urban";
        }
        // Barren land detection (moderate brightness, low saturation, not matching other categories)
        else if (brightness > 60 && brightness < 180 && saturation < 0.15) {
          landUseType = "barren";
        }

        // Increment counter for identified land use
        landUseCount[landUseType]++;

        // Set pixel color in visualization image based on land use type
        visualizationImage.setPixelColor(colorMap[landUseType], x, y);
      }); // No more bind(this) since we're using a local variable

      // Calculate percentages for each land use type
      const landUsePercentage = {};
      Object.keys(landUseCount).forEach((type) => {
        landUsePercentage[type] = (landUseCount[type] / totalPixels) * 100;
      });

      // Determine dominant land use type
      const dominantLandUse = Object.keys(landUseCount).reduce((a, b) =>
        landUseCount[a] > landUseCount[b] ? a : b
      );

      // Calculate land use diversity (Shannon index)
      let shannonIndex = 0;
      Object.keys(landUsePercentage).forEach((type) => {
        const p = landUsePercentage[type] / 100;
        if (p > 0) {
          shannonIndex -= p * Math.log(p);
        }
      });

      // Normalize Shannon index (0-1 scale)
      const normalizedDiversity =
        shannonIndex / Math.log(Object.keys(landUseCount).length);

      // Create visualization image buffer
      const outputBuffer = await visualizationImage.getBufferAsync(
        Jimp.MIME_PNG
      );

      // Generate human-readable interpretation based on results
      let interpretation = "";
      let interpretationAr = "";

      if (landUsePercentage.urban > 50) {
        interpretation =
          "This area is primarily urban/developed, with significant human infrastructure.";
        interpretationAr =
          "هذه المنطقة حضرية/مطورة بشكل أساسي، مع بنية تحتية بشرية كبيرة.";
      } else if (landUsePercentage.forest > 50) {
        interpretation =
          "This area is predominantly forest/natural vegetation, suggesting minimal development.";
        interpretationAr =
          "هذه المنطقة تتكون بشكل رئيسي من الغابات/الغطاء النباتي الطبيعي، مما يشير إلى الحد الأدنى من التطوير.";
      } else if (landUsePercentage.agriculture > 50) {
        interpretation =
          "This area is mainly agricultural land, used for farming and food production.";
        interpretationAr =
          "هذه المنطقة هي في الغالب أراضٍ زراعية، تستخدم للزراعة وإنتاج الغذاء.";
      } else if (landUsePercentage.water > 50) {
        interpretation =
          "This area is primarily water, such as a lake, river, or coastal area.";
        interpretationAr =
          "هذه المنطقة تتكون بشكل رئيسي من المياه، مثل البحيرة أو النهر أو المنطقة الساحلية.";
      } else if (landUsePercentage.barren > 50) {
        interpretation =
          "This area is mostly barren land with minimal vegetation.";
        interpretationAr =
          "هذه المنطقة في معظمها أرض جرداء مع الحد الأدنى من الغطاء النباتي.";
      } else if (normalizedDiversity > 0.7) {
        interpretation =
          "This is a diverse area with a mix of different land use types.";
        interpretationAr =
          "هذه منطقة متنوعة مع مزيج من أنواع استخدام الأراضي المختلفة.";
      } else {
        interpretation = `This area is a mix of different land use types, with ${dominantLandUse} being the most common.`;
        interpretationAr = `هذه المنطقة هي مزيج من أنواع استخدام الأراضي المختلفة، مع كون ${this.translateLandUseType(
          dominantLandUse
        )} هو الأكثر شيوعًا.`;
      }

      // Create a translation map for land use types
      const landUseTypeTranslations = {
        urban: "المناطق الحضرية/المبنية",
        agriculture: "الأراضي الزراعية",
        forest: "الغابات والغطاء النباتي الطبيعي",
        water: "المسطحات المائية",
        barren: "الأراضي الجرداء",
        unknown: "غير معروف",
      };

      // Helper function to translate land use type
      this.translateLandUseType = function (type) {
        return landUseTypeTranslations[type] || type;
      };

      // Generate explanation HTML with both English and Arabic
      let explanationHtml = `
        <div dir="ltr">
          <p>This analysis classifies the image into different land use categories:</p>
          <ul>
            <li><span style="color:red">■</span> <strong>Urban/Built-up (${landUsePercentage.urban.toFixed(
              1
            )}%)</strong>: ${this.classDescriptions.urban}</li>
            <li><span style="color:yellow">■</span> <strong>Agriculture (${landUsePercentage.agriculture.toFixed(
              1
            )}%)</strong>: ${this.classDescriptions.agriculture}</li>
            <li><span style="color:green">■</span> <strong>Forest (${landUsePercentage.forest.toFixed(
              1
            )}%)</strong>: ${this.classDescriptions.forest}</li>
            <li><span style="color:blue">■</span> <strong>Water (${landUsePercentage.water.toFixed(
              1
            )}%)</strong>: ${this.classDescriptions.water}</li>
            <li><span style="color:gray">■</span> <strong>Barren Land (${landUsePercentage.barren.toFixed(
              1
            )}%)</strong>: ${this.classDescriptions.barren}</li>
          </ul>
          <p>The dominant land use type is <strong>${dominantLandUse}</strong> at ${landUsePercentage[
        dominantLandUse
      ].toFixed(1)}% of the total area.</p>
          <p>Land Use Diversity Score: ${normalizedDiversity.toFixed(
            2
          )} (0-1 scale, where higher values indicate greater diversity)</p>
          <p>${interpretation}</p>
        </div>
        
        <div dir="rtl" style="margin-top: 20px; text-align: right;">
          <p>يصنف هذا التحليل الصورة إلى فئات مختلفة لاستخدام الأراضي:</p>
          <ul>
            <li><span style="color:red">■</span> <strong>المناطق الحضرية/المبنية (${landUsePercentage.urban.toFixed(
              1
            )}%)</strong>: ${this.classDescriptionsAr.urban}</li>
            <li><span style="color:yellow">■</span> <strong>الأراضي الزراعية (${landUsePercentage.agriculture.toFixed(
              1
            )}%)</strong>: ${this.classDescriptionsAr.agriculture}</li>
            <li><span style="color:green">■</span> <strong>الغابات والغطاء النباتي الطبيعي (${landUsePercentage.forest.toFixed(
              1
            )}%)</strong>: ${this.classDescriptionsAr.forest}</li>
            <li><span style="color:blue">■</span> <strong>المسطحات المائية (${landUsePercentage.water.toFixed(
              1
            )}%)</strong>: ${this.classDescriptionsAr.water}</li>
            <li><span style="color:gray">■</span> <strong>الأراضي الجرداء (${landUsePercentage.barren.toFixed(
              1
            )}%)</strong>: ${this.classDescriptionsAr.barren}</li>
          </ul>
          <p>نوع استخدام الأراضي السائد هو <strong>${this.translateLandUseType(
            dominantLandUse
          )}</strong> بنسبة ${landUsePercentage[dominantLandUse].toFixed(
        1
      )}% من المساحة الإجمالية.</p>
          <p>درجة تنوع استخدام الأراضي: ${normalizedDiversity.toFixed(
            2
          )} (مقياس 0-1، تشير القيم الأعلى إلى تنوع أكبر)</p>
          <p>${interpretationAr}</p>
        </div>
      `;

      return {
        featureType: "landUse",
        totalPixels,
        dominantLandUse,
        landUseCount,
        landUsePercentage: Object.entries(landUsePercentage).reduce(
          (obj, [key, value]) => {
            obj[key] = value.toFixed(2);
            return obj;
          },
          {}
        ),
        landUseDiversity: normalizedDiversity.toFixed(2),
        interpretation,
        interpretationAr,
        explanationHtml,
        visualizationImageBase64: `data:image/png;base64,${outputBuffer.toString(
          "base64"
        )}`,
      };
    } catch (error) {
      console.error("Error in land use classification:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      throw error;
    }
  }
}

module.exports = LandUseClassifier;
