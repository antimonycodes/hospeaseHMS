import { create } from "zustand";

interface Step {
  selector: string;
  message: string;
  path: string;
}

interface TourState {
  currentStep: number;
  run: boolean;
  steps: Step[];
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
}

export const useTourStore = create<TourState>((set, get) => ({
  currentStep: 0,
  run: false,
  steps: [
    {
      selector: ".overview-section",
      message:
        "Welcome to the dashboard! Here you can see hospital-wide stats.",
      path: "/dashboard/overview",
    },
    {
      selector: ".branch-tab",
      message: "Add one or more branches. This is mandatory to proceed.",
      path: "/dashboard/branch",
    },
    {
      selector: ".clinical-tab",
      message:
        "Set up clinical departments. These are used in patient registration and staff shifts.",
      path: "/dashboard/clinical-department",
    },
    {
      selector: ".front-desk-tab",
      message: "Start by adding front desk staff here.",
      path: "/dashboard/front-desk",
    },
    {
      selector: ".staff-toggle-tip",
      message: "Toggle staff access on or off from here.",
      path: "/dashboard/front-desk",
    },
  ],
  startTour: () => {
    console.log("🚀 Starting tour");
    set({ currentStep: 0, run: true });
  },
  nextStep: () => {
    const { currentStep, steps } = get();
    const next = currentStep + 1;
    if (next < steps.length) {
      console.log("➡️ Moving to step:", next);
      set({ currentStep: next });
    } else {
      console.log("✅ Tour complete");
      set({ run: false });
    }
  },
  prevStep: () => {
    const { currentStep } = get();
    const prev = currentStep - 1;
    if (prev >= 0) {
      console.log("⬅️ Moving back to step:", prev);
      set({ currentStep: prev });
    }
  },
  endTour: () => {
    console.log("🛑 Ending tour");
    set({ run: false });
  },
}));
