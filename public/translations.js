// Arabic translations for generateKeyFindings and generateApplicationInsights functions
const keyFindingsTranslations = {
  // Vegetation findings
  vegetationCoverage: {
    en: "The image shows {percentage}% vegetation coverage, which is {category}.",
    ar: "تُظهر الصورة تغطية نباتية بنسبة {percentage}%، وهي {category}.",
  },
  vegetationHealth: {
    en: "Overall vegetation health is classified as {status}.",
    ar: "تم تصنيف الصحة العامة للغطاء النباتي كـ{status}.",
  },
  vegetationComposition: {
    en: "The vegetation consists of {healthy}% healthy, {moderate}% moderately healthy, and {stressed}% stressed plant life.",
    ar: "يتكون الغطاء النباتي من {healthy}% نباتات صحية، و{moderate}% نباتات معتدلة الصحة، و{stressed}% نباتات مجهدة.",
  },
  ndviVeryHealthy: {
    en: "The average vegetation index (NDVI) is {ndvi}, indicating very healthy, dense vegetation.",
    ar: "متوسط مؤشر الغطاء النباتي (NDVI) هو {ndvi}، مما يشير إلى غطاء نباتي صحي جدا وكثيف.",
  },
  ndviModerate: {
    en: "The average vegetation index (NDVI) is {ndvi}, suggesting moderately healthy vegetation.",
    ar: "متوسط مؤشر الغطاء النباتي (NDVI) هو {ndvi}، مما يشير إلى غطاء نباتي معتدل الصحة.",
  },
  ndviSparse: {
    en: "The average vegetation index (NDVI) is {ndvi}, indicating sparse or somewhat stressed vegetation.",
    ar: "متوسط مؤشر الغطاء النباتي (NDVI) هو {ndvi}، مما يشير إلى غطاء نباتي متفرق أو متوتر إلى حد ما.",
  },
  ndviStressed: {
    en: "The average vegetation index (NDVI) is {ndvi}, suggesting sparse vegetation or significant stress.",
    ar: "متوسط مؤشر الغطاء النباتي (NDVI) هو {ndvi}، مما يشير إلى غطاء نباتي متفرق أو إجهاد كبير.",
  },

  // Water findings
  waterCoverage: {
    en: "The image contains {percentage}% water coverage.",
    ar: "تحتوي الصورة على تغطية مائية بنسبة {percentage}%.",
  },
  waterBodyType: {
    en: "The water feature is classified as {type}.",
    ar: "تم تصنيف المسطح المائي كـ{type}.",
  },
  waterComposition: {
    en: "The water composition is {deep}% deep water, {shallow}% shallow water, and {turbid}% turbid/sediment-laden water.",
    ar: "يتكون المسطح المائي من {deep}% مياه عميقة، و{shallow}% مياه ضحلة، و{turbid}% مياه عكرة/محملة بالرواسب.",
  },
  waterClarity: {
    en: "Overall water clarity is classified as {clarity}.",
    ar: "تم تصنيف وضوح المياه العام كـ{clarity}.",
  },
  shorelineHighlyComplex: {
    en: "The shoreline is highly complex with many inlets and peninsulas (index: {index}).",
    ar: "خط الشاطئ معقد للغاية مع العديد من المداخل وأشباه الجزر (المؤشر: {index}).",
  },
  shorelineModeratelyComplex: {
    en: "The shoreline is moderately complex (index: {index}).",
    ar: "خط الشاطئ متوسط التعقيد (المؤشر: {index}).",
  },
  shorelineSimple: {
    en: "The shoreline is relatively simple (index: {index}).",
    ar: "خط الشاطئ بسيط نسبيًا (المؤشر: {index}).",
  },

  // Urban findings
  urbanCoverage: {
    en: "The image shows {percentage}% urban coverage.",
    ar: "تُظهر الصورة تغطية حضرية بنسبة {percentage}%.",
  },
  urbanCategory: {
    en: "This area is classified as {category} development.",
    ar: "تم تصنيف هذه المنطقة كتطوير {category}.",
  },
  urbanComposition: {
    en: "The urban area consists of {components}.",
    ar: "تتكون المنطقة الحضرية من {components}.",
  },
  urbanDevelopmentPattern: {
    en: "The urban development pattern is classified as {pattern}.",
    ar: "تم تصنيف نمط التطوير الحضري كـ{pattern}.",
  },
  fragmentationHighlyFragmented: {
    en: "The fragmentation index of {index} indicates highly fragmented or sprawling development.",
    ar: "يشير مؤشر التجزئة البالغ {index} إلى تطوير مجزأ للغاية أو منتشر.",
  },
  fragmentationModeratelyFragmented: {
    en: "The fragmentation index of {index} indicates moderately fragmented development.",
    ar: "يشير مؤشر التجزئة البالغ {index} إلى تطوير متوسط التجزئة.",
  },
  fragmentationCompact: {
    en: "The fragmentation index of {index} indicates compact, efficient urban development.",
    ar: "يشير مؤشر التجزئة البالغ {index} إلى تطوير حضري مدمج وفعال.",
  },

  // Cloud findings
  cloudCoverage: {
    en: "The image shows {percentage}% cloud coverage.",
    ar: "تُظهر الصورة تغطية سحابية بنسبة {percentage}%.",
  },
  cloudCategory: {
    en: "Cloud conditions are classified as {category}.",
    ar: "تم تصنيف حالة السحب كـ{category}.",
  },
  cloudComposition: {
    en: "The cloud composition is {thick}% thick/opaque clouds and {thin}% thin/semi-transparent clouds.",
    ar: "يتكون تكوين السحب من {thick}% سحب سميكة/معتمة و{thin}% سحب رقيقة/شبه شفافة.",
  },
  cloudShadows: {
    en: "Cloud shadows cover approximately {percentage}% of the image.",
    ar: "تغطي ظلال السحب حوالي {percentage}% من الصورة.",
  },
  imageUsability: {
    en: "This image has {usability} usability for land analysis based on cloud coverage.",
    ar: "هذه الصورة ذات قابلية {usability} للاستخدام في تحليل الأراضي بناءً على تغطية السحب.",
  },

  // Land Use findings
  landUseDominant: {
    en: "The dominant land use type is {type} at {percentage}% of the total area.",
    ar: "نوع استخدام الأراضي السائد هو {type} بنسبة {percentage}% من المساحة الإجمالية.",
  },
  landUseDiversity: {
    en: "The land use diversity score is {score} (0-1 scale, higher values indicate greater diversity).",
    ar: "درجة تنوع استخدام الأراضي هي {score} (مقياس 0-1، تشير القيم الأعلى إلى تنوع أكبر).",
  },
  landUseUrban: {
    en: "Urban/built-up areas cover {percentage}% of the image.",
    ar: "تغطي المناطق الحضرية/المبنية {percentage}% من الصورة.",
  },
  landUseAgriculture: {
    en: "Agricultural land covers {percentage}% of the image.",
    ar: "تغطي الأراضي الزراعية {percentage}% من الصورة.",
  },
  landUseForest: {
    en: "Forest and natural vegetation cover {percentage}% of the image.",
    ar: "تغطي الغابات والغطاء النباتي الطبيعي {percentage}% من الصورة.",
  },
  landUseWater: {
    en: "Water bodies cover {percentage}% of the image.",
    ar: "تغطي المسطحات المائية {percentage}% من الصورة.",
  },
  landUseBarren: {
    en: "Barren land covers {percentage}% of the image.",
    ar: "تغطي الأراضي الجرداء {percentage}% من الصورة.",
  },

  // Generic findings
  genericFeatureDetection: {
    en: "The analysis detected {percentage}% coverage of the target feature.",
    ar: "اكتشف التحليل تغطية بنسبة {percentage}% للميزة المستهدفة.",
  },
  defaultFinding: {
    en: "The image has been analyzed for {featureType} features.",
    ar: "تم تحليل الصورة للكشف عن ميزات {featureType}.",
  },
};

