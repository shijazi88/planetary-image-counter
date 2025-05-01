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

    // New statistics explanations for water analyzer
    waterQualityIndexExplanation:
      "A 0-100 scale indicating water quality based on turbidity and clarity. Higher values indicate better quality.",
    detailedWaterTypeExplanation:
      "More detailed classification of the water body based on characteristics like turbidity, depth, and shoreline.",
    temperatureIndexExplanation:
      "Relative water temperature estimation on a 0-100 scale based on spectral characteristics.",
    temperatureCategoryExplanation:
      "Classification of the water body's relative temperature (cool, moderate, warm).",
    coolWaterPercentageExplanation:
      "Percentage of water classified as cool temperature (typically deeper or shaded areas).",
    seasonalCharacteristicsExplanation:
      "Estimated seasonal characteristics of the water body based on temperature patterns and water quality.",
    waterQualityCategoryExplanation:
      "Classification of water quality from Poor to Excellent based on turbidity, clarity, and spectral analysis.",

    // New statistics explanations for vegetation analyzer
    predominantVegetationTypeExplanation:
      "The most common type of vegetation identified in the image based on spectral characteristics.",
    densityCategoryExplanation:
      "Classification of vegetation density from Sparse to Very Dense based on canopy coverage analysis.",
    densityValueExplanation:
      "Numerical value representing vegetation density (0-100). Higher values indicate denser vegetation.",
    ecologicalHealthScoreExplanation:
      "Score (0-100) indicating overall ecological health based on vegetation diversity and condition.",
    fireRiskExplanation:
      "Assessment of wildfire risk based on vegetation dryness and density.",
    fireRiskScoreExplanation:
      "Numerical score (0-100) of fire risk. Higher values indicate greater risk.",
    growthStageExplanation:
      "Estimated seasonal growth stage of vegetation (early, peak, senescence) based on spectral signatures.",

    // New category labels
    waterQualityCategory: "Water Quality",
    temperatureCategory: "Temperature Metrics",
    seasonalityCategory: "Seasonal Patterns",
    vegetationTypeCategory: "Vegetation Types",
    densityCategory: "Density Analysis",
    fireRiskCategory: "Fire Risk Assessment",

    // Water metric labels
    waterQualityIndex: "Water Quality Index",
    detailedWaterType: "Detailed Water Type",
    temperatureIndex: "Temperature Index",
    temperatureCategory: "Temperature Category",
    coolWaterPercentage: "Cool Water Coverage",
    seasonalCharacteristics: "Seasonal Pattern",
    waterQualityCategory: "Water Quality Category",

    // Vegetation metric labels
    predominantVegetationType: "Predominant Vegetation Type",
    densityCategory: "Vegetation Density",
    densityValue: "Density Value",
    ecologicalHealthScore: "Ecological Health Score",
    fireRiskCategory: "Fire Risk",
    fireRiskScore: "Fire Risk Score",
    growthStage: "Growth Stage",

    // Additional water metric labels
    waterBodyType: "Water Body Type",
    shorelineIndex: "Shoreline Complexity",
    coverageCategory: "Coverage Category",
    moderateWaterPercentage: "Moderate Temperature Coverage",
    warmWaterPercentage: "Warm Water Coverage",

    // Additional vegetation metric labels
    vegetationCount: "Vegetation Pixels",
    vegetationPercentage: "Vegetation Coverage",
    healthyPercentage: "Healthy Vegetation",
    moderatePercentage: "Moderate Vegetation",
    stressedPercentage: "Stressed Vegetation",
    darkGreenPercentage: "Forest/Dense Vegetation",
    brightGreenPercentage: "Crops/Grassland",
    yellowGreenPercentage: "Shrubland/Dry Vegetation",
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

    // New statistics explanations for water analyzer
    waterQualityIndexExplanation:
      "مقياس من 0-100 يشير إلى جودة المياه بناءً على العكارة والوضوح. القيم الأعلى تشير إلى جودة أفضل.",
    detailedWaterTypeExplanation:
      "تصنيف أكثر تفصيلاً لجسم المياه استنادًا إلى خصائص مثل العكارة والعمق والساحل.",
    temperatureIndexExplanation:
      "تقدير درجة حرارة المياه النسبية على مقياس 0-100 استنادًا إلى الخصائص الطيفية.",
    temperatureCategoryExplanation:
      "تصنيف درجة حرارة المسطح المائي النسبية (بارد، معتدل، دافئ).",
    coolWaterPercentageExplanation:
      "نسبة المياه المصنفة على أنها ذات درجة حرارة باردة (عادة ً المناطق الأعمق أو المظللة).",
    seasonalCharacteristicsExplanation:
      "الخصائص الموسمية المقدرة للمسطح المائي استنادًا إلى أنماط درجة الحرارة وجودة المياه.",
    waterQualityCategoryExplanation:
      "تصنيف جودة المياه من رديئة إلى ممتازة استنادًا إلى العكارة والوضوح والتحليل الطيفي.",
    moderateWaterPercentageExplanation:
      "نسبة المياه المصنفة كدرجة حرارة معتدلة.",
    warmWaterPercentageExplanation:
      "نسبة المياه المصنفة كدرجة حرارة دافئة (عادة في المناطق الضحلة أو المعرضة للشمس).",
    seasonalCharacteristicsExplanation:
      "النمط الموسمي المقدر بناءً على درجة حرارة المياه وخصائص الوضوح.",
    pollutionRiskCategoryExplanation:
      "تقييم مخاطر التلوث المحتملة بناءً على مقاييس جودة المياه.",
    avgTurbidityExplanation:
      "متوسط مستوى العكارة في المسطح المائي. القيم الأعلى تشير إلى المزيد من الجسيمات العالقة.",

    // New statistics explanations for vegetation analyzer
    predominantVegetationTypeExplanation:
      "النوع الأكثر شيوعًا من الغطاء النباتي المحدد في الصورة استنادًا إلى الخصائص الطيفية.",
    densityCategoryExplanation:
      "تصنيف كثافة الغطاء النباتي من متناثر إلى كثيف جدًا استنادًا إلى تحليل تغطية المظلة.",
    densityValueExplanation:
      "قيمة رقمية تمثل كثافة الغطاء النباتي (0-100). القيم الأعلى تشير إلى غطاء نباتي أكثر كثافة.",
    ecologicalHealthScoreExplanation:
      "درجة (0-100) تشير إلى الصحة البيئية العامة استنادًا إلى تنوع وحالة الغطاء النباتي.",
    fireRiskExplanation:
      "تقييم مخاطر الحرائق البرية استنادًا إلى جفاف وكثافة الغطاء النباتي.",
    fireRiskScoreExplanation:
      "درجة رقمية (0-100) لمخاطر الحرائق. القيم الأعلى تشير إلى مخاطر أكبر.",
    growthStageExplanation:
      "مرحلة النمو الموسمية المقدرة للغطاء النباتي (مبكرة، ذروة، شيخوخة) استنادًا إلى البصمات الطيفية.",

    // New category labels
    waterQualityCategory: "جودة المياه",
    temperatureCategory: "مقاييس درجة الحرارة",
    seasonalityCategory: "الأنماط الموسمية",
    vegetationTypeCategory: "أنواع الغطاء النباتي",
    densityCategory: "تحليل الكثافة",
    fireRiskCategory: "تقييم مخاطر الحرائق",

    // Water metric labels
    waterQualityIndex: "مؤشر جودة المياه",
    detailedWaterType: "نوع المياه التفصيلي",
    temperatureIndex: "مؤشر درجة الحرارة",
    temperatureCategory: "فئة درجة الحرارة",
    coolWaterPercentage: "نسبة المياه الباردة",
    seasonalCharacteristics: "النمط الموسمي",
    waterQualityCategory: "فئة جودة المياه",

    // Vegetation metric labels
    predominantVegetationType: "نوع الغطاء النباتي السائد",
    densityCategory: "كثافة الغطاء النباتي",
    densityValue: "قيمة الكثافة",
    ecologicalHealthScore: "درجة الصحة البيئية",
    fireRiskCategory: "مخاطر الحرائق",
    fireRiskScore: "درجة مخاطر الحرائق",
    growthStage: "مرحلة النمو",

    // Additional water metric labels
    waterBodyType: "نوع المسطح المائي",
    shorelineIndex: "تعقيد خط الساحل",
    coverageCategory: "فئة التغطية",
    moderateWaterPercentage: "تغطية درجة حرارة معتدلة",
    warmWaterPercentage: "تغطية المياه الدافئة",

    // Additional vegetation metric labels
    vegetationCount: "بكسلات الغطاء النباتي",
    vegetationPercentage: "تغطية الغطاء النباتي",
    healthyPercentage: "الغطاء النباتي الصحي",
    moderatePercentage: "الغطاء النباتي المعتدل",
    stressedPercentage: "الغطاء النباتي المُجهد",
    darkGreenPercentage: "الغابات/الغطاء النباتي الكثيف",
    brightGreenPercentage: "المحاصيل/المروج",
    yellowGreenPercentage: "الأراضي الشجيرية/الغطاء النباتي الجاف",
  },
};

