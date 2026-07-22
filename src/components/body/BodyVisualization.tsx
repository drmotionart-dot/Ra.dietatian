"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, RotateCcw } from "lucide-react";

interface BodyMetrics {
  weight: number;
  height: number;
  bodyFatPercent: number;
  waist: number;
  hip: number;
  bicep: number;
  chest: number;
  thigh: number;
  neck: number;
}

interface BodyVisualizationProps {
  metrics?: BodyMetrics;
  showRealistic?: boolean;
  sex?: "male" | "female";
}

// SVG Body paths for cartoon style
const cartoonBodyPaths = {
  // Underweight male
  underweightMale: {
    torso: "M100,120 Q80,120 75,150 Q70,180 75,210 Q80,240 100,250 Q120,240 125,210 Q130,180 125,150 Q120,120 100,120",
    leftArm: "M75,130 Q60,140 55,170 Q50,200 55,230 Q60,240 65,230 Q70,200 75,170 Q80,140 75,130",
    rightArm: "M125,130 Q140,140 145,170 Q150,200 145,230 Q140,240 135,230 Q130,200 125,170 Q120,140 125,130",
    leftLeg: "M85,250 Q80,280 78,310 Q76,340 80,370 Q85,380 90,370 Q92,340 90,310 Q88,280 85,250",
    rightLeg: "M115,250 Q120,280 122,310 Q124,340 120,370 Q115,380 110,370 Q108,340 110,310 Q112,280 115,250",
    head: "M100,80 Q85,80 80,100 Q75,120 85,130 Q95,135 100,135 Q105,135 115,130 Q125,120 120,100 Q115,80 100,80",
  },
  // Normal male
  normalMale: {
    torso: "M100,120 Q75,120 70,160 Q65,200 75,230 Q85,255 100,260 Q115,255 125,230 Q135,200 130,160 Q125,120 100,120",
    leftArm: "M70,130 Q55,145 48,180 Q42,215 48,250 Q55,260 62,250 Q68,215 72,180 Q78,145 70,130",
    rightArm: "M130,130 Q145,145 152,180 Q158,215 152,250 Q145,260 138,250 Q132,215 128,180 Q122,145 130,130",
    leftLeg: "M82,260 Q75,295 72,330 Q70,365 75,390 Q82,400 90,390 Q92,365 88,330 Q85,295 82,260",
    rightLeg: "M118,260 Q125,295 128,330 Q130,365 125,390 Q118,400 110,390 Q108,365 112,330 Q115,295 118,260",
    head: "M100,75 Q82,75 75,100 Q68,125 80,140 Q92,148 100,148 Q108,148 120,140 Q132,125 125,100 Q118,75 100,75",
  },
  // Overweight male
  overweightMale: {
    torso: "M100,115 Q65,115 55,160 Q45,210 60,250 Q75,280 100,290 Q125,280 140,250 Q155,210 145,160 Q135,115 100,115",
    leftArm: "M55,125 Q38,145 30,185 Q22,225 30,265 Q40,280 50,265 Q55,225 58,185 Q62,145 55,125",
    rightArm: "M145,125 Q162,145 170,185 Q178,225 170,265 Q160,280 150,265 Q145,225 142,185 Q138,145 145,125",
    leftLeg: "M75,290 Q65,325 60,360 Q58,395 65,420 Q75,432 85,420 Q88,395 82,360 Q78,325 75,290",
    rightLeg: "M125,290 Q135,325 140,360 Q142,395 135,420 Q125,432 115,420 Q112,395 118,360 Q122,325 125,290",
    head: "M100,70 Q78,70 70,98 Q62,126 75,145 Q90,155 100,155 Q110,155 125,145 Q138,126 130,98 Q122,70 100,70",
  },
  // Obese male
  obeseMale: {
    torso: "M100,110 Q55,110 40,165 Q25,225 45,275 Q65,310 100,320 Q135,310 155,275 Q175,225 160,165 Q145,110 100,110",
    leftArm: "M40,120 Q20,145 10,195 Q0,245 10,295 Q25,315 40,295 Q45,245 42,195 Q45,145 40,120",
    rightArm: "M160,120 Q180,145 190,195 Q200,245 190,295 Q175,315 160,295 Q155,245 158,195 Q155,145 160,120",
    leftLeg: "M65,320 Q50,360 45,400 Q42,440 52,465 Q65,478 78,465 Q82,440 75,400 Q70,360 65,320",
    rightLeg: "M135,320 Q150,360 155,400 Q158,440 148,465 Q135,478 122,465 Q118,440 125,400 Q130,360 135,320",
    head: "M100,65 Q72,65 62,95 Q52,128 68,152 Q85,165 100,165 Q115,165 132,152 Q148,128 138,95 Q128,65 100,65",
  },
  // Underweight female
  underweightFemale: {
    torso: "M100,120 Q82,120 78,148 Q74,176 80,200 Q86,218 100,224 Q114,218 120,200 Q126,176 122,148 Q118,120 100,120",
    leftArm: "M78,130 Q64,140 60,168 Q56,196 60,224 Q64,234 68,224 Q72,196 74,168 Q78,148 78,130",
    rightArm: "M122,130 Q136,140 140,168 Q144,196 140,224 Q136,234 132,224 Q128,196 126,168 Q122,148 122,130",
    leftLeg: "M86,224 Q82,256 80,288 Q78,320 82,352 Q86,362 90,352 Q92,320 88,288 Q86,256 86,224",
    rightLeg: "M114,224 Q118,256 120,288 Q122,320 118,352 Q114,362 110,352 Q108,320 112,288 Q114,256 114,224",
    head: "M100,82 Q86,82 82,100 Q78,118 86,128 Q94,134 100,134 Q106,134 114,128 Q122,118 118,100 Q114,82 100,82",
  },
  // Normal female
  normalFemale: {
    torso: "M100,118 Q78,118 72,155 Q66,192 74,218 Q82,238 100,244 Q118,238 126,218 Q134,192 128,155 Q122,118 100,118",
    leftArm: "M72,128 Q56,142 50,175 Q44,208 50,240 Q56,250 62,240 Q66,208 68,175 Q74,142 72,128",
    rightArm: "M128,128 Q144,142 150,175 Q156,208 150,240 Q144,250 138,240 Q134,208 132,175 Q126,142 128,128",
    leftLeg: "M82,244 Q76,278 74,312 Q72,346 78,374 Q84,384 90,374 Q92,346 86,312 Q84,278 82,244",
    rightLeg: "M118,244 Q124,278 126,312 Q128,346 122,374 Q116,384 110,374 Q108,346 114,312 Q116,278 118,244",
    head: "M100,78 Q84,78 78,98 Q72,118 82,132 Q92,140 100,140 Q108,140 118,132 Q128,118 122,98 Q116,78 100,78",
  },
  // Overweight female
  overweightFemale: {
    torso: "M100,114 Q68,114 58,158 Q48,202 60,238 Q72,264 100,274 Q128,264 140,238 Q152,202 142,158 Q132,114 100,114",
    leftArm: "M58,124 Q40,144 32,182 Q24,220 32,258 Q42,272 52,258 Q56,220 56,182 Q60,144 58,124",
    rightArm: "M142,124 Q160,144 168,182 Q176,220 168,258 Q158,272 148,258 Q144,220 144,182 Q140,144 142,124",
    leftLeg: "M72,274 Q62,310 58,346 Q56,382 62,408 Q72,420 82,408 Q84,382 78,346 Q74,310 72,274",
    rightLeg: "M128,274 Q138,310 142,346 Q144,382 138,408 Q128,420 118,408 Q116,382 122,346 Q126,310 128,274",
    head: "M100,72 Q80,72 72,96 Q64,124 76,142 Q88,152 100,152 Q112,152 124,142 Q136,124 128,96 Q120,72 100,72",
  },
  // Obese female
  obeseFemale: {
    torso: "M100,108 Q58,108 44,162 Q30,216 48,262 Q66,298 100,308 Q134,298 152,262 Q170,216 156,162 Q142,108 100,108",
    leftArm: "M44,118 Q24,142 14,190 Q4,238 14,286 Q28,306 42,286 Q46,238 44,190 Q46,142 44,118",
    rightArm: "M156,118 Q176,142 186,190 Q196,238 186,286 Q172,306 158,286 Q154,238 156,190 Q154,142 156,118",
    leftLeg: "M62,308 Q48,348 42,388 Q38,428 50,454 Q62,466 76,454 Q80,428 72,388 Q66,348 62,308",
    rightLeg: "M138,308 Q152,348 158,388 Q162,428 150,454 Q138,466 124,454 Q120,428 128,388 Q134,348 138,308",
    head: "M100,66 Q74,66 64,94 Q54,126 70,148 Q86,160 100,160 Q114,160 130,148 Q146,126 136,94 Q126,66 100,66",
  },
};

