import { X, Eraser, Move } from "lucide-react";
import { useStickyNoteStore } from "../store/super-admin/useStickyNote";
import { useState, useEffect, useRef } from "react";

const StickyNote = () => {
  const { isVisible, hide, content, setContent } = useStickyNoteStore();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement | null>(null);

  // Initialize position from localStorage or default to bottom-right
  useEffect(() => {
    const savedPosition = localStorage.getItem("stickyNotePosition");
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else {
      // Default position at bottom-right
      setPosition({
        x: window.innerWidth - 300,
        y: window.innerHeight - 250,
      });
    }
  }, []);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (position.x !== 0 && position.y !== 0) {
      localStorage.setItem("stickyNotePosition", JSON.stringify(position));
    }
  }, [position]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: { clientX: number; clientY: number }) => {
    if (noteRef.current) {
      const rect = noteRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      if (isDragging) {
        // Calculate new position based on mouse position and drag offset
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Constrain to viewport
        const maxX = window.innerWidth - (noteRef.current?.offsetWidth || 264);
        const maxY =
          window.innerHeight - (noteRef.current?.offsetHeight || 200);

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!isVisible) return null;

  return (
    <div
      ref={noteRef}
      className="fixed p-4 bg-yellow-100 border border-yellow-300 rounded-2xl shadow-xl z-[999]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "264px",
        cursor: isDragging ? "grabbing" : "auto",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div
          className="flex items-center gap-1 cursor-grab text-gray-700 flex-1"
          onMouseDown={handleMouseDown}
        >
          <Move className="w-4 h-4" />
          <span className="text-sm font-semibold">Sticky Note</span>
        </div>
        <button
          onClick={hide}
          className="text-gray-500 hover:text-red-500 transition"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a quick note..."
        className="w-full h-32 resize-none border-none bg-transparent outline-none text-sm text-gray-800"
      />

      <div className="flex justify-end">
        <button
          onClick={() => setContent("")}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-400 mt-1 transition"
          title="Clear Note"
        >
          <Eraser className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>
    </div>
  );
};

export default StickyNote;
