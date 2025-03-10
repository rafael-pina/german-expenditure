"use client";

import { useEffect, useState } from "react";
import { fetchBudgetData } from "./lib/api";
import { BudgetNode } from "./types/budget";
import Treemap from "./components/Treemap";
import YearSelector from "./components/YearSelector";

export default function Home() {
  const [data, setData] = useState<BudgetNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2023);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchBudgetData(selectedYear);
        if (response.status === "success" && response.data) {
          setData(response.data);
        } else {
          setError(response.error || "Failed to load data");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedYear]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">
        German Government Expenditure {selectedYear}
      </h1>

      <YearSelector
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        minYear={2019}
        maxYear={2023}
      />

      {loading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {data && (
        <div className="w-full max-w-6xl">
          <Treemap data={data} />
        </div>
      )}

      <footer className="mt-8 text-sm text-gray-500">
        Data source: Eurostat - Government Expenditure by Function (COFOG)
      </footer>
    </main>
  );
}
