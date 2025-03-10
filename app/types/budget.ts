export interface BudgetNode {
  name: string;
  value?: number;
  children?: BudgetNode[];
  color?: string;
  category?: string;
}

export interface APIResponse {
  status: string;
  data?: BudgetNode;
  error?: string;
}

export interface CategoryColors {
  [key: string]: string;
}

export const CATEGORY_COLORS: CategoryColors = {
  "Social Spending": "#E8DCC4", // Beige
  "Economic Activities": "#4B917D", // Green
  "Public Services": "#8B7AA9", // Purple
  "General Administration": "#B45B3E", // Red/Brown
};
