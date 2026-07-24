"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

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
  sex?: "male" | "female";
}

const calculateBMI = (weight: number, height: number): number => {
  const heightM = height / 100;
  if (heightM === 0) return 0;
  return weight / (heightM * heightM);
};

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

function generateBodyPaths(m: BodyMetrics, sex: "male" | "female") {
  const waist = clamp(m.waist || 75, 50, 160);
  const chest = clamp(m.chest || 90, 60, 160);
  const hip = clamp(m.hip || 90, 55, 160);
  const bicep = clamp(m.bicep || 28, 15, 55);
  const thigh = clamp(m.thigh || 48, 25, 85);
  const neck = clamp(m.neck || 36, 22, 55);

  const CX = 100;

  const shoulderW = chest * 0.32;
  const waistW = waist * 0.28;
  const hipW = hip * 0.27;
  const bicepW = bicep * 0.22;
  const thighW = thigh * 0.22;
  const neckW = neck * 0.18;
  const headW = neck * 0.27;

  const torsoTop = 115;
  const torsoMid = 185;
  const torsoBot = 255;
  const torsoH = torsoBot - torsoTop;

  const chestY = torsoTop + torsoH * 0.25;
  const waistY = torsoTop + torsoH * 0.6;
  const hipY = torsoTop + torsoH * 0.85;

  const shoulderY = torsoTop + 5;
  const waistSideX_l = CX - waistW;
  const waistSideX_r = CX + waistW;
  const chestSideX_l = CX - shoulderW;
  const chestSideX_r = CX + shoulderW;
  const hipSideX_l = CX - hipW;
  const hipSideX_r = CX + hipW;

  const torsoPath = `
    M ${CX} ${torsoTop}
    C ${CX - shoulderW * 0.4} ${torsoTop - 3}, ${chestSideX_l} ${shoulderY}, ${chestSideX_l} ${chestY}
    Q ${chestSideX_l - 3} ${torsoMid - 10}, ${waistSideX_l} ${waistY}
    Q ${waistSideX_l - 2} ${hipY - 8}, ${hipSideX_l} ${hipY}
    L ${hipSideX_l + 3} ${torsoBot}
    L ${hipSideX_r - 3} ${torsoBot}
    L ${hipSideX_r} ${hipY}
    Q ${hipSideX_r + 2} ${hipY - 8}, ${waistSideX_r} ${waistY}
    Q ${waistSideX_r + 3} ${torsoMid - 10}, ${chestSideX_r} ${chestY}
    C ${chestSideX_r} ${shoulderY}, ${CX + shoulderW * 0.4} ${torsoTop - 3}, ${CX} ${torsoTop}
    Z
  `;

  const armTopY = shoulderY + 2;
  const elbowY = torsoMid + 15;
  const wristY = torsoBot + 35;
  const handY = wristY + 12;

  const laOuterX = chestSideX_l - bicepW * 0.3;
  const laInnerX = chestSideX_l + bicepW * 0.2;
  const laMidX = laOuterX - bicepW * 0.5;
  const laWristX = laInnerX - 2;

  const leftArm = `
    M ${laInnerX} ${armTopY}
    Q ${laMidX} ${elbowY - 20}, ${laMidX - bicepW * 0.3} ${elbowY}
    Q ${laMidX - bicepW * 0.35} ${(elbowY + wristY) / 2}, ${laWristX - bicepW * 0.15} ${wristY}
    Q ${laWristX - bicepW * 0.1} ${handY - 5}, ${laWristX} ${handY}
    Q ${laWristX + bicepW * 0.15} ${handY - 3}, ${laWristX + bicepW * 0.1} ${wristY}
    Q ${laMidX - bicepW * 0.1} ${(elbowY + wristY) / 2}, ${laMidX + bicepW * 0.1} ${elbowY}
    Q ${laMidX + bicepW * 0.2} ${elbowY - 20}, ${laOuterX + bicepW * 0.4} ${armTopY}
    Z
  `;

  const raOuterX = chestSideX_r + bicepW * 0.3;
  const raInnerX = chestSideX_r - bicepW * 0.2;
  const raMidX = raOuterX + bicepW * 0.5;
  const raWristX = raInnerX + 2;

  const rightArm = `
    M ${raInnerX} ${armTopY}
    Q ${raMidX} ${elbowY - 20}, ${raMidX + bicepW * 0.3} ${elbowY}
    Q ${raMidX + bicepW * 0.35} ${(elbowY + wristY) / 2}, ${raWristX + bicepW * 0.15} ${wristY}
    Q ${raWristX + bicepW * 0.1} ${handY - 5}, ${raWristX} ${handY}
    Q ${raWristX - bicepW * 0.15} ${handY - 3}, ${raWristX - bicepW * 0.1} ${wristY}
    Q ${raMidX + bicepW * 0.1} ${(elbowY + wristY) / 2}, ${raMidX - bicepW * 0.1} ${elbowY}
    Q ${raMidX - bicepW * 0.2} ${elbowY - 20}, ${raOuterX - bicepW * 0.4} ${armTopY}
    Z
  `;

  const legTopY = torsoBot;
  const kneeY = torsoBot + 65;
  const ankleY = torsoBot + 125;
  const footY = ankleY + 10;

  const hipCenterX = (hipSideX_l + hipSideX_r) / 2;
  const hipSpan = (hipSideX_r - hipSideX_l) / 2;

  const leftLegTopX = hipCenterX - hipSpan * 0.7;
  const rightLegTopX = hipCenterX + hipSpan * 0.7;
  const legGap = thighW * 0.2;

  const leftLeg = `
    M ${leftLegTopX} ${legTopY}
    Q ${leftLegTopX - thighW * 0.1} ${kneeY - 15}, ${leftLegTopX - thighW * 0.05} ${kneeY}
    Q ${leftLegTopX - thighW * 0.02} ${(kneeY + ankleY) / 2}, ${leftLegTopX + legGap} ${ankleY}
    L ${leftLegTopX + legGap + thighW * 0.4} ${ankleY}
    L ${leftLegTopX + legGap + thighW * 0.35} ${footY}
    L ${leftLegTopX - thighW * 0.15} ${footY}
    L ${leftLegTopX - thighW * 0.2} ${ankleY}
    Q ${leftLegTopX - thighW * 0.12} ${(kneeY + ankleY) / 2}, ${leftLegTopX - thighW * 0.15} ${kneeY}
    Q ${leftLegTopX - thighW * 0.18} ${kneeY - 15}, ${leftLegTopX - thighW * 0.15} ${legTopY}
    Z
  `;

  const rightLeg = `
    M ${rightLegTopX} ${legTopY}
    Q ${rightLegTopX + thighW * 0.1} ${kneeY - 15}, ${rightLegTopX + thighW * 0.05} ${kneeY}
    Q ${rightLegTopX + thighW * 0.02} ${(kneeY + ankleY) / 2}, ${rightLegTopX - legGap} ${ankleY}
    L ${rightLegTopX - legGap - thighW * 0.4} ${ankleY}
    L ${rightLegTopX - legGap - thighW * 0.35} ${footY}
    L ${rightLegTopX + thighW * 0.15} ${footY}
    L ${rightLegTopX + thighW * 0.2} ${ankleY}
    Q ${rightLegTopX + thighW * 0.12} ${(kneeY + ankleY) / 2}, ${rightLegTopX + thighW * 0.15} ${kneeY}
    Q ${rightLegTopX + thighW * 0.18} ${kneeY - 15}, ${rightLegTopX + thighW * 0.15} ${legTopY}
    Z
  `;

  const headR = headW * 1.1;
  const headCY = torsoTop - headR - 10;
  const neckTopY = torsoTop - 3;

  const neckPath = `
    M ${CX - neckW * 0.5} ${neckTopY}
    Q ${CX - neckW * 0.55} ${neckTopY - 8}, ${CX - headR * 0.3} ${headCY + headR * 0.7}
    L ${CX + headR * 0.3} ${headCY + headR * 0.7}
    Q ${CX + neckW * 0.55} ${neckTopY - 8}, ${CX + neckW * 0.5} ${neckTopY}
    Z
  `;

  const headPath = `
    M ${CX} ${headCY - headR}
    Q ${CX - headR * 0.95} ${headCY - headR * 0.5}, ${CX - headR} ${headCY}
    Q ${CX - headR * 0.95} ${headCY + headR * 0.6}, ${CX - headR * 0.3} ${headCY + headR * 0.75}
    Q ${CX} ${headCY + headR * 0.9}, ${CX + headR * 0.3} ${headCY + headR * 0.75}
    Q ${CX + headR * 0.95} ${headCY + headR * 0.6}, ${CX + headR} ${headCY}
    Q ${CX + headR * 0.95} ${headCY - headR * 0.5}, ${CX} ${headCY - headR}
    Z
  `;

  const eyeY = headCY - headR * 0.05;
  const eyeSpacing = headR * 0.35;
  const mouthY = headCY + headR * 0.35;

  return { torsoPath, leftArm, rightArm, leftLeg, rightLeg, neckPath, headPath, headCY, eyeY, eyeSpacing, mouthY, CX };
}

