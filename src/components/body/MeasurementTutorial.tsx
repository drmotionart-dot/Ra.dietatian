"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

interface MeasurementStep {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  anatomicalPoint: string;
  anatomicalPointAr: string;
  steps: string[];
  stepsAr: string[];
  commonMistakes: string[];
  commonMistakesAr: string[];
  tips: string[];
  tipsAr: string[];
}

const measurements: MeasurementStep[] = [
  {
    id: "waist",
    title: "Waist Circumference",
    titleAr: "محيط الخصر",
    description: "Measure at the narrowest point between rib cage and iliac crest",
    descriptionAr: "قيس عند أضيق نقطة بين القفص الصدري ونتيجة الحرقفة",
    anatomicalPoint: "Midpoint between 10th rib and iliac crest",
    anatomicalPointAr: "المنتصف بين الضلع العاشر ونتيجة الحرقفة",
    steps: [
      "Stand straight with arms crossed on opposite shoulders",
      "Locate the iliac crest (top of hip bone)",
      "Find the 10th rib (lower costal border)",
      "Measure at mid-point between these two landmarks",
      "Breathe out normally and read the measurement",
      "Keep tape snug but not compressing skin"
    ],
    stepsAr: [
      "قف منتصباً مع وضع الذراعين على الكتفين المتقابلين",
      "حدد موقع الحرقفة العلوية (أعلى عظم الحوض)",
      "ابحث عن الضلع العاشر (الحافة السفلية للقفص الصدري)",
      "قيس عند نقطة المنتصف بين هاتين المرجعيتين",
      "ازفر بشكل طبيعي واقرأ القياس",
      "احتفظ بالشريط مشدداً لكن دون ضغط على الجلد"
    ],
    commonMistakes: [
      "Sucking in the stomach",
      "Measuring at the navel instead of the correct point",
      "Pulling the tape too tight",
      "Measuring while breathing in"
    ],
    commonMistakesAr: [
      " sucked in المعدة",
      "القياس عند السرة بدلاً من النقطة الصحيحة",
      "شد الشريط بإفراط",
      "القياس أثناء الشهيق"
    ],
    tips: [
      "Measure in the morning before eating",
      "Take 2 measurements and average them",
      "Measure at the same time each day for consistency"
    ],
    tipsAr: [
      "قيس في الصباح قبل الأكل",
      "خذ قياسين واخذ المتوسط",
      "قيس في نفس الوقت كل يوم للحصول على نتائج متسقة"
    ]
  },
  {
    id: "hip",
    title: "Hip Circumference",
    titleAr: "محيط الأرداف",
    description: "Measure at the widest point of the buttocks",
    descriptionAr: "قيس عند أوسع نقطة في الأرداف",
    anatomicalPoint: "Widest point of buttocks",
    anatomicalPointAr: "أوسع نقطة في الأرداف",
    steps: [
      "Stand with feet together",
      "Wrap tape around widest part of buttocks",
      "Keep tape horizontal and parallel to floor",
      "Measure at end of normal expiration"
    ],
    stepsAr: [
      "قف مع ضم القدمين",
      "لف الشريط حول أوسع جزء من الأرداف",
      "احتفظ بالشريط أفقياً ومتوازياً مع الأرض",
      "قيس عند نهاية الزفير الطبيعي"
    ],
    commonMistakes: [
      "Standing with feet apart",
      "Tape not level",
      "Measuring too high or too low"
    ],
    commonMistakesAr: [
      "الوقف بقدمين متباعدتين",
      "الشريط غير مستو",
      "القياس في مكان مرتفع أو منخفض جداً"
    ],
    tips: [
      "Use a mirror to check tape is level",
      "Wear minimal clothing for accuracy"
    ],
    tipsAr: [
      "استخدم مرآة للتأكد من استقامة الشريط",
      "ارتدِ ملابس خفيفة للحصول على قياس دقيق"
    ]
  },
  {
    id: "bicep",
    title: "Mid-Upper Arm Circumference",
    titleAr: "محيط منتصف العضلة ذات الرأسين",
    description: "Measure at the midpoint of the upper arm",
    descriptionAr: "قيس عند منتصف الذراع العلوية",
    anatomicalPoint: "Midpoint between acromion and olecranon",
    anatomicalPointAr: "المنتصف بين الكتف والمرفق",
    steps: [
      "Find the spine of the scapula (shoulder blade)",
      "Find the olecranon (bony elbow tip)",
      "Measure from acromion to olecranon",
      "Mark the midpoint with a cosmetic pencil",
      "Wrap tape around arm at marked midpoint",
      "Arm should be hanging freely, relaxed"
    ],
    stepsAr: [
      "ابحث عن شوكة لوح الكتف",
      "ابحث عن الكوع العظمي (نقطة المرفق العظمية)",
      "قيس من الكتف إلى الكوع",
      "حدد النقطة المتوسطة بقلم تجميل",
      "لف الشريط حول الذراع عند النقطة المتوسطة المحددة",
      "يجب أن يكون الذراع معلقاً بحرية وم松弛اً"
    ],
    commonMistakes: [
      "Flexing arm muscles during measurement",
      "Wrong midpoint location",
      "Measuring the wrong arm"
    ],
    commonMistakesAr: [
      "شد عضلات الذراع أثناء القياس",
      "موقع خاطئ للنقطة المتوسطة",
      "قياس الذراع الخاطئة"
    ],
    tips: [
      "Always measure the right arm",
      "Let arm hang naturally at your side"
    ],
    tipsAr: [
      "قيس دائماً الذراع اليمنى",
      "دع الذراع تتدلى بشكل طبيعي بجانبك"
    ]
  },
  {
    id: "chest",
    title: "Chest Circumference",
    titleAr: "محيط الصدر",
    description: "Measure across the nipple line, under the armpits",
    descriptionAr: "قيس عبر خط الحلمة، تحت الإبطين",
    anatomicalPoint: "Across nipple line, under armpits",
    anatomicalPointAr: "عبر خط الحلمة، تحت الإبطين",
    steps: [
      "Stand straight with arms slightly out",
      "Wrap tape under armpits",
      "Across the nipple line (men) or above breast (women)",
      "Keep tape horizontal",
      "Measure at end of normal expiration"
    ],
    stepsAr: [
      "قف منتصباً مع إبقاء الذراعين قليلاً للأعلى",
      "لف الشريط تحت الإبطين",
      "عبر خط الحلمة (للرجال) أو فوق الثدي (للنساء)",
      "احتفظ بالشريط أفقياً",
      "قيس عند نهاية الزفير الطبيعي"
    ],
    commonMistakes: [
      "Measuring too high (over shoulders)",
      "Measuring too low (under bust)",
      "Tape too loose or too tight"
    ],
    commonMistakesAr: [
      "القياس في مكان مرتفع جداً (فوق الكتفين)",
      "القياس في مكان منخفض جداً (تحت الصدر)",
      "الشريط م loosen أو مشدود جداً"
    ],
    tips: [
      "For women, measure above the breast tissue",
      "Take a deep breath in, then breathe out and measure"
    ],
    tipsAr: [
      "للنساء، قيسي فوق نسيج الثدي",
      "خذي نفساً عميقاً، ثم زفري وقيسي"
    ]
  },
  {
    id: "thigh",
    title: "Thigh Circumference",
    titleAr: "محيط الفخذ",
    description: "Measure at the midpoint of the anterior thigh",
    descriptionAr: "قيس عند منتصف الفخذ الأمامي",
    anatomicalPoint: "Midpoint of anterior thigh",
    anatomicalPointAr: "منتصف الفخذ الأمامي",
    steps: [
      "Shift weight to left leg",
      "Place right leg forward with knee slightly flexed",
      "Foot flat on floor",
      "Measure at midline of anterior thigh"
    ],
    stepsAr: [
      "انقل الوزن إلى الرجل اليسرى",
      "ضع الرجل اليمنى أمامك مع ثني الركبة قليلاً",
      "القدم مسطحة على الأرض",
      "قيس عند خط منتصف الفخذ الأمامي"
    ],
    commonMistakes: [
      "Standing with weight on measured leg",
      "Incorrect midpoint location",
      "Measuring too high (near groin)"
    ],
    commonMistakesAr: [
      "الوقف بوزن على الرجل التي تقيسها",
      "موقع خاطئ للنقطة المتوسطة",
      "القياس في مكان مرتفع جداً (قرب الحوض)"
    ],
    tips: [
      "Use a knee caliper to mark midpoint",
      "Measure the larger thigh if asymmetric"
    ],
    tipsAr: [
      "استخدم مقياس الركبة لتحديد النقطة المتوسطة",
      "قيس الفخذ الأكبر إذا كان هناك عدم تساوي"
    ]
  },
  {
    id: "neck",
    title: "Neck Circumference",
    titleAr: "محيط الرقبة",
    description: "Measure just below the laryngeal prominence",
    descriptionAr: "قيس أسفل الناتئ الحنجراني مباشرة",
    anatomicalPoint: "Just below Adam's apple",
    anatomicalPointAr: "أسفل تفاحة آدم مباشرة",
    steps: [
      "Stand straight looking forward",
      "Locate the laryngeal prominence (Adam's apple)",
      "Wrap tape just below this point",
      "Snug but not tight",
      "Keep head in neutral position"
    ],
    stepsAr: [
      "قف منتصباً وأمامك مباشرة",
      "حدد موقع الناتئ الحنجراني (تفاحة آدم)",
      "لف الشريط أسفل هذه النقطة مباشرة",
      "مشدود لكن غير ضيق",
      "احتفظ برأسك في وضع محايد"
    ],
    commonMistakes: [
      "Measuring too high (at jawline)",
      "Measuring too low (at collarbone)",
      "Pulling tape too tight"
    ],
    commonMistakesAr: [
      "القياس في مكان مرتفع جداً (عند خط الفك)",
      "القياس في مكان منخفض جداً (عند عظمة الترقوة)",
      "شد الشريط بإفراط"
    ],
    tips: [
      "Keep head level, don't tilt up or down",
      "Two fingers under tape for proper tightness"
    ],
    tipsAr: [
      "احتفظ برأسك مستوياً، لا ترفعه أو تخفضه",
      "إصبعان تحت الشريط للحصول على التشد المناسب"
    ]
  }
];