// Get body type based on BMI and sex
const getBodyType = (bmi: number, sex: "male" | "female"): keyof typeof cartoonBodyPaths => {
  if (sex === "female") {
    if (bmi < 18.5) return "underweightFemale";
    if (bmi < 25) return "normalFemale";
    if (bmi < 30) return "overweightFemale";
    return "obeseFemale";
  }
  if (bmi < 18.5) return "underweightMale";
  if (bmi < 25) return "normalMale";
  if (bmi < 30) return "overweightMale";
  return "obeseMale";
};

// Calculate BMI
const calculateBMI = (weight: number, height: number): number => {
  const heightM = height / 100;
  return weight / (heightM * heightM);
};

// Calculate body measurements scale based on actual measurements
const calculateBodyScale = (metrics: BodyMetrics) => {
  const bmi = calculateBMI(metrics.weight, metrics.height);
  const baseScale = bmi < 18.5 ? 0.8 : bmi < 25 ? 1 : bmi < 30 ? 1.2 : 1.4;
  
  return {
    torsoWidth: baseScale * (metrics.waist / 80),
    armSize: baseScale * (metrics.bicep / 30),
    legSize: baseScale * (metrics.thigh / 50),
    chestWidth: baseScale * (metrics.chest / 100),
  };
};

export default function BodyVisualization({ 
  metrics = { weight: 70, height: 175, bodyFatPercent: 20, waist: 80, hip: 95, bicep: 30, chest: 100, thigh: 50, neck: 38 },
  showRealistic = false,
  sex = "male"
}: BodyVisualizationProps) {
  const t = useTranslations();
  const [view, setView] = useState<"front" | "back">("front");
  const [isRealistic, setIsRealistic] = useState(showRealistic);
  
  const bmi = calculateBMI(metrics.weight, metrics.height);
  const bodyType = getBodyType(bmi, sex);
  const bodyScale = calculateBodyScale(metrics);
  
  // Get current body paths
  const currentPaths = cartoonBodyPaths[bodyType];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={view === "front" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("front")}
          >
            {t("body.frontView")}
          </Button>
          <Button
            variant={view === "back" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("back")}
          >
            {t("body.backView")}
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsRealistic(!isRealistic)}
        >
          {isRealistic ? <EyeOff className="h-4 w-4 me-2" /> : <Eye className="h-4 w-4 me-2" />}
          {isRealistic ? t("body.cartoonView") : t("body.realisticView")}
        </Button>
      </div>

      {/* Body Visualization */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <svg
              viewBox="0 0 200 450"
              className="w-64 h-auto"
              style={{ maxHeight: "400px" }}
            >
              {/* Background */}
              <rect width="200" height="450" fill="transparent" />
              
              {/* Body shadow */}
              <ellipse cx="100" cy="440" rx="40" ry="5" fill="rgba(0,0,0,0.1)" />
              
              {/* Body parts with animation */}
              <motion.g
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Left Leg */}
                <motion.path
                  d={currentPaths.leftLeg}
                  fill={isRealistic ? "url(#skinRealistic)" : "#F5D0A9"}
                  stroke={isRealistic ? "#C4956A" : "#E8B88A"}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
                
                {/* Right Leg */}
                <motion.path
                  d={currentPaths.rightLeg}
                  fill={isRealistic ? "url(#skinRealistic)" : "#F5D0A9"}
                  stroke={isRealistic ? "#C4956A" : "#E8B88A"}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
                
                {/* Left Arm */}
                <motion.path
                  d={currentPaths.leftArm}
                  fill={isRealistic ? "url(#skinRealistic)" : "#F5D0A9"}
                  stroke={isRealistic ? "#C4956A" : "#E8B88A"}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                />
                
                {/* Right Arm */}
                <motion.path
                  d={currentPaths.rightArm}
                  fill={isRealistic ? "url(#skinRealistic)" : "#F5D0A9"}
                  stroke={isRealistic ? "#C4956A" : "#E8B88A"}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                
                {/* Torso */}
                <motion.path
                  d={currentPaths.torso}
                  fill={isRealistic ? "url(#skinRealistic)" : "#F5D0A9"}
                  stroke={isRealistic ? "#C4956A" : "#E8B88A"}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                />
                
                {/* Head */}
                <motion.path
                  d={currentPaths.head}
                  fill={isRealistic ? "url(#skinRealistic)" : "#F5D0A9"}
                  stroke={isRealistic ? "#C4956A" : "#E8B88A"}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
                
                {/* Eyes */}
                {view === "front" && (
                  <>
                    <motion.circle
                      cx="90" cy="100" r="3"
                      fill="#333"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    />
                    <motion.circle
                      cx="110" cy="100" r="3"
                      fill="#333"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 }}
                    />
                  </>
                )}
                
                {/* Mouth */}
                {view === "front" && (
                  <motion.path
                    d="M92,115 Q100,122 108,115"
                    fill="none"
                    stroke="#333"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.2 }}
                  />
                )}
              </motion.g>

              {/* Realistic mode: gradient definitions for skin shading */}
              {isRealistic && (
                <defs>
                  <linearGradient id="skinRealistic" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5D0A9" />
                    <stop offset="50%" stopColor="#E8C49A" />
                    <stop offset="100%" stopColor="#D4A574" />
                  </linearGradient>
                </defs>
              )}
              
              {/* Measurement labels */}
              {view === "front" && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  {/* Waist measurement */}
                  <line x1="20" y1="180" x2="40" y2="180" stroke="#666" strokeWidth="1" strokeDasharray="4" />
                  <text x="10" y="185" fontSize="8" fill="#666">{metrics.waist}{t("units.cm")}</text>
                  
                  {/* Chest measurement */}
                  <line x1="160" y1="150" x2="180" y2="150" stroke="#666" strokeWidth="1" strokeDasharray="4" />
                  <text x="165" y="145" fontSize="8" fill="#666">{metrics.chest}{t("units.cm")}</text>
                </motion.g>
              )}
            </svg>
          </div>
          
          {/* BMI Display */}
          <div className="text-center mt-4">
            <div className="text-2xl font-bold text-primary">
              {bmi.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("body.bmi")} • {t(`body.${bmi < 18.5 ? "underweight" : bmi < 25 ? "normalWeight" : bmi < 30 ? "overweight" : "obese"}`)}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Metrics Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-bold">{metrics.weight} {t("units.kg")}</div>
              <div className="text-xs text-muted-foreground">{t("body.weight")}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-bold">{metrics.bodyFatPercent}%</div>
              <div className="text-xs text-muted-foreground">{t("body.bodyFat")}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-bold">{metrics.waist} {t("units.cm")}</div>
              <div className="text-xs text-muted-foreground">{t("body.waist")}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-bold">{metrics.hip} {t("units.cm")}</div>
              <div className="text-xs text-muted-foreground">{t("body.hip")}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