export default function BodyVisualization({
  metrics = { weight: 70, height: 175, bodyFatPercent: 20, waist: 80, hip: 95, bicep: 30, chest: 100, thigh: 50, neck: 38 },
  sex = "male",
}: BodyVisualizationProps) {
  const t = useTranslations();

  const bmi = useMemo(() => calculateBMI(metrics.weight, metrics.height), [metrics.weight, metrics.height]);
  const paths = useMemo(() => generateBodyPaths(metrics, sex), [metrics, sex]);

  const bmiLabel = bmi < 18.5 ? "underweight" : bmi < 25 ? "normalWeight" : bmi < 30 ? "overweight" : "obese";

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <svg viewBox="0 0 200 420" className="w-56 h-auto" style={{ maxHeight: "380px" }}>
              <rect width="200" height="420" fill="transparent" />
              <ellipse cx={paths.CX} cy="410" rx="35" ry="5" fill="rgba(0,0,0,0.1)" />

              <defs>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5D0A9" />
                  <stop offset="50%" stopColor="#E8C49A" />
                  <stop offset="100%" stopColor="#D4A574" />
                </linearGradient>
              </defs>

              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.path d={paths.leftLeg} fill="url(#bodyGrad)" stroke="#C4956A" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
                <motion.path d={paths.rightLeg} fill="url(#bodyGrad)" stroke="#C4956A" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.35 }} />
                <motion.path d={paths.leftArm} fill="url(#bodyGrad)" stroke="#C4956A" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.1 }} />
                <motion.path d={paths.rightArm} fill="url(#bodyGrad)" stroke="#C4956A" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.15 }} />
                <motion.path d={paths.torsoPath} fill="url(#bodyGrad)" stroke="#C4956A" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
                <motion.path d={paths.neckPath} fill="url(#bodyGrad)" stroke="#C4956A" strokeWidth="1"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.4 }} />
                <motion.path d={paths.headPath} fill="url(#bodyGrad)" stroke="#C4956A" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} />

                <motion.circle cx={paths.CX - paths.eyeSpacing} cy={paths.eyeY} r="2.5" fill="#333"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
                <motion.circle cx={paths.CX + paths.eyeSpacing} cy={paths.eyeY} r="2.5" fill="#333"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }} />
                <motion.path d={`M ${paths.CX - 5} ${paths.mouthY} Q ${paths.CX} ${paths.mouthY + 5} ${paths.CX + 5} ${paths.mouthY}`}
                  fill="none" stroke="#333" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.05 }} />

                {metrics.waist > 0 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.2 }}>
                    <line x1="15" y1="185" x2="35" y2="185" stroke="#666" strokeWidth="0.8" strokeDasharray="3" />
                    <text x="4" y="190" fontSize="7" fill="#666" fontFamily="sans-serif">{metrics.waist}</text>
                  </motion.g>
                )}
                {metrics.chest > 0 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.3 }}>
                    <line x1="165" y1="150" x2="185" y2="150" stroke="#666" strokeWidth="0.8" strokeDasharray="3" />
                    <text x="168" y="145" fontSize="7" fill="#666" fontFamily="sans-serif">{metrics.chest}</text>
                  </motion.g>
                )}
                {metrics.hip > 0 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.4 }}>
                    <line x1="15" y1="238" x2="35" y2="238" stroke="#666" strokeWidth="0.8" strokeDasharray="3" />
                    <text x="4" y="243" fontSize="7" fill="#666" fontFamily="sans-serif">{metrics.hip}</text>
                  </motion.g>
                )}
                {metrics.bicep > 0 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.5 }}>
                    <line x1="165" y1="200" x2="185" y2="200" stroke="#666" strokeWidth="0.8" strokeDasharray="3" />
                    <text x="168" y="195" fontSize="7" fill="#666" fontFamily="sans-serif">{metrics.bicep}</text>
                  </motion.g>
                )}
              </motion.g>
            </svg>
          </div>

          <div className="text-center mt-4">
            <div className="text-2xl font-bold text-primary">{bmi.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">
              {t("body.bmi")} &bull; {t(`body.${bmiLabel}`)}
            </div>
          </div>
        </CardContent>
      </Card>

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
              <div className="text-lg font-bold">{metrics.bodyFatPercent}{t("units.percent")}</div>
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
