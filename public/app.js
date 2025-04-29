// DOM Elements
const searchBtn = document.getElementById("search-btn");
const sampleBtn = document.getElementById("sample-btn");
const analyzeBtn = document.getElementById("analyze-btn");
const uploadBtn = document.getElementById("upload-btn");
const fileUpload = document.getElementById("file-upload");
const fileDropArea = document.querySelector(".file-drop-area");
const fileMessage = document.querySelector(".file-message");
const uploadPreview = document.getElementById("upload-preview");
const uploadImagePreview = document.getElementById("upload-image-preview");
const fileName = document.getElementById("file-name");
const fileSize = document.getElementById("file-size");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const collectionsSelect = document.getElementById("collections");
const bboxInput = document.getElementById("bbox");
const limitInput = document.getElementById("limit");
const featureTypeSelect = document.getElementById("feature-type");
const resultsSection = document.getElementById("results-section");
const analysisSection = document.getElementById("analysis-section");
const analysisResults = document.getElementById("analysis-results");
const resultsCount = document.getElementById("results-count");
const imageGrid = document.getElementById("image-grid");
const samplesGrid = document.getElementById("samples-grid");
const originalImage = document.getElementById("original-image");
const visualizationImage = document.getElementById("visualization-image");
const statsContainer = document.getElementById("stats-container");
const langBtns = document.querySelectorAll(".lang-btn");

// State
let currentItems = [];
let selectedImageUrl = "";
let uploadedFile = null;
let currentLang = "en";

