// labTestTypes.ts
import { ReactNode } from "react";

export type LabTestParameter = {
  name: string;
  unit: string;
  normalRange: string;
  type: string;
  options?: string[];
};

export type LabTest = {
  parameters: LabTestParameter[];
};

export type LabTestCategory = {
  icon: ReactNode;
  tests: {
    [testName: string]: LabTest;
  };
};

export type LabTestsType = {
  [category: string]: LabTestCategory;
};
