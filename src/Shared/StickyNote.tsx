import { X, Eraser, Move } from "lucide-react";
import { useStickyNoteStore } from "../store/super-admin/useStickyNote";
import { useState, useEffect, useRef } from "react";

const StickyNote = () => {
  const { isVisible, hide, content, setContent } = useStickyNoteStore();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement | null>(null);

  // Initialize position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem("stickyNotePosition");
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else {
      setPosition({
        x: window.innerWidth - 300,
        y: window.innerHeight - 250,
      });
    }
  }, []);

  // Save position changes
  useEffect(() => {
    if (position.x !== 0 && position.y !== 0) {
      localStorage.setItem("stickyNotePosition", JSON.stringify(position));
    }
  }, [position]);

  // Common move handler
  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !noteRef.current) return;

    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;
    const maxX = window.innerWidth - noteRef.current.offsetWidth;
    const maxY = window.innerHeight - noteRef.current.offsetHeight;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = noteRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = noteRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // Event listeners setup
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
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
        touchAction: "none",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div
          className="flex items-center gap-1 cursor-grab text-gray-700 flex-1"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
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
