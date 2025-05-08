import { create } from "zustand";
import { persist } from "zustand/middleware";

type StickyNoteStore = {
  isVisible: boolean;
  content: string;
  position: { x: number; y: number };
  show: () => void;
  hide: () => void;
  setContent: (text: string) => void;
  setPosition: (position: { x: number; y: number }) => void;
};

export const useStickyNoteStore = create<StickyNoteStore>()(
  persist(
    (set) => ({
      isVisible: true,
      content: "",
      position: { x: 200, y: 200 },
      show: () => set({ isVisible: true }),
      hide: () => set({ isVisible: false }),
      setContent: (text) => set({ content: text }),
      setPosition: (position) => set({ position }),
    }),
    {
      name: "sticky-note-store",
    }
  )
);
