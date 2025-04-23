// components/TourOverlay.tsx
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTourStore } from "../store/super-admin/useTourStore";

const TourOverlay = () => {
  const { steps, currentStep, run, nextStep, prevStep, endTour } =
    useTourStore();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!run) return;
    const step = steps[currentStep];
    navigate(step.path);

    let attempts = 0;

    const pollForElement = () => {
      const el = document.querySelector(step.selector) as HTMLElement;
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
        return;
      }

      if (attempts < 20) {
        attempts++;
        timeoutRef.current = setTimeout(pollForElement, 300);
      }
    };

    pollForElement();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [run, currentStep, steps, navigate]);

  if (!run || !targetRect) return null;

  return (
    <>
      {/* Dark overlay */}
      <div className=" inset-0  z-[9998]" />

      {/* Tour box */}
      <motion.div
        className=" bg-white z-[99] shadow-lg p-4 rounded-xl max-w-sm w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          top: targetRect.bottom + 10,
          left: targetRect.left,
        }}
      >
        <p className="text-sm text-gray-800">{steps[currentStep].message}</p>
        <div className="mt-4 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-xs text-gray-500"
          >
            Back
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="text-xs text-blue-600 font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={endTour}
              className="text-xs text-green-600 font-medium"
            >
              Finish
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default TourOverlay;
