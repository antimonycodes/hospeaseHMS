// labTestData.ts
import { Activity, Microscope, TestTube } from "lucide-react";
import { LabTestsType } from "./labTestTypes";

export const labTests: LabTestsType = {
  Hematology: {
    icon: <Activity className="h-5 w-5" />,
    tests: {
      "Complete Blood Count (CBC)": {
        parameters: [
          {
            name: "White Blood Cells (WBC)",
            unit: "cells/μL",
            normalRange: "4,000-11,000",
            type: "number",
          },
          {
            name: "Red Blood Cells (RBC)",
            unit: "cells/μL",
            normalRange: "4.5-5.5 million",
            type: "number",
          },
          {
            name: "Hemoglobin (Hgb)",
            unit: "g/dL",
            normalRange: "12-16",
            type: "number",
          },
          {
            name: "Hematocrit (Hct)",
            unit: "%",
            normalRange: "36-46",
            type: "number",
          },
          {
            name: "Platelets",
            unit: "cells/μL",
            normalRange: "150,000-450,000",
            type: "number",
          },
          {
            name: "Mean Corpuscular Volume (MCV)",
            unit: "fL",
            normalRange: "80-100",
            type: "number",
          },
        ],
      },
      "Erythrocyte Sedimentation Rate (ESR)": {
        parameters: [
          {
            name: "ESR",
            unit: "mm/hr",
            normalRange: "Men: 2-10, Women: 3-15",
            type: "number",
          },
        ],
      },
      "Bleeding Time": {
        parameters: [
          {
            name: "Bleeding Time",
            unit: "minutes",
            normalRange: "2-7",
            type: "number",
          },
          {
            name: "Clotting Time",
            unit: "minutes",
            normalRange: "3-8",
            type: "number",
          },
        ],
      },
    },
  },
  "Clinical Chemistry": {
    icon: <TestTube className="h-5 w-5" />,
    tests: {
      "Liver Function Tests (LFT)": {
        parameters: [
          {
            name: "ALT (SGPT)",
            unit: "U/L",
            normalRange: "7-56",
            type: "number",
          },
          {
            name: "AST (SGOT)",
            unit: "U/L",
            normalRange: "10-40",
            type: "number",
          },
          {
            name: "Alkaline Phosphatase",
            unit: "U/L",
            normalRange: "44-147",
            type: "number",
          },
          {
            name: "Total Bilirubin",
            unit: "mg/dL",
            normalRange: "0.3-1.2",
            type: "number",
          },
          {
            name: "Direct Bilirubin",
            unit: "mg/dL",
            normalRange: "0.1-0.3",
            type: "number",
          },
          {
            name: "Total Protein",
            unit: "g/dL",
            normalRange: "6.0-8.3",
            type: "number",
          },
          {
            name: "Albumin",
            unit: "g/dL",
            normalRange: "3.5-5.0",
            type: "number",
          },
        ],
      },
      "Kidney Function Tests (KFT)": {
        parameters: [
          {
            name: "Blood Urea Nitrogen (BUN)",
            unit: "mg/dL",
            normalRange: "7-20",
            type: "number",
          },
          {
            name: "Creatinine",
            unit: "mg/dL",
            normalRange: "0.7-1.3",
            type: "number",
          },
          {
            name: "Uric Acid",
            unit: "mg/dL",
            normalRange: "3.4-7.0",
            type: "number",
          },
          {
            name: "eGFR",
            unit: "mL/min/1.73m²",
            normalRange: ">60",
            type: "number",
          },
        ],
      },
      "Lipid Profile": {
        parameters: [
          {
            name: "Total Cholesterol",
            unit: "mg/dL",
            normalRange: "<200",
            type: "number",
          },
          {
            name: "HDL Cholesterol",
            unit: "mg/dL",
            normalRange: ">40 (M), >50 (F)",
            type: "number",
          },
          {
            name: "LDL Cholesterol",
            unit: "mg/dL",
            normalRange: "<100",
            type: "number",
          },
          {
            name: "Triglycerides",
            unit: "mg/dL",
            normalRange: "<150",
            type: "number",
          },
        ],
      },
      "Blood Glucose": {
        parameters: [
          {
            name: "Fasting Blood Sugar",
            unit: "mg/dL",
            normalRange: "70-100",
            type: "number",
          },
          {
            name: "Random Blood Sugar",
            unit: "mg/dL",
            normalRange: "<140",
            type: "number",
          },
          { name: "HbA1c", unit: "%", normalRange: "<5.7", type: "number" },
        ],
      },
    },
  },
  Serology: {
    icon: <Microscope className="h-5 w-5" />,
    tests: {
      "Widal Test": {
        parameters: [
          {
            name: "Salmonella Typhi O",
            unit: "Titre",
            normalRange: "<1:80",
            type: "text",
          },
          {
            name: "Salmonella Typhi H",
            unit: "Titre",
            normalRange: "<1:80",
            type: "text",
          },
          {
            name: "Salmonella Paratyphi A",
            unit: "Titre",
            normalRange: "<1:80",
            type: "text",
          },
          {
            name: "Salmonella Paratyphi B",
            unit: "Titre",
            normalRange: "<1:80",
            type: "text",
          },
        ],
      },
      "Hepatitis Panel": {
        parameters: [
          {
            name: "HBsAg",
            unit: "",
            normalRange: "Non-reactive",
            type: "select",
            options: ["Reactive", "Non-reactive"],
          },
          {
            name: "HCV Ab",
            unit: "",
            normalRange: "Non-reactive",
            type: "select",
            options: ["Reactive", "Non-reactive"],
          },
          {
            name: "HAV IgM",
            unit: "",
            normalRange: "Non-reactive",
            type: "select",
            options: ["Reactive", "Non-reactive"],
          },
        ],
      },
      "HIV Test": {
        parameters: [
          {
            name: "HIV 1 & 2",
            unit: "",
            normalRange: "Non-reactive",
            type: "select",
            options: ["Reactive", "Non-reactive"],
          },
        ],
      },
    },
  },
  Microbiology: {
    icon: <Activity className="h-5 w-5" />,
    tests: {
      "Urine Culture": {
        parameters: [
          {
            name: "Organism Isolated",
            unit: "",
            normalRange: "No growth",
            type: "text",
          },
          {
            name: "Colony Count",
            unit: "CFU/mL",
            normalRange: "<10^5",
            type: "text",
          },
          {
            name: "Sensitivity",
            unit: "",
            normalRange: "",
            type: "textarea",
          },
        ],
      },
      "Blood Culture": {
        parameters: [
          {
            name: "Organism Isolated",
            unit: "",
            normalRange: "No growth",
            type: "text",
          },
          {
            name: "Sensitivity",
            unit: "",
            normalRange: "",
            type: "textarea",
          },
        ],
      },
      "Stool Culture": {
        parameters: [
          {
            name: "Organism Isolated",
            unit: "",
            normalRange: "No pathogen",
            type: "text",
          },
          {
            name: "Parasites",
            unit: "",
            normalRange: "None seen",
            type: "text",
          },
          {
            name: "Ova/Cysts",
            unit: "",
            normalRange: "None seen",
            type: "text",
          },
        ],
      },
    },
  },
  Urinalysis: {
    icon: <TestTube className="h-5 w-5" />,
    tests: {
      "Routine Urine Examination": {
        parameters: [
          {
            name: "Color",
            unit: "",
            normalRange: "Pale yellow",
            type: "text",
          },
          {
            name: "Appearance",
            unit: "",
            normalRange: "Clear",
            type: "text",
          },
          {
            name: "Specific Gravity",
            unit: "",
            normalRange: "1.003-1.030",
            type: "number",
          },
          { name: "pH", unit: "", normalRange: "5.0-8.0", type: "number" },
          {
            name: "Protein",
            unit: "",
            normalRange: "Negative",
            type: "select",
            options: ["Negative", "Trace", "+", "++", "+++"],
          },
          {
            name: "Glucose",
            unit: "",
            normalRange: "Negative",
            type: "select",
            options: ["Negative", "Trace", "+", "++", "+++"],
          },
          {
            name: "Ketones",
            unit: "",
            normalRange: "Negative",
            type: "select",
            options: ["Negative", "Trace", "+", "++", "+++"],
          },
          {
            name: "Blood",
            unit: "",
            normalRange: "Negative",
            type: "select",
            options: ["Negative", "Trace", "+", "++", "+++"],
          },
          { name: "WBC", unit: "/hpf", normalRange: "0-5", type: "number" },
          { name: "RBC", unit: "/hpf", normalRange: "0-2", type: "number" },
          {
            name: "Epithelial Cells",
            unit: "/hpf",
            normalRange: "Few",
            type: "text",
          },
          { name: "Bacteria", unit: "", normalRange: "Few", type: "text" },
        ],
      },
    },
  },
};