// Translations
const translations = {
  en: {
    appTitle: "Planetary Image Feature Counter",
    appDescription:
      "Count and analyze features in satellite imagery using Microsoft's Planetary Computer",
    featuresTitle: "Advanced Satellite Imagery Analysis",
    featuresDescription:
      "Our powerful analyzers detect and measure features in satellite imagery with sophisticated algorithms designed for environmental monitoring, urban planning, and resource management.",

    // Vegetation
    vegetationTitle: "Vegetation Analysis",
    vegetationDesc:
      "Detect vegetation health, density, and stress levels by analyzing spectral signatures. Useful for:",
    vegetationPoint1: "Crop health monitoring",
    vegetationPoint2: "Deforestation tracking",
    vegetationPoint3: "Environmental assessment",
    vegetationPoint4: "Biomass estimation",
    vegetationOption: "Vegetation",
    vegetationDescription:
      "Analyzes vegetation health and coverage in satellite imagery. Detects vegetation based on spectral signatures and assesses its health and density by calculating a pseudo-NDVI index.",

    // Water
    waterTitle: "Water Analysis",
    waterDesc:
      "Identify and classify water bodies by depth, clarity, and shoreline complexity. Benefits include:",
    waterPoint1: "Flood monitoring",
    waterPoint2: "Water resource management",
    waterPoint3: "Coastal change analysis",
    waterPoint4: "Water quality assessment",
    waterOption: "Water",
    waterDescription:
      "Analyzes water bodies in satellite imagery. Detects water features such as oceans, lakes, rivers, and ponds based on spectral characteristics, classifying them by depth and clarity.",

    // Urban
    urbanTitle: "Urban Analysis",
    urbanDesc:
      "Detect built-up areas and classify urban development patterns. Applications include:",
    urbanPoint1: "Urban expansion monitoring",
    urbanPoint2: "Infrastructure planning",
    urbanPoint3: "Population density estimation",
    urbanPoint4: "Land use classification",
    urbanOption: "Urban Areas",
    urbanDescription:
      "Analyzes built-up areas in satellite imagery. Detects buildings, roads, industrial zones, and other urban structures based on spectral and spatial characteristics, classifying development patterns.",

    // Cloud
    cloudTitle: "Cloud Analysis",
    cloudDesc:
      "Measure cloud coverage and types to determine image usability. Important for:",
    cloudPoint1: "Image quality assessment",
    cloudPoint2: "Time series analysis",
    cloudPoint3: "Weather pattern monitoring",
    cloudPoint4: "Data preprocessing",
    cloudsOption: "Clouds",
    cloudDescription:
      "Analyzes cloud coverage in satellite imagery. Detects clouds based on their high brightness and spectral characteristics, classifying them as thick or thin and assessing image usability.",

    // Upload section
    uploadTitle: "Upload or Select an Image",
    uploadTabBtn: "Upload Image",
    apiTabBtn: "Planetary Computer API",
    sampleTabBtn: "Sample Images",
    dropAreaMessage: "Drag & drop files here or click to browse",
    selectedFile: "Selected File",
    uploadBtn: "Upload Image",

    // API section
    collectionLabel: "Collection:",
    bboxLabel: "Bounding Box (min_lon,min_lat,max_lon,max_lat):",
    bboxHelp: "Example: -122.5,37.5,-122.0,38.0 (San Francisco Bay Area)",
    limitLabel: "Limit:",
    searchBtn: "Search",
    getSampleBtn: "Get Sample Image",
    samplesDesc: "Select one of our sample images to analyze:",
    loadingSamples: "Loading sample images...",

    // Results section
    resultsTitle: "Search Results",
    resultsFound: "Found {count} result",
    resultsFoundPlural: "Found {count} results",

    // Analysis section
    analysisTitle: "Feature Analysis",
    featureTypeLabel: "Feature Type:",
    analyzeBtn: "Analyze Image",
    originalImageTitle: "Original Image",
    visualizationTitle: "Feature Visualization",
    statisticsTitle: "Statistics",

    // Stats labels
    featureType: "Feature Type",
    featureCount: "Feature Count",
    areaPercentage: "Area Percentage",
    totalPixels: "Total Pixels",

    // Explanation and Analysis sections
    explanationTitle: "Analysis Explanation",
    keySummaryTitle: "Key Findings Summary",
    applicationsTitle: "Practical Applications",

    // Feature type explanations
    vegetationTypeExplanation:
      "Vegetation analysis detects plant life and assesses its health based on spectral characteristics, useful for agriculture, forestry, and environmental monitoring.",
    waterTypeExplanation:
      "Water analysis identifies water bodies and classifies them by depth and clarity, useful for flood monitoring, coastal studies, and water resource management.",
    urbanTypeExplanation:
      "Urban analysis detects built-up areas and categorizes them by density and use, useful for urban planning, development monitoring, and population studies.",
    cloudTypeExplanation:
      "Cloud analysis identifies cloud cover and types, useful for assessing image quality for earth observation and meteorological studies.",
    defaultTypeExplanation:
      "Analysis of features in satellite imagery using spectral and spatial characteristics.",

    // Statistics explanations
    totalPixelsExplanation: "The total number of pixels analyzed in the image.",
    vegetationCountExplanation:
      "The number of pixels identified as vegetation.",
    vegetationPercentageExplanation:
      "The percentage of the image covered by vegetation.",
    healthyPercentageExplanation:
      "The percentage of vegetation classified as healthy (dark green in visualization).",
    moderatePercentageExplanation:
      "The percentage of vegetation classified as moderately healthy (medium green in visualization).",
    stressedPercentageExplanation:
      "The percentage of vegetation classified as stressed (yellow-green in visualization).",
    averageNDVIExplanation:
      "The average Normalized Difference Vegetation Index value. Higher values indicate healthier vegetation.",
    coverageCategoryExplanation:
      "Classification of vegetation coverage from Minimal to Very High.",
    healthStatusExplanation:
      "Overall health assessment of the vegetation in the image.",
    waterCountExplanation: "The number of pixels identified as water.",
    waterPercentageExplanation: "The percentage of the image covered by water.",
    deepWaterPercentageExplanation:
      "The percentage of water classified as deep (dark blue in visualization).",
    shallowWaterPercentageExplanation:
      "The percentage of water classified as shallow (medium blue in visualization).",
    turbidWaterPercentageExplanation:
      "The percentage of water classified as turbid/sediment-laden (light blue-green in visualization).",
    shorelineIndexExplanation:
      "A relative measure of shoreline complexity. Higher values indicate more complex shorelines with more inlets and peninsulas.",
    waterBodyTypeExplanation:
      "Classification of the water feature (ocean, lake, river, etc.).",
    clarityCategoryExplanation:
      "Overall clarity assessment of the water bodies (clear, turbid, mixed).",

    // Footer
    footerText: "Developed by",
    footerText2:
      "using Microsoft's Planetary Computer API. This is a technology demonstration project.",
  },
  ar: {
    appTitle: "عداد ميزات الصور الكوكبية",
    appDescription:
      "قم بعد وتحليل ميزات الصور الفضائية باستخدام حاسوب مايكروسوفت الكوكبي",
    featuresTitle: "تحليل متقدم لصور الأقمار الصناعية",
    featuresDescription:
      "محللاتنا القوية تكتشف وتقيس الميزات في صور الأقمار الصناعية باستخدام خوارزميات متطورة مصممة للمراقبة البيئية والتخطيط الحضري وإدارة الموارد.",

    // Vegetation
    vegetationTitle: "تحليل الغطاء النباتي",
    vegetationDesc:
      "اكتشف صحة النباتات وكثافتها ومستويات الإجهاد من خلال تحليل البصمات الطيفية. مفيد لـ:",
    vegetationPoint1: "مراقبة صحة المحاصيل",
    vegetationPoint2: "تتبع إزالة الغابات",
    vegetationPoint3: "التقييم البيئي",
    vegetationPoint4: "تقدير الكتلة الحيوية",
    vegetationOption: "الغطاء النباتي",
    vegetationDescription:
      "يحلل صحة وتغطية الغطاء النباتي في صور الأقمار الصناعية. يكتشف النباتات بناءً على البصمات الطيفية ويقيم صحتها وكثافتها من خلال حساب مؤشر NDVI المبسط.",

    // Water
    waterTitle: "تحليل المياه",
    waterDesc:
      "تحديد وتصنيف المسطحات المائية حسب العمق والوضوح وتعقيد الشاطئ. الفوائد تشمل:",
    waterPoint1: "مراقبة الفيضانات",
    waterPoint2: "إدارة موارد المياه",
    waterPoint3: "تحليل التغيرات الساحلية",
    waterPoint4: "تقييم جودة المياه",
    waterOption: "المياه",
    waterDescription:
      "يحلل المسطحات المائية في صور الأقمار الصناعية. يكتشف ميزات المياه مثل المحيطات والبحيرات والأنهار والبرك بناءً على الخصائص الطيفية، ويصنفها حسب العمق والوضوح.",

    // Urban
    urbanTitle: "التحليل الحضري",
    urbanDesc:
      "اكتشف المناطق المبنية وصنف أنماط التطوير الحضري. التطبيقات تشمل:",
    urbanPoint1: "مراقبة التوسع الحضري",
    urbanPoint2: "تخطيط البنية التحتية",
    urbanPoint3: "تقدير كثافة السكان",
    urbanPoint4: "تصنيف استخدام الأراضي",
    urbanOption: "المناطق الحضرية",
    urbanDescription:
      "يحلل المناطق المبنية في صور الأقمار الصناعية. يكتشف المباني والطرق والمناطق الصناعية وغيرها من المنشآت الحضرية بناءً على الخصائص الطيفية والمكانية، ويصنف أنماط التنمية.",

    // Cloud
    cloudTitle: "تحليل السحب",
    cloudDesc: "قياس غطاء السحب وأنواعه لتحديد قابلية استخدام الصورة. مهم لـ:",
    cloudPoint1: "تقييم جودة الصورة",
    cloudPoint2: "تحليل السلاسل الزمنية",
    cloudPoint3: "مراقبة أنماط الطقس",
    cloudPoint4: "معالجة البيانات المسبقة",
    cloudsOption: "السحب",
    cloudDescription:
      "يحلل غطاء السحب في صور الأقمار الصناعية. يكتشف السحب بناءً على سطوعها العالي وخصائصها الطيفية، ويصنفها إلى سميكة أو رقيقة ويقيم قابلية استخدام الصورة.",

    // Upload section
    uploadTitle: "قم برفع أو اختيار صورة",
    uploadTabBtn: "رفع صورة",
    apiTabBtn: "واجهة برمجة حاسوب كوكبي",
    sampleTabBtn: "صور نموذجية",
    dropAreaMessage: "اسحب وأفلت الملفات هنا أو انقر للتصفح",
    selectedFile: "الملف المحدد",
    uploadBtn: "رفع الصورة",

    // API section
    collectionLabel: "المجموعة:",
    bboxLabel: "المربع المحيط (min_lon,min_lat,max_lon,max_lat):",
    bboxHelp: "مثال: -122.5,37.5,-122.0,38.0 (منطقة خليج سان فرانسيسكو)",
    limitLabel: "الحد:",
    searchBtn: "بحث",
    getSampleBtn: "الحصول على صورة نموذجية",
    samplesDesc: "اختر إحدى صورنا النموذجية للتحليل:",
    loadingSamples: "جاري تحميل الصور النموذجية...",

    // Results section
    resultsTitle: "نتائج البحث",
    resultsFound: "تم العثور على {count} نتيجة",
    resultsFoundPlural: "تم العثور على {count} نتائج",

    // Analysis section
    analysisTitle: "تحليل الميزات",
    featureTypeLabel: "نوع الميزة:",
    analyzeBtn: "تحليل الصورة",
    originalImageTitle: "الصورة الأصلية",
    visualizationTitle: "تصور الميزات",
    statisticsTitle: "الإحصائيات",

    // Stats labels
    featureType: "نوع الميزة",
    featureCount: "عدد الميزات",
    areaPercentage: "نسبة المساحة",
    totalPixels: "إجمالي البكسلات",

    // Explanation and Analysis sections
    explanationTitle: "شرح التحليل",
    keySummaryTitle: "ملخص النتائج الرئيسية",
    applicationsTitle: "التطبيقات العملية",

    // Feature type explanations
    vegetationTypeExplanation:
      "يكتشف تحليل الغطاء النباتي الحياة النباتية ويقيّم صحتها بناء على الخصائص الطيفية، مفيد للزراعة والغابات والمراقبة البيئية.",
    waterTypeExplanation:
      "يحدد تحليل المياه المسطحات المائية ويصنفها حسب العمق والوضوح، مفيد لمراقبة الفيضانات والدراسات الساحلية وإدارة موارد المياه.",
    urbanTypeExplanation:
      "يكتشف التحليل الحضري المناطق المبنية ويصنفها حسب الكثافة والاستخدام، مفيد للتخطيط الحضري ومراقبة التنمية ودراسات السكان.",
    cloudTypeExplanation:
      "يحدد تحليل السحب غطاء السحب وأنواعها، مفيد لتقييم جودة الصورة للمراقبة الأرضية والدراسات الجوية.",
    defaultTypeExplanation:
      "تحليل الميزات في صور الأقمار الصناعية باستخدام الخصائص الطيفية والمكانية.",

    // Statistics explanations
    totalPixelsExplanation: "إجمالي عدد البكسلات التي تم تحليلها في الصورة.",
    vegetationCountExplanation: "عدد البكسلات المحددة كغطاء نباتي.",
    vegetationPercentageExplanation: "نسبة الصورة المغطاة بالنباتات.",
    healthyPercentageExplanation:
      "نسبة الغطاء النباتي المصنفة كصحية (باللون الأخضر الداكن في التصور).",
    moderatePercentageExplanation:
      "نسبة الغطاء النباتي المصنفة كمعتدلة الصحة (باللون الأخضر المتوسط في التصور).",
    stressedPercentageExplanation:
      "نسبة الغطاء النباتي المصنفة كمجهدة (باللون الأخضر المصفر في التصور).",
    averageNDVIExplanation:
      "متوسط قيمة مؤشر الاختلاف النباتي الطبيعي. القيم الأعلى تشير إلى نباتات أكثر صحة.",
    coverageCategoryExplanation:
      "تصنيف تغطية الغطاء النباتي من الحد الأدنى إلى المرتفع جدًا.",
    healthStatusExplanation: "التقييم العام لصحة الغطاء النباتي في الصورة.",
    waterCountExplanation: "عدد البكسلات المحددة كمياه.",
    waterPercentageExplanation: "نسبة الصورة المغطاة بالمياه.",
    deepWaterPercentageExplanation:
      "نسبة المياه المصنفة كعميقة (باللون الأزرق الداكن في التصور).",
    shallowWaterPercentageExplanation:
      "نسبة المياه المصنفة كضحلة (باللون الأزرق المتوسط في التصور).",
    turbidWaterPercentageExplanation:
      "نسبة المياه المصنفة كعكرة/محملة بالرواسب (باللون الأزرق المخضر الفاتح في التصور).",
    shorelineIndexExplanation:
      "قياس نسبي لتعقيد خط الشاطئ. القيم الأعلى تشير إلى شواطئ أكثر تعقيدًا مع المزيد من المداخل وأشباه الجزر.",
    waterBodyTypeExplanation: "تصنيف المسطح المائي (محيط، بحيرة، نهر، إلخ).",
    clarityCategoryExplanation:
      "تقييم عام لوضوح المسطحات المائية (صافية، عكرة، مختلطة).",

    // Footer
    footerText: "تم التطوير بواسطة",
    footerText2:
      "باستخدام واجهة برمجة حاسوب مايكروسوفت الكوكبي. هذا مشروع عرض تقني.",
  },
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners
  searchBtn.addEventListener("click", handleSearch);
  sampleBtn.addEventListener("click", handleGetSample);
  analyzeBtn.addEventListener("click", handleAnalyze);
  uploadBtn.addEventListener("click", handleUpload);
  fileUpload.addEventListener("change", handleFileSelect);

  // Feature type change handler - show appropriate description
  featureTypeSelect.addEventListener("change", updateFeatureDescription);

  // Language switcher
  langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      switchLanguage(btn.getAttribute("data-lang"));
    });
  });

  // Tab navigation
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;

      // Hide all tab contents and remove active class from buttons
      tabContents.forEach((content) => content.classList.remove("active"));
      tabBtns.forEach((button) => button.classList.remove("active"));

      // Show the selected tab content and make button active
      document.getElementById(tabId).classList.add("active");
      btn.classList.add("active");

      // Load samples if needed
      if (tabId === "samples-tab") {
        loadSampleImages();
      }
    });
  });

  // File Drop functionality
  ["dragover", "dragenter"].forEach((eventName) => {
    fileDropArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    fileDropArea.addEventListener(eventName, unhighlight, false);
  });

  fileDropArea.addEventListener("drop", handleDrop, false);

  // Initialize feature description on load
  updateFeatureDescription();

  // Initialize language
  const savedLang = localStorage.getItem("language") || "en";
  switchLanguage(savedLang);
});