const applicationInsightsTranslations = {
  // Vegetation applications
  vegetationGeneric: {
    en: "This vegetation analysis can support agricultural monitoring, forest management, ecosystem assessment, and land use planning.",
    ar: "يمكن أن يدعم تحليل الغطاء النباتي هذا المراقبة الزراعية وإدارة الغابات وتقييم النظام البيئي وتخطيط استخدام الأراضي.",
  },
  vegetationHighHealthy: {
    en: "This analysis indicates a healthy ecosystem with abundant vegetation. It could support biodiversity conservation planning, carbon sequestration assessment, and sustainable forestry management.",
    ar: "يشير هذا التحليل إلى نظام بيئي صحي مع غطاء نباتي وفير. يمكن أن يدعم تخطيط الحفاظ على التنوع البيولوجي، وتقييم امتصاص الكربون، وإدارة الغابات المستدامة.",
  },
  vegetationHighStressed: {
    en: "Despite high vegetation coverage, the stress indicators suggest potential forest health issues. This analysis could inform forest disease monitoring, drought assessment, or pollution impact studies.",
    ar: "على الرغم من ارتفاع الغطاء النباتي، تشير مؤشرات الإجهاد إلى مشكلات محتملة في صحة الغابات. يمكن أن يساعد هذا التحليل في مراقبة أمراض الغابات، وتقييم الجفاف، أو دراسات تأثير التلوث.",
  },
  vegetationHighMixed: {
    en: "The high vegetation coverage with mixed health indicators could support land management decisions, conservation planning, and ecological monitoring programs.",
    ar: "يمكن أن يدعم الغطاء النباتي العالي مع مؤشرات صحية مختلطة قرارات إدارة الأراضي، وتخطيط الحفظ، وبرامج المراقبة البيئية.",
  },
  vegetationModerateHealthy: {
    en: "This analysis shows moderate vegetation coverage in good health, which could support agricultural productivity assessment, ecosystem service valuation, and land use optimization.",
    ar: "يُظهر هذا التحليل تغطية نباتية معتدلة بصحة جيدة، مما قد يدعم تقييم الإنتاجية الزراعية، وتقييم خدمات النظام البيئي، وتحسين استخدام الأراضي.",
  },
  vegetationModerateStressed: {
    en: "The moderate vegetation with health concerns could inform irrigation planning, fertilization strategies, crop rotation decisions, or environmental stress mitigation efforts.",
    ar: "يمكن أن يساعد الغطاء النباتي المعتدل مع المخاوف الصحية في تخطيط الري، واستراتيجيات التسميد، وقرارات تناوب المحاصيل، أو جهود تخفيف الإجهاد البيئي.",
  },
  vegetationLow: {
    en: "The limited vegetation coverage detected could support urban greening initiatives, desertification monitoring, land rehabilitation planning, or drought impact assessment.",
    ar: "يمكن أن يدعم الغطاء النباتي المحدود المكتشف مبادرات التخضير الحضري، ومراقبة التصحر، وتخطيط إعادة تأهيل الأراضي، أو تقييم تأثير الجفاف.",
  },

  // Water applications
  waterGeneric: {
    en: "This water analysis can support hydrological assessment, coastal management, water resource planning, and flood risk monitoring.",
    ar: "يمكن أن يدعم تحليل المياه هذا التقييم الهيدرولوجي، وإدارة السواحل، وتخطيط موارد المياه، ومراقبة مخاطر الفيضانات.",
  },
  waterMajorTurbid: {
    en: "This analysis of a major water body with high turbidity could support water quality monitoring, sediment transport studies, dredging planning, or pollution assessment.",
    ar: "يمكن أن يدعم هذا التحليل لمسطح مائي رئيسي ذو عكارة عالية مراقبة جودة المياه، ودراسات نقل الرواسب، وتخطيط التجريف، أو تقييم التلوث.",
  },
  waterMajorClear: {
    en: "This analysis of a major water body could inform maritime navigation, coastal management, fisheries assessment, or marine conservation planning.",
    ar: "يمكن أن يساعد هذا التحليل لمسطح مائي رئيسي في الملاحة البحرية، وإدارة السواحل، وتقييم مصايد الأسماك، أو تخطيط الحفاظ على البيئة البحرية.",
  },
  waterLake: {
    en: "This lake analysis could support freshwater resource management, recreational planning, wildlife habitat assessment, or water supply monitoring.",
    ar: "يمكن أن يدعم تحليل البحيرة هذا إدارة موارد المياه العذبة، وتخطيط الترفيه، وتقييم موائل الحياة البرية، أو مراقبة إمدادات المياه.",
  },
  waterRiver: {
    en: "This river system analysis could inform flood risk assessment, watershed management, irrigation planning, or riparian habitat conservation.",
    ar: "يمكن أن يساعد تحليل نظام النهر هذا في تقييم مخاطر الفيضانات، وإدارة مستجمعات المياه، وتخطيط الري، أو الحفاظ على الموائل النهرية.",
  },
  waterGenericBody: {
    en: "This water body analysis could support hydrological studies, water resource management, and aquatic ecosystem assessment.",
    ar: "يمكن أن يدعم تحليل المسطح المائي هذا الدراسات الهيدرولوجية، وإدارة موارد المياه، وتقييم النظام البيئي المائي.",
  },
  waterLimited: {
    en: "The limited water features detected could inform small-scale water resource management, wetland conservation, irrigation planning, or drought monitoring efforts.",
    ar: "يمكن أن تساعد ميزات المياه المحدودة المكتشفة في إدارة موارد المياه الصغيرة، والحفاظ على الأراضي الرطبة، وتخطيط الري، أو جهود مراقبة الجفاف.",
  },

  // Urban applications
  urbanGeneric: {
    en: "This urban analysis can support city planning, infrastructure development, population density estimation, and urban growth monitoring.",
    ar: "يمكن أن يدعم هذا التحليل الحضري تخطيط المدن، وتطوير البنية التحتية، وتقدير كثافة السكان، ومراقبة النمو الحضري.",
  },
  urbanDenseCompact: {
    en: "This analysis of a densely developed urban area with compact pattern could support efficient public transportation planning, infrastructure optimization, and urban heat island mitigation strategies.",
    ar: "يمكن أن يدعم هذا التحليل لمنطقة حضرية مطورة بكثافة ذات نمط مدمج تخطيط وسائل النقل العام الفعالة، وتحسين البنية التحتية، واستراتيجيات التخفيف من تأثير الجزر الحرارية الحضرية.",
  },
  urbanDenseFragmented: {
    en: "This analysis of a highly urbanized area with fragmented development could inform urban consolidation planning, transportation network improvements, and service delivery optimization.",
    ar: "يمكن أن يساعد هذا التحليل لمنطقة حضرية عالية مع تطوير مجزأ في تخطيط التوحيد الحضري، وتحسينات شبكة النقل، وتحسين تقديم الخدمات.",
  },
  urbanDenseGeneric: {
    en: "This dense urban area analysis could support infrastructure planning, population density estimation, emergency response planning, and urban ecological studies.",
    ar: "يمكن أن يدعم تحليل المنطقة الحضرية الكثيفة هذا تخطيط البنية التحتية، وتقدير كثافة السكان، وتخطيط الاستجابة للطوارئ، والدراسات البيئية الحضرية.",
  },
  urbanModerate: {
    en: "This moderately urbanized area analysis could inform suburban development planning, mixed land use strategies, urban growth boundaries, and green space conservation efforts.",
    ar: "يمكن أن يساعد تحليل المنطقة الحضرية المعتدلة هذا في تخطيط التنمية الضواحي، واستراتيجيات استخدام الأراضي المختلطة، وحدود النمو الحضري، وجهود الحفاظ على المساحات الخضراء.",
  },
  urbanLimited: {
    en: "This analysis of an area with limited urban development could support rural planning, small settlement infrastructure needs, tourism development potential, and natural resource conservation.",
    ar: "يمكن أن يدعم هذا التحليل لمنطقة ذات تطوير حضري محدود التخطيط الريفي، واحتياجات البنية التحتية للمستوطنات الصغيرة، وإمكانات تطوير السياحة، والحفاظ على الموارد الطبيعية.",
  },

  // Cloud applications
  cloudGeneric: {
    en: "This cloud analysis can support weather pattern studies, image quality assessment for earth observation, and meteorological monitoring.",
    ar: "يمكن أن يدعم تحليل السحب هذا دراسات أنماط الطقس، وتقييم جودة الصورة للمراقبة الأرضية، والرصد الجوي.",
  },
  cloudHeavy: {
    en: "This heavily clouded image analysis helps identify limitations for land observation and could support meteorological studies, storm tracking, or atmospheric research.",
    ar: "يساعد تحليل الصورة ذات الغيوم الكثيفة هذا في تحديد قيود المراقبة الأرضية ويمكن أن يدعم الدراسات الجوية، وتتبع العواصف، أو البحث الغلاف الجوي.",
  },
  cloudPartial: {
    en: "This partially clouded image analysis could inform multi-temporal image selection strategies, partial scene analysis workflows, and cloud-aware remote sensing algorithms.",
    ar: "يمكن أن يساعد تحليل الصورة ذات الغيوم الجزئية هذا في استراتيجيات اختيار الصور متعددة الزمن، وسير عمل تحليل المشهد الجزئي، وخوارزميات الاستشعار عن بعد المدركة للسحب.",
  },
  cloudMinimal: {
    en: "This analysis of an image with minimal cloud coverage confirms good conditions for earth observation and could support accurate land feature detection and time series analysis.",
    ar: "يؤكد هذا التحليل لصورة ذات تغطية سحابية دنيا على وجود ظروف جيدة للمراقبة الأرضية ويمكن أن يدعم الكشف الدقيق عن ميزات الأرض وتحليل السلاسل الزمنية.",
  },

  // Default application
  defaultApplications: {
    en: "This analysis provides insights that can support environmental monitoring, resource management, and urban planning applications.",
    ar: "يوفر هذا التحليل رؤى يمكن أن تدعم تطبيقات المراقبة البيئية، وإدارة الموارد، والتخطيط الحضري.",
  },

  // Land Use applications
  landUseGeneric: {
    en: "This land use classification can support urban planning, environmental management, agricultural monitoring, and sustainable development initiatives.",
    ar: "يمكن أن يدعم تصنيف استخدام الأراضي هذا التخطيط الحضري، وإدارة البيئة، ومراقبة الزراعة، ومبادرات التنمية المستدامة.",
  },
  landUseUrbanDominant: {
    en: "This predominantly urban area classification could support city planning, infrastructure development, urban heat island studies, and smart city initiatives.",
    ar: "يمكن أن يدعم تصنيف المنطقة الحضرية السائدة هذا تخطيط المدن، وتطوير البنية التحتية، ودراسات الجزر الحرارية الحضرية، ومبادرات المدن الذكية.",
  },
  landUseAgricultureDominant: {
    en: "This primarily agricultural land classification could inform crop management, irrigation planning, yield estimation, and agricultural policy development.",
    ar: "يمكن أن يساعد تصنيف الأراضي الزراعية الرئيسية هذا في إدارة المحاصيل، وتخطيط الري، وتقدير المحصول، وتطوير السياسات الزراعية.",
  },
  landUseForestDominant: {
    en: "This forest-dominated classification could support forest management, biodiversity conservation, carbon sequestration assessment, and wildfire prevention planning.",
    ar: "يمكن أن يدعم تصنيف الغابات المهيمنة هذا إدارة الغابات، والحفاظ على التنوع البيولوجي، وتقييم احتجاز الكربون، وتخطيط الوقاية من حرائق الغابات.",
  },
  landUseWaterDominant: {
    en: "This water-dominated classification could inform watershed management, coastal planning, flood risk assessment, and water resource conservation.",
    ar: "يمكن أن يساعد تصنيف المياه المهيمنة هذا في إدارة مستجمعات المياه، والتخطيط الساحلي، وتقييم مخاطر الفيضانات، والحفاظ على موارد المياه.",
  },
  landUseBarrenDominant: {
    en: "This predominantly barren land classification could support desertification monitoring, land rehabilitation planning, and geological studies.",
    ar: "يمكن أن يدعم تصنيف الأراضي الجرداء السائدة هذا مراقبة التصحر، وتخطيط إعادة تأهيل الأراضي، والدراسات الجيولوجية.",
  },
  landUseDiverse: {
    en: "This highly diverse land use classification could inform integrated landscape management, ecosystem service assessment, and sustainable development planning.",
    ar: "يمكن أن يساعد تصنيف استخدام الأراضي المتنوع للغاية هذا في الإدارة المتكاملة للمناظر الطبيعية، وتقييم خدمات النظام البيئي، وتخطيط التنمية المستدامة.",
  },

  vegetationTypeExplanation: {
    en: "Vegetation analysis detects plant life and assesses its health based on spectral characteristics, useful for agriculture, forestry, and environmental monitoring.",
    ar: "يكتشف تحليل الغطاء النباتي الحياة النباتية ويقيم صحتها بناءً على الخصائص الطيفية، مفيد للزراعة والغابات ومراقبة البيئة.",
  },
  waterTypeExplanation: {
    en: "Water analysis identifies water bodies and classifies them by depth and clarity, useful for flood monitoring, coastal studies, and water resource management.",
    ar: "يحدد تحليل المياه المسطحات المائية ويصنفها حسب العمق والوضوح، مفيد لمراقبة الفيضانات ودراسات السواحل وإدارة موارد المياه.",
  },
  urbanTypeExplanation: {
    en: "Urban analysis detects built-up areas and categorizes them by density and use, useful for urban planning, development monitoring, and population studies.",
    ar: "يكتشف التحليل الحضري المناطق المبنية ويصنفها حسب الكثافة والاستخدام، مفيد للتخطيط الحضري ومراقبة التنمية ودراسات السكان.",
  },
  cloudTypeExplanation: {
    en: "Cloud analysis identifies cloud cover and types, useful for assessing image quality for earth observation and meteorological studies.",
    ar: "يحدد تحليل السحب الغطاء السحابي وأنواعه، مفيد لتقييم جودة الصورة للمراقبة الأرضية والدراسات الجوية.",
  },
  defaultTypeExplanation: {
    en: "Analysis of features in satellite imagery using spectral and spatial characteristics.",
    ar: "تحليل الميزات في صور الأقمار الصناعية باستخدام الخصائص الطيفية والمكانية.",
  },
};

// Export the translations if using modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { keyFindingsTranslations, applicationInsightsTranslations };
}