// Add category labels - these determine the headings in the results UI
const categoryLabels = {
  en: {
    basic: "Basic Information",
    coverage: "Coverage Statistics",
    classification: "Feature Classification",
    waterType: "Water Type Analysis",
    vegetationType: "Vegetation Type Analysis",
    waterQuality: "Water Quality Assessment",
    health: "Health Assessment",
    density: "Density Analysis",
    temperature: "Temperature Analysis",
    urbanType: "Urban Development",
    shoreline: "Shoreline Analysis",
    seasonality: "Seasonal Patterns",
    fireRisk: "Fire Risk Assessment",
    index: "Statistical Indices",
    other: "Additional Metrics",
  },
  ar: {
    basic: "معلومات أساسية",
    coverage: "إحصائيات التغطية",
    classification: "تصنيف الميزات",
    waterType: "تحليل نوع المياه",
    vegetationType: "تحليل نوع الغطاء النباتي",
    waterQuality: "تقييم جودة المياه",
    health: "تقييم الصحة",
    density: "تحليل الكثافة",
    temperature: "تحليل درجة الحرارة",
    urbanType: "التطور الحضري",
    shoreline: "تحليل الساحل",
    seasonality: "الأنماط الموسمية",
    fireRisk: "تقييم مخاطر الحرائق",
    index: "المؤشرات الإحصائية",
    other: "مقاييس إضافية",
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

// Update feature description based on selected feature type
function updateFeatureDescription() {
  const featureType = document.getElementById("feature-type").value;
  const descriptions = document.querySelectorAll(".analyzer-description");

  // Hide all descriptions
  descriptions.forEach((desc) => {
    desc.classList.add("hidden");
  });

  // Show the selected feature description
  const selectedDesc = document.getElementById(`${featureType}-description`);
  if (selectedDesc) {
    selectedDesc.classList.remove("hidden");
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
    console.log("Analyzing image with feature type:", featureType);
    console.log("Image URL:", selectedImageUrl);

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

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data received:", data.error ? "Error" : "Success");

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

  // Order of categories to display
  const categoryOrder = [
    "basic",
    "coverage",
    "classification",
    "waterType",
    "vegetationType",
    "waterQuality",
    "health",
    "density",
    "temperature",
    "urbanType",
    "shoreline",
    "seasonality",
    "fireRisk",
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
      categoryHeading.textContent = getCategoryLabel(category);
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

      // New vegetation type metrics
      if (data.predominantVegetationType) {
        stats.push({
          label:
            translations[currentLang].predominantVegetationType ||
            "Predominant Vegetation Type",
          value: data.predominantVegetationType,
          explanation:
            translations[currentLang].predominantVegetationTypeExplanation ||
            "The most common type of vegetation identified in the image.",
          category: "vegetationType",
        });
      }

      // Vegetation color metrics
      if (data.darkGreenPercentage) {
        stats.push({
          label:
            translations[currentLang].darkGreenPercentage ||
            "Forest/Dense Vegetation",
          value: `${data.darkGreenPercentage}%`,
          explanation:
            translations[currentLang].darkGreenPercentageExplanation ||
            "Percentage of vegetation appearing as dark green, typically forests or dense vegetation.",
          category: "vegetationType",
        });
      }
      if (data.brightGreenPercentage) {
        stats.push({
          label:
            translations[currentLang].brightGreenPercentage ||
            "Crops/Grassland",
          value: `${data.brightGreenPercentage}%`,
          explanation:
            translations[currentLang].brightGreenPercentageExplanation ||
            "Percentage of vegetation appearing as bright green, typically crops or grasslands.",
          category: "vegetationType",
        });
      }
      if (data.yellowGreenPercentage) {
        stats.push({
          label:
            translations[currentLang].yellowGreenPercentage ||
            "Shrubland/Dry Vegetation",
          value: `${data.yellowGreenPercentage}%`,
          explanation:
            translations[currentLang].yellowGreenPercentageExplanation ||
            "Percentage of vegetation appearing as yellow-green, typically shrublands or dry vegetation.",
          category: "vegetationType",
        });
      }

      // Density metrics - NEW
      if (data.densityCategory) {
        stats.push({
          label:
            translations[currentLang].densityCategory || "Vegetation Density",
          value: data.densityCategory,
          explanation:
            translations[currentLang].densityCategoryExplanation ||
            "Classification of vegetation density from Sparse to Very Dense.",
          category: "density",
        });
      }
      if (data.densityValue) {
        stats.push({
          label: translations[currentLang].densityValue || "Density Value",
          value: data.densityValue,
          explanation:
            translations[currentLang].densityValueExplanation ||
            "Numerical value representing vegetation density (0-100).",
          category: "density",
        });
      }

      // Ecological health - NEW
      if (data.ecologicalHealthScore) {
        stats.push({
          label:
            translations[currentLang].ecologicalHealthScore ||
            "Ecological Health Score",
          value: data.ecologicalHealthScore,
          explanation:
            translations[currentLang].ecologicalHealthScoreExplanation ||
            "Score (0-100) indicating overall ecological health based on vegetation diversity and condition.",
          category: "health",
        });
      }

      // Fire risk - NEW
      if (data.fireRiskCategory) {
        stats.push({
          label: translations[currentLang].fireRiskCategory || "Fire Risk",
          value: data.fireRiskCategory,
          explanation:
            translations[currentLang].fireRiskExplanation ||
            "Assessment of wildfire risk based on vegetation dryness and density.",
          category: "fireRisk",
        });
      }
      if (data.fireRiskScore) {
        stats.push({
          label: translations[currentLang].fireRiskScore || "Fire Risk Score",
          value: data.fireRiskScore,
          explanation:
            translations[currentLang].fireRiskScoreExplanation ||
            "Numerical score (0-100) of fire risk. Higher values indicate greater risk.",
          category: "fireRisk",
        });
      }

      // Seasonal growth - NEW
      if (data.growthStage) {
        stats.push({
          label: translations[currentLang].growthStage || "Growth Stage",
          value: data.growthStage,
          explanation:
            translations[currentLang].growthStageExplanation ||
            "Estimated seasonal growth stage of vegetation (early, peak, senescence).",
          category: "seasonality",
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

      // Classification metrics
      if (data.waterBodyType) {
        stats.push({
          label: translations[currentLang].waterBodyType || "Water Body Type",
          value: data.waterBodyType,
          explanation:
            translations[currentLang].waterBodyTypeExplanation ||
            "Classification of the type of water body detected.",
          category: "classification",
        });
      }

      // Detailed water type - NEW
      if (data.detailedWaterType) {
        stats.push({
          label:
            translations[currentLang].detailedWaterType ||
            "Detailed Water Type",
          value: data.detailedWaterType,
          explanation:
            translations[currentLang].detailedWaterTypeExplanation ||
            "More detailed classification of the water body based on characteristics like turbidity, depth, and shoreline.",
          category: "waterType",
        });
      }

      // Water quality metrics - NEW
      if (data.waterQualityIndex) {
        stats.push({
          label:
            translations[currentLang].waterQualityIndex ||
            "Water Quality Index",
          value: data.waterQualityIndex,
          explanation:
            translations[currentLang].waterQualityIndexExplanation ||
            "A 0-100 scale indicating water quality based on turbidity and clarity. Higher values indicate better quality.",
          category: "waterQuality",
        });
      }
      if (data.waterQualityCategory) {
        stats.push({
          label:
            translations[currentLang].waterQualityCategory ||
            "Water Quality Category",
          value: data.waterQualityCategory,
          explanation:
            translations[currentLang].waterQualityCategoryExplanation ||
            "Classification of water quality from Poor to Excellent.",
          category: "waterQuality",
        });
      }

      // Temperature metrics - NEW
      if (data.temperatureIndex) {
        stats.push({
          label:
            translations[currentLang].temperatureIndex || "Temperature Index",
          value: data.temperatureIndex,
          explanation:
            translations[currentLang].temperatureIndexExplanation ||
            "Relative water temperature estimation on a 0-100 scale based on spectral characteristics.",
          category: "temperature",
        });
      }
      if (data.temperatureCategory) {
        stats.push({
          label:
            translations[currentLang].temperatureCategory ||
            "Temperature Category",
          value: data.temperatureCategory,
          explanation:
            translations[currentLang].temperatureCategoryExplanation ||
            "Classification of the water body's relative temperature (cool, moderate, warm).",
          category: "temperature",
        });
      }
      if (data.coolWaterPercentage) {
        stats.push({
          label:
            translations[currentLang].coolWaterPercentage ||
            "Cool Water Coverage",
          value: `${data.coolWaterPercentage}%`,
          explanation:
            translations[currentLang].coolWaterPercentageExplanation ||
            "Percentage of water classified as cool temperature.",
          category: "temperature",
        });
      }

      // Seasonality - NEW
      if (data.seasonalCharacteristics) {
        stats.push({
          label:
            translations[currentLang].seasonalCharacteristics ||
            "Seasonal Pattern",
          value: data.seasonalCharacteristics,
          explanation:
            translations[currentLang].seasonalCharacteristicsExplanation ||
            "Estimated seasonal characteristics of the water body.",
          category: "seasonality",
        });
      }

      break;

    case "urban":
      // Continue with existing urban metrics...
      // ... existing code ...
      break;

    case "clouds":
      // Continue with existing cloud metrics...
      // ... existing code ...
      break;

    case "landUse":
      // Continue with existing landUse metrics...
      // ... existing code ...
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
    // landUse case removed
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

      // Vegetation type
      if (data.predominantVegetationType) {
        let typeText =
          keyFindingsTranslations.vegetationType?.[currentLang] ||
          `The predominant vegetation type is ${data.predominantVegetationType.toLowerCase()}.`;
        findings.push(
          typeText.replace(
            "{type}",
            data.predominantVegetationType.toLowerCase()
          )
        );
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

      // Ecological health score
      if (data.ecologicalHealthScore) {
        let ecoHealthText =
          keyFindingsTranslations.ecologicalHealth?.[currentLang] ||
          `The ecological health score is ${data.ecologicalHealthScore} out of 100.`;
        findings.push(
          ecoHealthText.replace("{score}", data.ecologicalHealthScore)
        );
      }

      // Growth stage
      if (data.growthStage) {
        let growthText =
          keyFindingsTranslations.growthStage?.[currentLang] ||
          `The vegetation appears to be in the ${data.growthStage.toLowerCase()} phase.`;
        findings.push(
          growthText.replace("{stage}", data.growthStage.toLowerCase())
        );
      }

      // Fire risk if significant
      if (data.fireRiskCategory && data.fireRiskCategory !== "Low Risk") {
        let fireRiskText =
          keyFindingsTranslations.fireRisk?.[currentLang] ||
          `Fire risk assessment: ${data.fireRiskCategory.toLowerCase()}.`;
        findings.push(
          fireRiskText.replace("{risk}", data.fireRiskCategory.toLowerCase())
        );
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

      // Water body type - prefer detailed type if available
      if (data.detailedWaterType) {
        let typeText =
          keyFindingsTranslations.detailedWaterType?.[currentLang] ||
          `This appears to be a ${data.detailedWaterType.toLowerCase()}.`;
        findings.push(
          typeText.replace("{type}", data.detailedWaterType.toLowerCase())
        );
      } else if (data.waterBodyType) {
        let typeText =
          keyFindingsTranslations.waterBodyType[currentLang] ||
          keyFindingsTranslations.waterBodyType.en;
        typeText = typeText.replace("{type}", data.waterBodyType.toLowerCase());
        findings.push(typeText);
      }

      // Water quality index
      if (data.waterQualityIndex) {
        let qualityText =
          keyFindingsTranslations.waterQuality?.[currentLang] ||
          `Water quality index: ${data.waterQualityIndex} out of 100.`;
        findings.push(qualityText.replace("{quality}", data.waterQualityIndex));

        // Also include pollution risk if available
        if (data.pollutionRiskCategory) {
          let riskText =
            keyFindingsTranslations.pollutionRisk?.[currentLang] ||
            `Pollution risk: ${data.pollutionRiskCategory.toLowerCase()}.`;
          findings.push(
            riskText.replace("{risk}", data.pollutionRiskCategory.toLowerCase())
          );
        }
      }

      // Temperature insights
      if (data.temperatureCategory) {
        let tempText =
          keyFindingsTranslations.waterTemperature?.[currentLang] ||
          `The water temperature appears to be predominantly ${data.temperatureCategory.toLowerCase()}.`;
        findings.push(
          tempText.replace("{category}", data.temperatureCategory.toLowerCase())
        );
      }

      // Seasonal patterns
      if (data.seasonalCharacteristics) {
        let seasonalText =
          keyFindingsTranslations.waterSeasonal?.[currentLang] ||
          `The water shows characteristics consistent with ${data.seasonalCharacteristics.toLowerCase()}.`;
        findings.push(
          seasonalText.replace(
            "{pattern}",
            data.seasonalCharacteristics.toLowerCase()
          )
        );
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

      // Urban components
      if (data.urbanComponents) {
        let componentsText =
          keyFindingsTranslations.urbanComposition[currentLang] ||
          keyFindingsTranslations.urbanComposition.en;
        componentsText = componentsText.replace(
          "{components}",
          data.urbanComponents
        );
        findings.push(componentsText);
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
        let fragmentationText;

        if (fragValue > 0.7) {
          fragmentationText =
            keyFindingsTranslations.fragmentationHighlyFragmented[
              currentLang
            ] || keyFindingsTranslations.fragmentationHighlyFragmented.en;
        } else if (fragValue > 0.3) {
          fragmentationText =
            keyFindingsTranslations.fragmentationModeratelyFragmented[
              currentLang
            ] || keyFindingsTranslations.fragmentationModeratelyFragmented.en;
        } else {
          fragmentationText =
            keyFindingsTranslations.fragmentationCompact[currentLang] ||
            keyFindingsTranslations.fragmentationCompact.en;
        }

        fragmentationText = fragmentationText.replace(
          "{index}",
          data.fragmentationIndex
        );
        findings.push(fragmentationText);
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
      if (data.shadowPercentage) {
        let shadowText =
          keyFindingsTranslations.cloudShadows[currentLang] ||
          keyFindingsTranslations.cloudShadows.en;
        shadowText = shadowText.replace("{percentage}", data.shadowPercentage);
        findings.push(shadowText);
      }

      // Image usability
      if (data.usabilityCategory) {
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

    case "landUse":
      // Dominant land use
      if (data.dominantLandUse && data.landUsePercentage) {
        let dominantText =
          keyFindingsTranslations.landUseDominant[currentLang] ||
          keyFindingsTranslations.landUseDominant.en;
        dominantText = dominantText
          .replace("{type}", data.dominantLandUse)
          .replace(
            "{percentage}",
            data.landUsePercentage[data.dominantLandUse]
          );
        findings.push(dominantText);
      }

      // Land use diversity
      if (data.landUseDiversity) {
        let diversityText =
          keyFindingsTranslations.landUseDiversity[currentLang] ||
          keyFindingsTranslations.landUseDiversity.en;
        diversityText = diversityText.replace("{score}", data.landUseDiversity);
        findings.push(diversityText);
      }

      // Urban coverage
      if (data.landUsePercentage && data.landUsePercentage.urban) {
        let urbanText =
          keyFindingsTranslations.landUseUrban[currentLang] ||
          keyFindingsTranslations.landUseUrban.en;
        urbanText = urbanText.replace(
          "{percentage}",
          data.landUsePercentage.urban
        );
        findings.push(urbanText);
      }

      // Agriculture coverage
      if (data.landUsePercentage && data.landUsePercentage.agriculture) {
        let agricultureText =
          keyFindingsTranslations.landUseAgriculture[currentLang] ||
          keyFindingsTranslations.landUseAgriculture.en;
        agricultureText = agricultureText.replace(
          "{percentage}",
          data.landUsePercentage.agriculture
        );
        findings.push(agricultureText);
      }

      // Forest coverage
      if (data.landUsePercentage && data.landUsePercentage.forest) {
        let forestText =
          keyFindingsTranslations.landUseForest[currentLang] ||
          keyFindingsTranslations.landUseForest.en;
        forestText = forestText.replace(
          "{percentage}",
          data.landUsePercentage.forest
        );
        findings.push(forestText);
      }

      // Water coverage
      if (data.landUsePercentage && data.landUsePercentage.water) {
        let waterText =
          keyFindingsTranslations.landUseWater[currentLang] ||
          keyFindingsTranslations.landUseWater.en;
        waterText = waterText.replace(
          "{percentage}",
          data.landUsePercentage.water
        );
        findings.push(waterText);
      }

      // Barren land coverage
      if (
        data.landUsePercentage &&
        data.landUsePercentage.barren &&
        parseFloat(data.landUsePercentage.barren) > 5
      ) {
        let barrenText =
          keyFindingsTranslations.landUseBarren[currentLang] ||
          keyFindingsTranslations.landUseBarren.en;
        barrenText = barrenText.replace(
          "{percentage}",
          data.landUsePercentage.barren
        );
        findings.push(barrenText);
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

// Generate practical applications based on the analysis results
function generateApplicationInsights(data) {
  switch (data.featureType) {
    case "vegetation":
      // ... existing vegetation case ...
      break;

    case "water":
      // ... existing water case ...
      break;

    case "urban":
      // ... existing urban case ...
      break;

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

// Helper function to get category label with fallbacks
function getCategoryLabel(category) {
  // First try using translations
  if (
    translations[currentLang] &&
    translations[currentLang][category + "Category"]
  ) {
    return translations[currentLang][category + "Category"];
  }

  // Next try using the categoryLabels object
  if (categoryLabels[currentLang] && categoryLabels[currentLang][category]) {
    return categoryLabels[currentLang][category];
  }

  // Fallback to English
  if (categoryLabels.en && categoryLabels.en[category]) {
    return categoryLabels.en[category];
  }

  // Last resort: capitalized category name
  return category.charAt(0).toUpperCase() + category.slice(1);
}