// Language Functions
function switchLanguage(lang) {
  // Save to state and localStorage
  currentLang = lang;
  localStorage.setItem("language", lang);

  // Set active button
  langBtns.forEach((btn) => {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Set text direction
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

  // Update all texts with translations
  document.querySelectorAll("[data-lang-key]").forEach((element) => {
    const key = element.getAttribute("data-lang-key");
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });

  // Update select options
  updateSelectOptions(featureTypeSelect, [
    { value: "vegetation", key: "vegetationOption" },
    { value: "water", key: "waterOption" },
    { value: "urban", key: "urbanOption" },
    { value: "clouds", key: "cloudsOption" },
  ]);

  // Update feature description
  updateFeatureDescription();
}

function updateSelectOptions(selectElement, options) {
  options.forEach((option) => {
    const optElement = selectElement.querySelector(
      `option[value="${option.value}"]`
    );
    if (
      optElement &&
      translations[currentLang] &&
      translations[currentLang][option.key]
    ) {
      optElement.textContent = translations[currentLang][option.key];
    }
  });
}

// Event Handlers
function highlight(e) {
  e.preventDefault();
  e.stopPropagation();
  fileDropArea.classList.add("is-active");
}

function unhighlight(e) {
  e.preventDefault();
  e.stopPropagation();
  fileDropArea.classList.remove("is-active");
}

// Show appropriate feature description based on selected feature type
function updateFeatureDescription() {
  // Hide all descriptions first
  document.querySelectorAll(".analyzer-description").forEach((desc) => {
    desc.classList.add("hidden");
  });

  // Show the selected feature description
  const selectedFeature = featureTypeSelect.value;
  const descElement = document.getElementById(`${selectedFeature}-description`);
  if (descElement) {
    descElement.classList.remove("hidden");
  }
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length) {
    fileUpload.files = files;
    handleFileSelect();
  }
}

function handleFileSelect() {
  if (!fileUpload.files || !fileUpload.files[0]) return;

  uploadedFile = fileUpload.files[0];

  // Display file info
  fileName.textContent = `${
    translations[currentLang].selectedFile || "File"
  }: ${uploadedFile.name}`;
  fileSize.textContent = `${
    currentLang === "ar" ? "الحجم" : "Size"
  }: ${formatFileSize(uploadedFile.size)}`;

  // Show preview
  const reader = new FileReader();
  reader.onload = function (e) {
    uploadImagePreview.src = e.target.result;
    uploadPreview.classList.remove("hidden");
  };
  reader.readAsDataURL(uploadedFile);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
}

async function handleUpload() {
  try {
    if (!uploadedFile) {
      throw new Error(
        currentLang === "ar"
          ? "الرجاء اختيار ملف للرفع"
          : "Please select a file to upload"
      );
    }

    // Show loading state
    uploadBtn.textContent =
      currentLang === "ar" ? "جاري الرفع..." : "Uploading...";
    uploadBtn.disabled = true;

    // Create form data
    const formData = new FormData();
    formData.append("image", uploadedFile);

    // Make upload request
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Update UI with success
    uploadBtn.textContent =
      currentLang === "ar" ? "تم الرفع بنجاح!" : "Upload Successful!";

    // Set the uploaded image URL for analysis
    selectedImageUrl = data.file.url;

    // Show analysis section
    analysisSection.classList.remove("hidden");

    // Set the original image
    originalImage.src = data.file.url;

    // Hide analysis results
    analysisResults.classList.add("hidden");

    // Scroll to analysis section
    analysisSection.scrollIntoView({ behavior: "smooth" });

    // Reset button after delay
    setTimeout(() => {
      uploadBtn.textContent =
        translations[currentLang].uploadBtn || "Upload Image";
      uploadBtn.disabled = false;
    }, 2000);
  } catch (error) {
    console.error("Upload error:", error);
    alert(`${currentLang === "ar" ? "خطأ" : "Error"}: ${error.message}`);

    // Reset state
    uploadBtn.textContent =
      translations[currentLang].uploadBtn || "Upload Image";
    uploadBtn.disabled = false;
  }
}

async function loadSampleImages() {
  try {
    // Show loading state
    samplesGrid.innerHTML = `<p class="loading-text">${
      translations[currentLang].loadingSamples || "Loading sample images..."
    }</p>`;

    // Make API request to get sample images
    const response = await fetch("/api/samples");
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Update the UI with sample images
    if (data.samples && data.samples.length > 0) {
      samplesGrid.innerHTML = "";

      // Create image cards for each sample
      data.samples.forEach((sample) => {
        const card = document.createElement("div");
        card.className = "image-card";
        card.dataset.url = sample.url;

        // Extract file name without extension for display
        const fileName = sample.name.split(".")[0].replace(/_/g, " ");

        // Create card content
        card.innerHTML = `
          <img src="${sample.url}" alt="${fileName}">
          <div class="image-info">
            <h3>${fileName}</h3>
            <p>${currentLang === "ar" ? "صورة عينة" : "Sample Image"}</p>
          </div>
        `;

        // Add click event
        card.addEventListener("click", () => {
          // Deselect all cards
          document.querySelectorAll(".image-card").forEach((c) => {
            c.classList.remove("selected");
          });

          // Select this card
          card.classList.add("selected");

          // Update state
          selectedImageUrl = sample.url;

          // Show analysis section
          analysisSection.classList.remove("hidden");

          // Set the original image
          originalImage.src = sample.url;

          // Hide analysis results
          analysisResults.classList.add("hidden");

          // Scroll to analysis section
          analysisSection.scrollIntoView({ behavior: "smooth" });
        });

        // Add to grid
        samplesGrid.appendChild(card);
      });
    } else {
      samplesGrid.innerHTML = `<p class="no-samples">${
        translations[currentLang].noSamples || "No sample images available."
      }</p>`;
    }
  } catch (error) {
    console.error("Error loading sample images:", error);
    samplesGrid.innerHTML = `<p class="error-text">${
      translations[currentLang].errorLoadingSamples ||
      "Error loading sample images. Please try again."
    }</p>`;
  }
}

async function handleSearch() {
  try {
    // Show loading state
    searchBtn.textContent = "Searching...";
    searchBtn.disabled = true;

    // Get search parameters
    const collections = collectionsSelect.value;
    const bbox = bboxInput.value;
    const limit = limitInput.value;

    // Make API request
    const response = await fetch(
      `/api/search?collections=${collections}&bbox=${bbox}&limit=${limit}`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Update state
    currentItems = data.items || [];

    // Display results
    displayResults(data);

    // Reset state
    searchBtn.textContent = "Search";
    searchBtn.disabled = false;
  } catch (error) {
    console.error("Search error:", error);
    alert(`Error: ${error.message}`);

    // Reset state
    searchBtn.textContent = "Search";
    searchBtn.disabled = false;
  }
}

async function handleGetSample() {
  try {
    // Show loading state
    sampleBtn.textContent = "Getting Sample...";
    sampleBtn.disabled = true;

    // Get collection
    const collection = collectionsSelect.value;

    // Make API request
    const response = await fetch(`/api/sample?collection=${collection}`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Update state
    currentItems = [data];

    // Display sample
    displayResults({ count: 1, items: [data] });

    // Reset state
    sampleBtn.textContent = "Get Sample Image";
    sampleBtn.disabled = false;
  } catch (error) {
    console.error("Sample error:", error);
    alert(`Error: ${error.message}`);

    // Reset state
    sampleBtn.textContent = "Get Sample Image";
    sampleBtn.disabled = false;
  }
}

async function handleAnalyze() {
  try {
    if (!selectedImageUrl) {
      throw new Error("Please select an image to analyze");
    }

    // Show loading state
    analyzeBtn.textContent = "Analyzing...";
    analyzeBtn.disabled = true;

    // Get feature type
    const featureType = featureTypeSelect.value;

    // Make API request
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: selectedImageUrl,
        featureType,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Display analysis results
    displayAnalysisResults(data);

    // Reset state
    analyzeBtn.textContent = "Analyze Image";
    analyzeBtn.disabled = false;
  } catch (error) {
    console.error("Analysis error:", error);
    alert(`Error: ${error.message}`);

    // Reset state
    analyzeBtn.textContent = "Analyze Image";
    analyzeBtn.disabled = false;
  }
}

// Helper Functions
function displayResults(data) {
  // Clear previous results
  imageGrid.innerHTML = "";

  // Show results count
  const countText =
    data.count === 1
      ? (
          translations[currentLang].resultsFound || "Found {count} result"
        ).replace("{count}", data.count)
      : (
          translations[currentLang].resultsFoundPlural ||
          "Found {count} results"
        ).replace("{count}", data.count);

  resultsCount.textContent = countText;

  // Show results section
  resultsSection.classList.remove("hidden");

  // Hide analysis section
  analysisSection.classList.add("hidden");
  analysisResults.classList.add("hidden");

  // Display each item
  data.items.forEach((item) => {
    // Find suitable visual assets
    const visualAssets = [];

    // Check for visual assets in different collections
    if (item.assets) {
      // Sentinel-2 visual assets
      if (item.assets.visual) {
        visualAssets.push({
          name: "RGB Natural Color",
          url: item.assets.visual.href,
        });
      }

      // Landsat visual assets
      if (item.assets.rendered_preview) {
        visualAssets.push({
          name: "Preview",
          url: item.assets.rendered_preview.href,
        });
      }

      // NAIP visual assets
      if (item.assets.image) {
        visualAssets.push({
          name: "RGB Image",
          url: item.assets.image.href,
        });
      }

      // Fallback: try to find any RGB bands or previews
      if (visualAssets.length === 0) {
        if (item.assets.thumbnail) {
          visualAssets.push({
            name: "Thumbnail",
            url: item.assets.thumbnail.href,
          });
        }
      }
    }

    // If we found no usable assets, skip this item
    if (visualAssets.length === 0) {
      return;
    }

    // Create card for each visual asset
    visualAssets.forEach((asset) => {
      const card = document.createElement("div");
      card.className = "image-card";
      card.dataset.url = asset.url;

      // Create card content
      const dateStr = item.properties?.datetime
        ? new Date(item.properties.datetime).toLocaleDateString(
            currentLang === "ar" ? "ar-SA" : "en-US"
          )
        : currentLang === "ar"
        ? "تاريخ غير معروف"
        : "Unknown Date";

      const dateLabel = currentLang === "ar" ? "التاريخ" : "Date";
      const collectionLabel = currentLang === "ar" ? "المجموعة" : "Collection";
      const collectionValue =
        item.collection || (currentLang === "ar" ? "غير معروف" : "Unknown");

      card.innerHTML = `
        <img src="${asset.url}" alt="${asset.name}">
        <div class="image-info">
          <h3>${asset.name}</h3>
          <p>${dateLabel}: ${dateStr}</p>
          <p>${collectionLabel}: ${collectionValue}</p>
        </div>
      `;

      // Add click event
      card.addEventListener("click", () => {
        // Deselect all cards
        document.querySelectorAll(".image-card").forEach((c) => {
          c.classList.remove("selected");
        });

        // Select this card
        card.classList.add("selected");

        // Update state
        selectedImageUrl = asset.url;

        // Show analysis section
        analysisSection.classList.remove("hidden");

        // Set the original image
        originalImage.src = asset.url;

        // Hide analysis results
        analysisResults.classList.add("hidden");

        // Scroll to analysis section
        analysisSection.scrollIntoView({ behavior: "smooth" });
      });

      // Add to grid
      imageGrid.appendChild(card);
    });
  });
}

function displayAnalysisResults(data) {
  // Show analysis results section
  analysisResults.classList.remove("hidden");

  // Set visualization image
  visualizationImage.src = data.visualizationImageBase64;

  // Clear previous stats
  statsContainer.innerHTML = "";

  // Add feature-specific class to enable feature-specific styling
  statsContainer.className = `stats-container feature-${data.featureType}`;

  // Create a visual header with feature type badge
  const headerSection = document.createElement("div");
  headerSection.className = "results-header";

  // Add a feature badge
  let featureIcon = "";
  let featureColor = "";

  switch (data.featureType) {
    case "vegetation":
      featureIcon = "leaf";
      featureColor = "#4CAF50";
      break;
    case "water":
      featureIcon = "water";
      featureColor = "#2196F3";
      break;
    case "urban":
      featureIcon = "city";
      featureColor = "#E91E63";
      break;
    case "clouds":
      featureIcon = "cloud";
      featureColor = "#9E9E9E";
      break;
    default:
      featureIcon = "chart-bar";
      featureColor = "#0078d4";
  }

  const featureTypeName = capitalizeFirstLetter(data.featureType, currentLang);

  headerSection.innerHTML = `
    <div class="feature-badge" style="background-color: ${featureColor}">
      <i class="fas fa-${featureIcon}"></i>
      <span>${featureTypeName} ${
    translations[currentLang].analysisResults || "Analysis Results"
  }</span>
    </div>
    <div class="result-actions">
      <button class="action-btn print-btn" onclick="printAnalysisResults()">
        <i class="fas fa-print"></i>
        <span>${currentLang === "ar" ? "طباعة" : "Print"}</span>
      </button>
      <button class="action-btn share-btn" onclick="shareAnalysisResults()">
        <i class="fas fa-share-alt"></i>
        <span>${currentLang === "ar" ? "مشاركة" : "Share"}</span>
      </button>
    </div>
    <div class="analysis-timestamp">
      <i class="fas fa-clock"></i> ${new Date().toLocaleString(
        currentLang === "ar" ? "ar-SA" : "en-US"
      )}
    </div>
  `;

  statsContainer.appendChild(headerSection);

  // Create summary panel for key findings and applications
  const summaryPanel = document.createElement("div");
  summaryPanel.className = "summary-panel";

  // Generate key findings and application insights
  const keyFindings = generateKeyFindings(data);
  const applicationInsights = generateApplicationInsights(data);

  // Create findings summary card
  const findingsCard = document.createElement("div");
  findingsCard.className = "summary-card findings-card";
  findingsCard.innerHTML = `
    <h4 class="key-findings-title">${
      translations[currentLang].keySummaryTitle || "Key Findings"
    }</h4>
    <ul class="key-findings">
      ${keyFindings.map((finding) => `<li>${finding}</li>`).join("")}
    </ul>
  `;

  // Create applications card
  const applicationsCard = document.createElement("div");
  applicationsCard.className = "summary-card applications-card";
  applicationsCard.innerHTML = `
    <h4 class="applications-title">${
      translations[currentLang].applicationsTitle || "Practical Applications"
    }</h4>
    <p>${applicationInsights}</p>
  `;

  // Add cards to summary panel
  summaryPanel.appendChild(findingsCard);
  summaryPanel.appendChild(applicationsCard);

  // Add summary panel to stats container
  statsContainer.appendChild(summaryPanel);

  // Add metrics with explanations
  const stats = [];

  // Feature-specific metrics
  populateFeatureMetrics(data, stats);

  // Group stats by category
  const statsByCategory = {};

  stats.forEach((stat) => {
    const category = stat.category || "other";
    if (!statsByCategory[category]) {
      statsByCategory[category] = [];
    }
    statsByCategory[category].push(stat);
  });

  // Category labels
  const categoryLabels = {
    basic: translations[currentLang].basicCategory || "Basic Information",
    coverage:
      translations[currentLang].coverageCategory || "Coverage Statistics",
    health: translations[currentLang].healthCategory || "Health Indicators",
    waterType: translations[currentLang].waterTypeCategory || "Water Types",
    urbanType: translations[currentLang].urbanTypeCategory || "Urban Zones",
    shoreline:
      translations[currentLang].shorelineCategory || "Shoreline Metrics",
    classification:
      translations[currentLang].classificationCategory || "Classifications",
    index: translations[currentLang].indexCategory || "Index Values",
    other: translations[currentLang].otherCategory || "Other Metrics",
  };

  // Order of categories to display
  const categoryOrder = [
    "basic",
    "coverage",
    "classification",
    "waterType",
    "health",
    "urbanType",
    "shoreline",
    "index",
    "other",
  ];

  // Create metrics section for each category
  categoryOrder.forEach((category) => {
    if (statsByCategory[category] && statsByCategory[category].length > 0) {
      // Create category section
      const categorySection = document.createElement("div");
      categorySection.className = "metrics-category";

      // Add category heading
      const categoryHeading = document.createElement("h4");
      categoryHeading.className = "category-heading";
      categoryHeading.textContent = categoryLabels[category];
      categorySection.appendChild(categoryHeading);

      // Create metrics grid for this category
      const metricsGrid = document.createElement("div");
      metricsGrid.className = "metrics-grid";

      // Add stat items to this category
      statsByCategory[category].forEach((stat) => {
        const statItem = document.createElement("div");
        statItem.className = "stat-item";

        statItem.innerHTML = `
          <div class="stat-label">${stat.label}</div>
          <div class="stat-value">${stat.value}</div>
          ${
            stat.explanation
              ? `<div class="stat-explanation">${stat.explanation}</div>`
              : ""
          }
        `;

        metricsGrid.appendChild(statItem);
      });

      categorySection.appendChild(metricsGrid);
      statsContainer.appendChild(categorySection);
    }
  });

  // Enhanced explanation of results
  if (data.explanationHtml) {
    const explanationContent = document.createElement("div");
    explanationContent.className = "explanation-content";
    explanationContent.innerHTML = `
      <h4>${
        translations[currentLang].explanationTitle || "Analysis Explanation"
      }</h4>
      <div class="explanation-text">${data.explanationHtml}</div>
    `;
    statsContainer.appendChild(explanationContent);
  }

  // Scroll to show results
  analysisResults.scrollIntoView({ behavior: "smooth" });
}

// Helper function to populate metrics based on feature type
function populateFeatureMetrics(data, stats) {
  // Basic metrics for all feature types
  stats.push({
    label: translations[currentLang].featureType || "Feature Type",
    value: capitalizeFirstLetter(data.featureType, currentLang),
    explanation: getFeatureTypeExplanation(data.featureType),
    category: "basic",
  });

  if (data.totalPixels) {
    stats.push({
      label: translations[currentLang].totalPixels || "Total Pixels",
      value: numberWithCommas(data.totalPixels),
      explanation:
        translations[currentLang].totalPixelsExplanation ||
        "The total number of pixels analyzed in the image.",
      category: "basic",
    });
  }

  // Add feature-specific metrics with explanations
  switch (data.featureType) {
    case "vegetation":
      // Coverage metrics
      if (data.vegetationCount) {
        stats.push({
          label:
            translations[currentLang].vegetationCount || "Vegetation Pixels",
          value: numberWithCommas(data.vegetationCount),
          explanation:
            translations[currentLang].vegetationCountExplanation ||
            "The number of pixels identified as vegetation.",
          category: "coverage",
        });
      }
      if (data.vegetationPercentage) {
        stats.push({
          label:
            translations[currentLang].vegetationPercentage ||
            "Vegetation Coverage",
          value: `${data.vegetationPercentage}%`,
          explanation:
            translations[currentLang].vegetationPercentageExplanation ||
            "The percentage of the image covered by vegetation.",
          category: "coverage",
        });
      }

      // Health metrics
      if (data.healthyPercentage) {
        stats.push({
          label:
            translations[currentLang].healthyPercentage || "Healthy Vegetation",
          value: `${data.healthyPercentage}%`,
          explanation:
            translations[currentLang].healthyPercentageExplanation ||
            "The percentage of vegetation classified as healthy (dark green in visualization).",
          category: "health",
        });
      }
      if (data.moderatePercentage) {
        stats.push({
          label:
            translations[currentLang].moderatePercentage ||
            "Moderate Vegetation",
          value: `${data.moderatePercentage}%`,
          explanation:
            translations[currentLang].moderatePercentageExplanation ||
            "The percentage of vegetation classified as moderately healthy (medium green in visualization).",
          category: "health",
        });
      }
      if (data.stressedPercentage) {
        stats.push({
          label:
            translations[currentLang].stressedPercentage ||
            "Stressed Vegetation",
          value: `${data.stressedPercentage}%`,
          explanation:
            translations[currentLang].stressedPercentageExplanation ||
            "The percentage of vegetation classified as stressed (yellow-green in visualization).",
          category: "health",
        });
      }

      // Index metrics
      if (data.averageNDVI) {
        stats.push({
          label: translations[currentLang].averageNDVI || "Average NDVI",
          value: data.averageNDVI,
          explanation:
            translations[currentLang].averageNDVIExplanation ||
            "The average Normalized Difference Vegetation Index value. Higher values indicate healthier vegetation.",
          category: "index",
        });
      }

      // Classification metrics
      if (data.coverageCategory) {
        stats.push({
          label:
            translations[currentLang].coverageCategory || "Coverage Category",
          value: data.coverageCategory,
          explanation:
            translations[currentLang].coverageCategoryExplanation ||
            "Classification of vegetation coverage from Minimal to Very High.",
          category: "classification",
        });
      }
      if (data.healthStatus) {
        stats.push({
          label: translations[currentLang].healthStatus || "Health Status",
          value: data.healthStatus,
          explanation:
            translations[currentLang].healthStatusExplanation ||
            "Overall health assessment of the vegetation in the image.",
          category: "classification",
        });
      }
      break;

    case "water":
      // Coverage metrics
      if (data.waterCount) {
        stats.push({
          label: translations[currentLang].waterCount || "Water Pixels",
          value: numberWithCommas(data.waterCount),
          explanation:
            translations[currentLang].waterCountExplanation ||
            "The number of pixels identified as water.",
          category: "coverage",
        });
      }
      if (data.waterPercentage) {
        stats.push({
          label: translations[currentLang].waterPercentage || "Water Coverage",
          value: `${data.waterPercentage}%`,
          explanation:
            translations[currentLang].waterPercentageExplanation ||
            "The percentage of the image covered by water.",
          category: "coverage",
        });
      }

      // Water type metrics
      if (data.deepWaterPercentage) {
        stats.push({
          label: translations[currentLang].deepWaterPercentage || "Deep Water",
          value: `${data.deepWaterPercentage}%`,
          explanation:
            translations[currentLang].deepWaterPercentageExplanation ||
            "The percentage of water classified as deep (dark blue in visualization).",
          category: "waterType",
        });
      }
      if (data.shallowWaterPercentage) {
        stats.push({
          label:
            translations[currentLang].shallowWaterPercentage || "Shallow Water",
          value: `${data.shallowWaterPercentage}%`,
          explanation:
            translations[currentLang].shallowWaterPercentageExplanation ||
            "The percentage of water classified as shallow (medium blue in visualization).",
          category: "waterType",
        });
      }
      if (data.turbidWaterPercentage) {
        stats.push({
          label:
            translations[currentLang].turbidWaterPercentage || "Turbid Water",
          value: `${data.turbidWaterPercentage}%`,
          explanation:
            translations[currentLang].turbidWaterPercentageExplanation ||
            "The percentage of water classified as turbid/sediment-laden (light blue-green in visualization).",
          category: "waterType",
        });
      }

      // Shoreline metrics
      if (data.shorelineIndex) {
        stats.push({
          label:
            translations[currentLang].shorelineIndex || "Shoreline Complexity",
          value: data.shorelineIndex,
          explanation:
            translations[currentLang].shorelineIndexExplanation ||
            "A relative measure of shoreline complexity. Higher values indicate more complex shorelines with more inlets and peninsulas.",
          category: "shoreline",
        });
      }

      // Classification metrics
      if (data.waterBodyType) {
        stats.push({
          label: translations[currentLang].waterBodyType || "Water Body Type",
          value: data.waterBodyType,
          explanation:
            translations[currentLang].waterBodyTypeExplanation ||
            "Classification of the water feature (ocean, lake, river, etc.).",
          category: "classification",
        });
      }
      if (data.clarityCategory) {
        stats.push({
          label: translations[currentLang].clarityCategory || "Water Clarity",
          value: data.clarityCategory,
          explanation:
            translations[currentLang].clarityCategoryExplanation ||
            "Overall clarity assessment of the water bodies (clear, turbid, mixed).",
          category: "classification",
        });
      }
      break;

    case "urban":
      // Coverage metrics
      if (data.urbanCount) {
        stats.push({
          label: translations[currentLang].urbanCount || "Urban Pixels",
          value: numberWithCommas(data.urbanCount),
          explanation:
            translations[currentLang].urbanCountExplanation ||
            "The number of pixels identified as urban.",
          category: "coverage",
        });
      }
      if (data.urbanPercentage) {
        stats.push({
          label: translations[currentLang].urbanPercentage || "Urban Coverage",
          value: `${data.urbanPercentage}%`,
          explanation:
            translations[currentLang].urbanPercentageExplanation ||
            "The percentage of the image covered by urban features.",
          category: "coverage",
        });
      }

      // Urban type metrics
      if (data.denseUrbanPercentage) {
        stats.push({
          label:
            translations[currentLang].denseUrbanPercentage || "Dense Urban",
          value: `${data.denseUrbanPercentage}%`,
          explanation:
            translations[currentLang].denseUrbanPercentageExplanation ||
            "The percentage of urban areas classified as dense (red in visualization).",
          category: "urbanType",
        });
      }
      if (data.suburbanPercentage) {
        stats.push({
          label: translations[currentLang].suburbanPercentage || "Suburban",
          value: `${data.suburbanPercentage}%`,
          explanation:
            translations[currentLang].suburbanPercentageExplanation ||
            "The percentage of urban areas classified as suburban (orange in visualization).",
          category: "urbanType",
        });
      }
      if (data.industrialPercentage) {
        stats.push({
          label: translations[currentLang].industrialPercentage || "Industrial",
          value: `${data.industrialPercentage}%`,
          explanation:
            translations[currentLang].industrialPercentageExplanation ||
            "The percentage of urban areas classified as industrial (purple in visualization).",
          category: "urbanType",
        });
      }
      if (data.roadPercentage) {
        stats.push({
          label: translations[currentLang].roadPercentage || "Road Network",
          value: `${data.roadPercentage}%`,
          explanation:
            translations[currentLang].roadPercentageExplanation ||
            "The percentage of urban areas classified as road networks (gray in visualization).",
          category: "urbanType",
        });
      }
      // ... rest of urban metrics
      break;

    case "clouds":
      // ... cloud metrics with categories
      break;
  }
}

// Helper function to get feature type explanation
function getFeatureTypeExplanation(featureType) {
  const explanations = {
    vegetation:
      translations[currentLang].vegetationTypeExplanation ||
      "Vegetation analysis detects plant life and assesses its health based on spectral characteristics, useful for agriculture, forestry, and environmental monitoring.",
    water:
      translations[currentLang].waterTypeExplanation ||
      "Water analysis identifies water bodies and classifies them by depth and clarity, useful for flood monitoring, coastal studies, and water resource management.",
    urban:
      translations[currentLang].urbanTypeExplanation ||
      "Urban analysis detects built-up areas and categorizes them by density and use, useful for urban planning, development monitoring, and population studies.",
    clouds:
      translations[currentLang].cloudTypeExplanation ||
      "Cloud analysis identifies cloud cover and types, useful for assessing image quality for earth observation and meteorological studies.",
  };

  return (
    explanations[featureType] ||
    translations[currentLang].defaultTypeExplanation ||
    "Analysis of features in satellite imagery using spectral and spatial characteristics."
  );
}

// Generate key findings based on the analysis results
function generateKeyFindings(data) {
  const findings = [];

  switch (data.featureType) {
    case "vegetation":
      // Overall coverage
      if (data.vegetationPercentage) {
        let coverageText =
          keyFindingsTranslations.vegetationCoverage[currentLang] ||
          keyFindingsTranslations.vegetationCoverage.en;
        coverageText = coverageText
          .replace("{percentage}", data.vegetationPercentage)
          .replace(
            "{category}",
            data.coverageCategory
              ? data.coverageCategory.toLowerCase()
              : "moderate"
          );
        findings.push(coverageText);
      }

      // Vegetation health
      if (data.healthStatus) {
        let healthText =
          keyFindingsTranslations.vegetationHealth[currentLang] ||
          keyFindingsTranslations.vegetationHealth.en;
        healthText = healthText.replace(
          "{status}",
          data.healthStatus.toLowerCase()
        );
        findings.push(healthText);
      }

      // Health breakdown
      if (
        data.healthyPercentage &&
        data.moderatePercentage &&
        data.stressedPercentage
      ) {
        let compositionText =
          keyFindingsTranslations.vegetationComposition[currentLang] ||
          keyFindingsTranslations.vegetationComposition.en;
        compositionText = compositionText
          .replace("{healthy}", data.healthyPercentage)
          .replace("{moderate}", data.moderatePercentage)
          .replace("{stressed}", data.stressedPercentage);
        findings.push(compositionText);
      }

      // NDVI interpretation
      if (data.averageNDVI) {
        const ndviValue = parseFloat(data.averageNDVI);
        let ndviText;

        if (ndviValue > 0.6) {
          ndviText =
            keyFindingsTranslations.ndviVeryHealthy[currentLang] ||
            keyFindingsTranslations.ndviVeryHealthy.en;
        } else if (ndviValue > 0.4) {
          ndviText =
            keyFindingsTranslations.ndviModerate[currentLang] ||
            keyFindingsTranslations.ndviModerate.en;
        } else if (ndviValue > 0.2) {
          ndviText =
            keyFindingsTranslations.ndviSparse[currentLang] ||
            keyFindingsTranslations.ndviSparse.en;
        } else {
          ndviText =
            keyFindingsTranslations.ndviStressed[currentLang] ||
            keyFindingsTranslations.ndviStressed.en;
        }

        ndviText = ndviText.replace("{ndvi}", data.averageNDVI);
        findings.push(ndviText);
      }
      break;

    case "water":
      // Water coverage
      if (data.waterPercentage) {
        let coverageText =
          keyFindingsTranslations.waterCoverage[currentLang] ||
          keyFindingsTranslations.waterCoverage.en;
        coverageText = coverageText.replace(
          "{percentage}",
          data.waterPercentage
        );
        findings.push(coverageText);
      }

      // Water body type
      if (data.waterBodyType) {
        let typeText =
          keyFindingsTranslations.waterBodyType[currentLang] ||
          keyFindingsTranslations.waterBodyType.en;
        typeText = typeText.replace("{type}", data.waterBodyType.toLowerCase());
        findings.push(typeText);
      }

      // Water composition
      if (
        data.deepWaterPercentage &&
        data.shallowWaterPercentage &&
        data.turbidWaterPercentage
      ) {
        let compositionText =
          keyFindingsTranslations.waterComposition[currentLang] ||
          keyFindingsTranslations.waterComposition.en;
        compositionText = compositionText
          .replace("{deep}", data.deepWaterPercentage)
          .replace("{shallow}", data.shallowWaterPercentage)
          .replace("{turbid}", data.turbidWaterPercentage);
        findings.push(compositionText);
      }

      // Water clarity
      if (data.clarityCategory) {
        let clarityText =
          keyFindingsTranslations.waterClarity[currentLang] ||
          keyFindingsTranslations.waterClarity.en;
        clarityText = clarityText.replace(
          "{clarity}",
          data.clarityCategory.toLowerCase()
        );
        findings.push(clarityText);
      }

      // Shoreline complexity
      if (data.shorelineIndex) {
        const shorelineValue = parseFloat(data.shorelineIndex);
        let shorelineText;

        if (shorelineValue > 2.0) {
          shorelineText =
            keyFindingsTranslations.shorelineHighlyComplex[currentLang] ||
            keyFindingsTranslations.shorelineHighlyComplex.en;
        } else if (shorelineValue > 1.0) {
          shorelineText =
            keyFindingsTranslations.shorelineModeratelyComplex[currentLang] ||
            keyFindingsTranslations.shorelineModeratelyComplex.en;
        } else {
          shorelineText =
            keyFindingsTranslations.shorelineSimple[currentLang] ||
            keyFindingsTranslations.shorelineSimple.en;
        }

        shorelineText = shorelineText.replace("{index}", data.shorelineIndex);
        findings.push(shorelineText);
      }
      break;

    case "urban":
      // Urban coverage
      if (data.urbanPercentage) {
        let coverageText =
          keyFindingsTranslations.urbanCoverage[currentLang] ||
          keyFindingsTranslations.urbanCoverage.en;
        coverageText = coverageText.replace(
          "{percentage}",
          data.urbanPercentage
        );
        findings.push(coverageText);
      }

      // Urbanization category
      if (data.urbanizationCategory) {
        let categoryText =
          keyFindingsTranslations.urbanCategory[currentLang] ||
          keyFindingsTranslations.urbanCategory.en;
        categoryText = categoryText.replace(
          "{category}",
          data.urbanizationCategory.toLowerCase()
        );
        findings.push(categoryText);
      }

      // Urban composition
      if (
        data.denseUrbanPercentage ||
        data.suburbanPercentage ||
        data.industrialPercentage ||
        data.roadPercentage
      ) {
        let components = [];

        if (data.denseUrbanPercentage > 5)
          components.push(
            `${data.denseUrbanPercentage}% ${
              currentLang === "ar" ? "حضري كثيف" : "dense urban"
            }`
          );
        if (data.suburbanPercentage > 5)
          components.push(
            `${data.suburbanPercentage}% ${
              currentLang === "ar" ? "ضواحي" : "suburban"
            }`
          );
        if (data.industrialPercentage > 5)
          components.push(
            `${data.industrialPercentage}% ${
              currentLang === "ar" ? "صناعي" : "industrial"
            }`
          );
        if (data.roadPercentage > 5)
          components.push(
            `${data.roadPercentage}% ${
              currentLang === "ar" ? "شبكات طرق" : "road networks"
            }`
          );

        if (components.length > 0) {
          let compositionText =
            keyFindingsTranslations.urbanComposition[currentLang] ||
            keyFindingsTranslations.urbanComposition.en;
          compositionText = compositionText.replace(
            "{components}",
            components.join(currentLang === "ar" ? "، " : ", ")
          );
          findings.push(compositionText);
        }
      }

      // Development pattern
      if (data.developmentPattern) {
        let patternText =
          keyFindingsTranslations.urbanDevelopmentPattern[currentLang] ||
          keyFindingsTranslations.urbanDevelopmentPattern.en;
        patternText = patternText.replace(
          "{pattern}",
          data.developmentPattern.toLowerCase()
        );
        findings.push(patternText);
      }

      // Fragmentation index
      if (data.fragmentationIndex) {
        const fragValue = parseFloat(data.fragmentationIndex);
        let fragText;

        if (fragValue > 15) {
          fragText =
            keyFindingsTranslations.fragmentationHighlyFragmented[
              currentLang
            ] || keyFindingsTranslations.fragmentationHighlyFragmented.en;
        } else if (fragValue > 8) {
          fragText =
            keyFindingsTranslations.fragmentationModeratelyFragmented[
              currentLang
            ] || keyFindingsTranslations.fragmentationModeratelyFragmented.en;
        } else {
          fragText =
            keyFindingsTranslations.fragmentationCompact[currentLang] ||
            keyFindingsTranslations.fragmentationCompact.en;
        }

        fragText = fragText.replace("{index}", data.fragmentationIndex);
        findings.push(fragText);
      }
      break;

    case "clouds":
      // Cloud coverage
      if (data.cloudPercentage) {
        let coverageText =
          keyFindingsTranslations.cloudCoverage[currentLang] ||
          keyFindingsTranslations.cloudCoverage.en;
        coverageText = coverageText.replace(
          "{percentage}",
          data.cloudPercentage
        );
        findings.push(coverageText);
      }

      // Cloud category
      if (data.cloudCategory) {
        let categoryText =
          keyFindingsTranslations.cloudCategory[currentLang] ||
          keyFindingsTranslations.cloudCategory.en;
        categoryText = categoryText.replace(
          "{category}",
          data.cloudCategory.toLowerCase()
        );
        findings.push(categoryText);
      }

      // Cloud composition
      if (data.thickCloudPercentage && data.thinCloudPercentage) {
        let compositionText =
          keyFindingsTranslations.cloudComposition[currentLang] ||
          keyFindingsTranslations.cloudComposition.en;
        compositionText = compositionText
          .replace("{thick}", data.thickCloudPercentage)
          .replace("{thin}", data.thinCloudPercentage);
        findings.push(compositionText);
      }

      // Cloud shadows
      if (data.shadowPercentage && parseFloat(data.shadowPercentage) > 5) {
        let shadowText =
          keyFindingsTranslations.cloudShadows[currentLang] ||
          keyFindingsTranslations.cloudShadows.en;
        shadowText = shadowText.replace("{percentage}", data.shadowPercentage);
        findings.push(shadowText);
      }

      // Image usability
      if (data.imageUsability) {
        let usabilityText =
          keyFindingsTranslations.imageUsability[currentLang] ||
          keyFindingsTranslations.imageUsability.en;
        usabilityText = usabilityText.replace(
          "{usability}",
          data.imageUsability.toLowerCase()
        );
        findings.push(usabilityText);
      }
      break;

    default:
      // Generic findings
      if (data.featureAreaPercentage) {
        let genericText =
          keyFindingsTranslations.genericFeatureDetection[currentLang] ||
          keyFindingsTranslations.genericFeatureDetection.en;
        genericText = genericText.replace(
          "{percentage}",
          data.featureAreaPercentage
        );
        findings.push(genericText);
      }
      break;
  }

  // If no findings were generated, add a default one
  if (findings.length === 0) {
    let defaultText =
      keyFindingsTranslations.defaultFinding[currentLang] ||
      keyFindingsTranslations.defaultFinding.en;
    defaultText = defaultText.replace(
      "{featureType}",
      capitalizeFirstLetter(data.featureType, currentLang)
    );
    findings.push(defaultText);
  }

  return findings;
}

// Generate practical applications based on the analysis results
function generateApplicationInsights(data) {
  switch (data.featureType) {
    case "vegetation":
      if (!data.healthStatus || !data.vegetationPercentage) {
        return (
          applicationInsightsTranslations.vegetationGeneric[currentLang] ||
          applicationInsightsTranslations.vegetationGeneric.en
        );
      }

      const vegPercentage = parseFloat(data.vegetationPercentage);
      const healthStatus = data.healthStatus.toLowerCase();

      if (vegPercentage > 70) {
        if (healthStatus.includes("healthy")) {
          return (
            applicationInsightsTranslations.vegetationHighHealthy[
              currentLang
            ] || applicationInsightsTranslations.vegetationHighHealthy.en
          );
        } else if (healthStatus.includes("stress")) {
          return (
            applicationInsightsTranslations.vegetationHighStressed[
              currentLang
            ] || applicationInsightsTranslations.vegetationHighStressed.en
          );
        } else {
          return (
            applicationInsightsTranslations.vegetationHighMixed[currentLang] ||
            applicationInsightsTranslations.vegetationHighMixed.en
          );
        }
      } else if (vegPercentage > 30) {
        if (healthStatus.includes("healthy")) {
          return (
            applicationInsightsTranslations.vegetationModerateHealthy[
              currentLang
            ] || applicationInsightsTranslations.vegetationModerateHealthy.en
          );
        } else {
          return (
            applicationInsightsTranslations.vegetationModerateStressed[
              currentLang
            ] || applicationInsightsTranslations.vegetationModerateStressed.en
          );
        }
      } else {
        return (
          applicationInsightsTranslations.vegetationLow[currentLang] ||
          applicationInsightsTranslations.vegetationLow.en
        );
      }

    case "water":
      if (!data.waterPercentage) {
        return (
          applicationInsightsTranslations.waterGeneric[currentLang] ||
          applicationInsightsTranslations.waterGeneric.en
        );
      }

      const waterPercentage = parseFloat(data.waterPercentage);
      const hasClarity = data.clarityCategory ? true : false;

      if (waterPercentage > 70) {
        if (
          hasClarity &&
          data.clarityCategory.toLowerCase().includes("turbid")
        ) {
          return (
            applicationInsightsTranslations.waterMajorTurbid[currentLang] ||
            applicationInsightsTranslations.waterMajorTurbid.en
          );
        } else {
          return (
            applicationInsightsTranslations.waterMajorClear[currentLang] ||
            applicationInsightsTranslations.waterMajorClear.en
          );
        }
      } else if (waterPercentage > 30) {
        if (
          data.waterBodyType &&
          data.waterBodyType.toLowerCase().includes("lake")
        ) {
          return (
            applicationInsightsTranslations.waterLake[currentLang] ||
            applicationInsightsTranslations.waterLake.en
          );
        } else if (
          data.waterBodyType &&
          data.waterBodyType.toLowerCase().includes("river")
        ) {
          return (
            applicationInsightsTranslations.waterRiver[currentLang] ||
            applicationInsightsTranslations.waterRiver.en
          );
        } else {
          return (
            applicationInsightsTranslations.waterGenericBody[currentLang] ||
            applicationInsightsTranslations.waterGenericBody.en
          );
        }
      } else {
        return (
          applicationInsightsTranslations.waterLimited[currentLang] ||
          applicationInsightsTranslations.waterLimited.en
        );
      }

    case "urban":
      if (!data.urbanPercentage) {
        return (
          applicationInsightsTranslations.urbanGeneric[currentLang] ||
          applicationInsightsTranslations.urbanGeneric.en
        );
      }

      const urbanPercentage = parseFloat(data.urbanPercentage);
      const hasPattern = data.developmentPattern ? true : false;

      if (urbanPercentage > 70) {
        if (
          hasPattern &&
          data.developmentPattern.toLowerCase().includes("compact")
        ) {
          return (
            applicationInsightsTranslations.urbanDenseCompact[currentLang] ||
            applicationInsightsTranslations.urbanDenseCompact.en
          );
        } else if (
          hasPattern &&
          data.developmentPattern.toLowerCase().includes("fragment")
        ) {
          return (
            applicationInsightsTranslations.urbanDenseFragmented[currentLang] ||
            applicationInsightsTranslations.urbanDenseFragmented.en
          );
        } else {
          return (
            applicationInsightsTranslations.urbanDenseGeneric[currentLang] ||
            applicationInsightsTranslations.urbanDenseGeneric.en
          );
        }
      } else if (urbanPercentage > 30) {
        return (
          applicationInsightsTranslations.urbanModerate[currentLang] ||
          applicationInsightsTranslations.urbanModerate.en
        );
      } else {
        return (
          applicationInsightsTranslations.urbanLimited[currentLang] ||
          applicationInsightsTranslations.urbanLimited.en
        );
      }

    case "clouds":
      if (!data.cloudPercentage) {
        return (
          applicationInsightsTranslations.cloudGeneric[currentLang] ||
          applicationInsightsTranslations.cloudGeneric.en
        );
      }

      const cloudPercentage = parseFloat(data.cloudPercentage);

      if (cloudPercentage > 70) {
        return (
          applicationInsightsTranslations.cloudHeavy[currentLang] ||
          applicationInsightsTranslations.cloudHeavy.en
        );
      } else if (cloudPercentage > 30) {
        return (
          applicationInsightsTranslations.cloudPartial[currentLang] ||
          applicationInsightsTranslations.cloudPartial.en
        );
      } else {
        return (
          applicationInsightsTranslations.cloudMinimal[currentLang] ||
          applicationInsightsTranslations.cloudMinimal.en
        );
      }

    default:
      return (
        applicationInsightsTranslations.defaultApplications[currentLang] ||
        applicationInsightsTranslations.defaultApplications.en
      );
  }
}

// Utility Functions
function capitalizeFirstLetter(string, lang) {
  if (!string) return "";
  // For Arabic, no need to capitalize
  if (lang === "ar") return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Print Analysis Results
function printAnalysisResults() {
  window.print();
}

// Share Analysis Results
function shareAnalysisResults() {
  // Check if the Web Share API is available
  if (navigator.share) {
    // Get the feature type and some basic info
    const featureType = document.querySelector(
      ".feature-badge span"
    ).textContent;
    const shareTitle = `${featureType} Analysis Results`;
    const shareText = document
      .querySelector(".key-findings")
      .textContent.trim();

    navigator
      .share({
        title: shareTitle,
        text: shareText,
        url: window.location.href,
      })
      .then(() => console.log("Shared successfully"))
      .catch((error) => console.error("Share failed:", error));
  } else {
    // Fallback for browsers that don't support the Web Share API
    alert(
      currentLang === "ar"
        ? "للمشاركة، يرجى استخدام وظيفة النسخ/اللصق أو التقاط لقطة شاشة للنتائج."
        : "To share, please use copy/paste or take a screenshot of the results."
    );
  }
}

// Map and BBox initialization
let map, drawnItems, drawControl;
let isMapInitialized = false;

function initializeMap() {
  if (isMapInitialized) return;

  // Initialize the map
  map = L.map("map-container").setView([0, 0], 2);

  // Add the basemap tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Initialize the FeatureGroup to store drawn items
  drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  // Initialize the draw control
  drawControl = new L.Control.Draw({
    draw: {
      polygon: true,
      polyline: false,
      rectangle: true,
      circle: false,
      marker: false,
      circlemarker: false,
    },
    edit: {
      featureGroup: drawnItems,
      remove: true,
    },
  });
  map.addControl(drawControl);

  // Listen for draw events
  map.on(L.Draw.Event.CREATED, function (event) {
    drawnItems.clearLayers();
    const layer = event.layer;
    drawnItems.addLayer(layer);

    // Extract the bounding box coordinates
    updateBBoxFromDrawing(layer);
  });

  map.on(L.Draw.Event.DELETED, function () {
    clearBBoxInputs();
  });

  // Prevent map interaction when clicking on elements inside the map container
  L.DomEvent.disableClickPropagation(
    document.getElementById("selected-bbox-display")
  );

  isMapInitialized = true;

  // Fix the map size issues after initialization
  setTimeout(() => {
    map.invalidateSize();
  }, 100);
}

function updateBBoxFromDrawing(layer) {
  const bounds = layer.getBounds();
  const west = bounds.getWest().toFixed(6);
  const south = bounds.getSouth().toFixed(6);
  const east = bounds.getEast().toFixed(6);
  const north = bounds.getNorth().toFixed(6);

  document.getElementById("bbox-west").value = west;
  document.getElementById("bbox-south").value = south;
  document.getElementById("bbox-east").value = east;
  document.getElementById("bbox-north").value = north;

  // Update display
  document.getElementById(
    "bbox-coordinates"
  ).textContent = `[${west}, ${south}, ${east}, ${north}]`;
}

function clearBBoxInputs() {
  document.getElementById("bbox-west").value = "";
  document.getElementById("bbox-south").value = "";
  document.getElementById("bbox-east").value = "";
  document.getElementById("bbox-north").value = "";
  document.getElementById("bbox-coordinates").textContent = "";
}

function drawBBoxFromInputs() {
  const west = parseFloat(document.getElementById("bbox-west").value);
  const south = parseFloat(document.getElementById("bbox-south").value);
  const east = parseFloat(document.getElementById("bbox-east").value);
  const north = parseFloat(document.getElementById("bbox-north").value);

  if (isNaN(west) || isNaN(south) || isNaN(east) || isNaN(north)) {
    return;
  }

  // Clear previous drawings
  drawnItems.clearLayers();

  // Create a new rectangle and add it to the map
  const bounds = L.latLngBounds(L.latLng(south, west), L.latLng(north, east));
  const rectangle = L.rectangle(bounds);
  drawnItems.addLayer(rectangle);

  // Fit the map to the bounds
  map.fitBounds(bounds);

  // Update display
  document.getElementById("bbox-coordinates").textContent = `[${west.toFixed(
    6
  )}, ${south.toFixed(6)}, ${east.toFixed(6)}, ${north.toFixed(6)}]`;
}

// Event listeners for the UI controls
document.addEventListener("DOMContentLoaded", function () {
  const manualEntryBtn = document.getElementById("manual-entry-btn");
  const drawMapBtn = document.getElementById("draw-map-btn");
  const manualEntryContainer = document.getElementById(
    "manual-entry-container"
  );
  const mapContainer = document.getElementById("map-container");

  if (manualEntryBtn && drawMapBtn) {
    manualEntryBtn.addEventListener("click", function () {
      manualEntryBtn.classList.add("active");
      drawMapBtn.classList.remove("active");
      manualEntryContainer.style.display = "block";
      mapContainer.style.display = "none";
    });

    drawMapBtn.addEventListener("click", function () {
      drawMapBtn.classList.add("active");
      manualEntryBtn.classList.remove("active");
      mapContainer.style.display = "block";
      manualEntryContainer.style.display = "none";

      // Initialize the map if it hasn't been initialized yet
      initializeMap();
    });
  }

  // Add event listeners to the bounding box input fields
  const bboxInputs = document.querySelectorAll(".bbox-input");
  bboxInputs.forEach((input) => {
    input.addEventListener("change", function () {
      // Draw the bounding box on the map based on the input values
      if (isMapInitialized) {
        drawBBoxFromInputs();
      }
    });
  });
});
