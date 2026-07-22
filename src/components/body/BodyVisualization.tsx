"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, RotateCcw } from "lucide-react";

interface BodyMetrics {
  weight: number;
  height: number;
  bodyFatPercent: number;
  muscleMass: number;
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
};

// Get body type based on BMI
const getBodyType = (bmi: number): keyof typeof cartoonBodyPaths => {
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
  metrics = { weight: 70, height: 175, bodyFatPercent: 20, muscleMass: 30, waist: 80, hip: 95, bicep: 30, chest: 100, thigh: 50, neck: 38 },
  showRealistic = false 
}: BodyVisualizationProps) {
  const t = useTranslations();
  const [view, setView] = useState<"front" | "back">("front");
  const [isRealistic, setIsRealistic] = useState(showRealistic);
  
  const bmi = calculateBMI(metrics.weight, metrics.height);
  const bodyType = getBodyType(bmi);
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
                  <text x="10" y="185" fontSize="8" fill="#666">{metrics.waist}cm</text>
                  
                  {/* Chest measurement */}
                  <line x1="160" y1="150" x2="180" y2="150" stroke="#666" strokeWidth="1" strokeDasharray="4" />
                  <text x="165" y="145" fontSize="8" fill="#666">{metrics.chest}cm</text>
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
              <div className="text-lg font-bold">{metrics.weight} kg</div>
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
              <div className="text-lg font-bold">{metrics.waist} cm</div>
              <div className="text-xs text-muted-foreground">{t("body.waist")}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-bold">{metrics.hip} cm</div>
              <div className="text-xs text-muted-foreground">{t("body.hip")}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
