// TestSelectionPanel.tsx
import React from "react";
import { ChevronDown, ChevronRight, Search, TestTube } from "lucide-react";
import { LabTestsType } from "./labTestTypes";

interface TestSelectionPanelProps {
  labTests: LabTestsType;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  expandedCategories: Record<string, boolean>;
  toggleCategory: (category: string) => void;
  selectedTests: { [category: string]: string[] };
  handleTestSelect: (category: string, testName: string) => void;
}

const TestSelectionPanel: React.FC<TestSelectionPanelProps> = ({
  labTests,
  searchTerm,
  setSearchTerm,
  expandedCategories,
  toggleCategory,
  selectedTests,
  handleTestSelect,
}) => {
  const filteredTests = Object.entries(labTests).reduce(
    (acc: Record<string, any>, [category, categoryData]) => {
      const filteredCategoryTests = Object.entries(categoryData.tests).filter(
        ([testName]) =>
          testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredCategoryTests.length > 0) {
        acc[category] = {
          ...categoryData,
          tests: Object.fromEntries(filteredCategoryTests),
        };
      }
      return acc;
    },
    {} as Record<string, any>
  );

  return (
    <div className="xl:col-span-1">
      <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
        <div className="flex items-center mb-4">
          <TestTube className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Lab Tests</h2>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Test Categories */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {Object.entries(filteredTests).map(
            ([category, categoryData]: any) => (
              <div key={category} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    {categoryData.icon}
                    <span className="ml-2 font-medium text-gray-900">
                      {category}
                    </span>
                  </div>
                  {expandedCategories[category] ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>

                {expandedCategories[category] && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    {Object.entries(categoryData.tests).map(([testName]) => (
                      <button
                        key={testName}
                        onClick={() => handleTestSelect(category, testName)}
                        className={`w-full text-left p-3 text-sm hover:bg-white transition-colors duration-200 ${
                          selectedTests[category]?.includes(testName)
                            ? "bg-blue-50 text-blue-800 border-l-4 border-blue-500"
                            : "text-gray-700"
                        }`}
                      >
                        {testName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSelectionPanel;
