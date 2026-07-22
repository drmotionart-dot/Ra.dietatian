"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ruler, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

const measurementIds = ["waist", "hip", "bicep", "chest", "thigh", "neck"] as const;
type MeasurementId = typeof measurementIds[number];

export default function MeasurementTutorial() {
  const t = useTranslations();
  const [selectedMeasurement, setSelectedMeasurement] = useState<MeasurementId>("waist");
  const [currentStep, setCurrentStep] = useState(0);

  const prefix = `body.measurements.${selectedMeasurement}`;
  const steps = t.raw(`${prefix}.steps`) as string[];
  const mistakes = t.raw(`${prefix}.mistakes`) as string[];
  const tips = t.raw(`${prefix}.tips`) as string[];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Ruler className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t("body.howToMeasure")}</h1>
      </div>

      {/* Measurement Selector */}
      <div className="flex flex-wrap gap-2">
        {measurementIds.map((id) => (
          <Button
            key={id}
            variant={selectedMeasurement === id ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedMeasurement(id);
              setCurrentStep(0);
            }}
          >
            {t(`body.measurements.${id}.title`)}
          </Button>
        ))}
      </div>

      {/* Selected Measurement Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            {t(`${prefix}.title`)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm">{t(`${prefix}.description`)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {t("body.measurementGuide")}: {t(`${prefix}.anatomicalPoint`)}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h3 className="font-medium">{t("body.steps")}</h3>
            <div className="space-y-3">
              {steps.map((step: string, index: number) => (
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
                {t("common.back")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
              >
                {t("common.next")}
                <ArrowRight className="h-4 w-4 me-2 rtl:scale-x-[-1]" />
              </Button>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-4 w-4" />
              {t("body.commonMistakes")}
            </h3>
            <ul className="space-y-2">
              {mistakes.map((mistake: string, index: number) => (
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
              {t("body.tipsForConsistentResults")}
            </h3>
            <ul className="space-y-2">
              {tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
