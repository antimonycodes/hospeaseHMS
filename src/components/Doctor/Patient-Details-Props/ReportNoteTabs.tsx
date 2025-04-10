import { useState } from "react";
import { FileText, StickyNote } from "lucide-react";

export const ReportNoteTabs = ({
  activeTab,
  setActiveTab,
  note,
  setNote,
  reportNote,
  setReportNote,
  file,
  setFile,
  selectedDepartment,
  setSelectedDepartment,
  roles,
  handleNoteSubmit,
  handleReportSubmit,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  note: string;
  setNote: (value: string) => void;
  reportNote: string;
  setReportNote: (value: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  roles: any;
  handleNoteSubmit: () => void;
  handleReportSubmit: () => void;
}) => (
  <div className="bg-white rounded-lg custom-shadow mb-6 p-4 sm:p-6">
    <div className="flex gap-6 mb-4 text-sm font-medium text-[#667185]">
      <TabButton
        active={activeTab === "note"}
        onClick={() => setActiveTab("note")}
        icon={<StickyNote size={16} />}
        label="Add Doctor's Note"
      />
      <TabButton
        active={activeTab === "report"}
        onClick={() => setActiveTab("report")}
        icon={<FileText size={16} />}
        label="Add Doctor's Report"
      />
    </div>

    {activeTab === "note" ? (
      <NoteForm note={note} setNote={setNote} onSubmit={handleNoteSubmit} />
    ) : (
      <ReportForm
        reportNote={reportNote}
        setReportNote={setReportNote}
        file={file}
        setFile={setFile}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        roles={roles}
        onSubmit={handleReportSubmit}
      />
    )}
  </div>
);

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
      active ? "text-primary bg-[#F0F4FF]" : "hover:text-primary"
    }`}
    onClick={onClick}
  >
    {icon}
    {label}
  </button>
);

const NoteForm = ({ note, setNote, onSubmit }: any) => (
  <div className="space-y-4">
    <textarea
      rows={5}
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Enter doctor's note..."
      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
    />
    <button
      onClick={onSubmit}
      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
    >
      Add Note
    </button>
  </div>
);

const ReportForm = ({
  reportNote,
  setReportNote,
  file,
  setFile,
  selectedDepartment,
  setSelectedDepartment,
  roles,
  onSubmit,
}: any) => (
  <div className="space-y-4">
    <textarea
      rows={5}
      value={reportNote}
      onChange={(e) => setReportNote(e.target.value)}
      placeholder="Enter doctor's report..."
      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
    />
    <input
      type="file"
      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
    />
    <select
      value={selectedDepartment}
      onChange={(e) => setSelectedDepartment(e.target.value)}
      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
    >
      <option value="">Select a department</option>
      {roles && Object.keys(roles).length > 0 ? (
        <>
          {roles["pharmacist"] && <option value="pharmacist">Pharmacy</option>}
          {roles["laboratory"] && (
            <option value="laboratory">Laboratory</option>
          )}
        </>
      ) : (
        <option value="loading" disabled>
          Loading departments...
        </option>
      )}
    </select>
    <button
      onClick={onSubmit}
      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
    >
      Add Report
    </button>
  </div>
);
