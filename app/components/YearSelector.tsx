import React from "react";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onYearChange,
  minYear = 2019,
  maxYear = 2023,
}) => {
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  return (
    <div className="flex items-center gap-4 mb-4">
      <label htmlFor="year-select" className="text-gray-700 font-medium">
        Select Year:
      </label>
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearSelector;