export default function MeasurementTutorial() {
  const t = useTranslations();
  const [selectedMeasurement, setSelectedMeasurement] = useState<string>("waist");
  const [currentStep, setCurrentStep] = useState(0);

  const measurement = measurements.find(m => m.id === selectedMeasurement);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Ruler className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t("body.howToMeasure")}</h1>
      </div>

      {/* Measurement Selector */}
      <div className="flex flex-wrap gap-2">
        {measurements.map((m) => (
          <Button
            key={m.id}
            variant={selectedMeasurement === m.id ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedMeasurement(m.id);
              setCurrentStep(0);
            }}
          >
            {m.titleAr}
          </Button>
        ))}
      </div>

      {/* Selected Measurement Details */}
      {measurement && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              {measurement.titleAr}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">{measurement.descriptionAr}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {t("body.measurementGuide")}: {measurement.anatomicalPointAr}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <h3 className="font-medium">الخطوات:</h3>
              <div className="space-y-3">
                {measurement.stepsAr.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      index === currentStep 
                        ? "bg-primary/10 border border-primary/20" 
                        : "bg-muted/30"
                    }`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      index <= currentStep 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
              
              {/* Step Navigation */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  السابق
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(Math.min(measurement.stepsAr.length - 1, currentStep + 1))}
                  disabled={currentStep === measurement.stepsAr.length - 1}
                >
                  التالي
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                الأخطاء الشائعة:
              </h3>
              <ul className="space-y-2">
                {measurement.commonMistakesAr.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-orange-500 mt-1">•</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                نصائح للحصول على نتائج متسقة:
              </h3>
              <ul className="space-y-2">
                {measurement.tipsAr.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
