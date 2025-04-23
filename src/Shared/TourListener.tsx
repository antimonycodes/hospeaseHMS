import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTourStore } from "../store/super-admin/useTourStore";
// import { useTourStore } from "../store/useTourStore";

const TourListener = () => {
  const { currentStep, steps, run } = useTourStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!run) return;

    const step = steps[currentStep];
    if (!step) return;

    console.log("🧭 Tour step changed:", step);

    // Navigate only if path is different
    if (step.path !== location.pathname) {
      console.log("📍 Navigating to:", step.path);
      navigate(step.path);
    }

    // Wait a bit before checking if element exists (DOM may not render instantly)
    const timer = setTimeout(() => {
      const el = document.querySelector(step.selector);
      if (el) {
        console.log("✅ Found element for step:", el);
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        console.warn("❌ Element not found:", step.selector);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [currentStep, run, steps, navigate, location.pathname]);

  return null;
};

export default TourListener;
