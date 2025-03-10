import { BudgetNode, APIResponse } from "../types/budget";
import { transformCOFOGData } from "./process";

const EUROSTAT_BASE_URL =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";
const DATASET_ID = "gov_10a_exp"; // Government expenditure by function
const COUNTRY = "DE"; // Germany
const UNIT = "MIO_EUR"; // Millions of euros

interface EurostatResponse {
  value: { [key: string]: number };
  dimension: {
    cofog99: { category: { label: { [key: string]: string } } };
    time: { category: { label: { [key: string]: string } } };
  };
}

interface CategoryMap {
  name: string;
  category: string;
}

const categoryMapping: Record<string, CategoryMap> = {
  GF01: { name: "General Administration", category: "General Administration" },
  GF02: { name: "Defense", category: "Public Services" },
  GF03: { name: "Public Order and Safety", category: "Public Services" },
  GF04: { name: "Economic Affairs", category: "Economic Activities" },
  GF05: { name: "Environmental Protection", category: "Economic Activities" },
  GF06: { name: "Housing and Community", category: "Economic Activities" },
  GF07: { name: "Health", category: "Social Spending" },
  GF08: {
    name: "Recreation, Culture and Religion",
    category: "Social Spending",
  },
  GF09: { name: "Education", category: "Social Spending" },
  GF10: { name: "Social Protection", category: "Social Spending" },
};

async function fetchEurostatData(year: number): Promise<EurostatResponse> {
  const url = `${EUROSTAT_BASE_URL}/${DATASET_ID}?format=JSON&lang=en&geo=${COUNTRY}&unit=${UNIT}&time=${year}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.json();
}

function transformEurostatData(data: EurostatResponse): BudgetNode {
  console.log("Data:", data);
  const categories: Record<string, BudgetNode[]> = {};
  const values = data.value;
  const cofogLabels = data.dimension.cofog99.category.label;
  const year = Object.keys(data.dimension.time.category.label)[0];

  // Initialize categories
  const uniqueCategories = Array.from(
    new Set(Object.values(categoryMapping).map((m) => m.category))
  );
  uniqueCategories.forEach((category) => {
    categories[category] = [];
  });

  console.log({ values });

  // Process each COFOG code and its value
  Object.entries(cofogLabels).forEach(([code, _]) => {
    const value = values[code];
    const mapping = categoryMapping[code];

    console.log({ code, value, mapping });

    if (mapping && value) {
      const category = mapping.category;
      categories[category].push({
        name: mapping.name,
        value: Math.round(value), // Round to nearest million
      });
    }
  });

  // Create the final tree structure
  return {
    name: `German Government Expenditure ${year}`,
    children: Object.entries(categories).map(([category, items]) => ({
      name: category,
      children: items,
    })),
  };
}

/**
 * Fetches budget data from local JSON file
 * @param year The year to fetch data for (not used with local data)
 * @returns An API response object with the budget data
 */
export async function fetchBudgetData(
  year: number = 2023
): Promise<APIResponse> {
  try {
    // Fetch the local JSON file
    console.log(`Fetching budget data for year ${year}`);

    const response = await fetch("/data.json");

    if (!response.ok) {
      throw new Error(`Failed to load data file: ${response.statusText}`);
    }

    // Parse JSON data
    const data = await response.json();
    const transformedData = transformCOFOGData(data);
    console.log({ transformedData });
    // Update the year in the data
    data.name = `German Government Expenditure ${year}`;

    return {
      status: "success",
      data: transformedData[0],
    };
  } catch (error) {
    console.error("Error loading budget data:", error);
    return {
      status: "error",
      error: "Failed to load data",
    };
  }
}
