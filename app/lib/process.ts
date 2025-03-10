export interface BudgetNode {
  name: string;
  value?: number;
  children?: BudgetNode[];
  color?: string;
  category?: string;
}

export function transformCOFOGData(
  data: any,
  sectorFilter: string = "S13",
  geoFilter: string = "EU27_2020"
): BudgetNode[] {
  const { value, dimension } = data;
  const { sector, cofog99, na_item, geo } = dimension;

  // Index mappings
  const sectorIndex = sector.category.index[sectorFilter]; // S13 = 0
  const geoIndex = geo.category.index[geoFilter]; // EU27_2020 = 0
  const naItemIndex = na_item.category.index["TE"]; // TE = 31

  // COFOG category labels
  const cofogLabels = cofog99.category.label;

  // Strides
  const sizes = data.size; // [1, 1, 5, 80, 32, 33, 1]
  const strides = {
    freq: sizes[6] * sizes[5] * sizes[4] * sizes[3] * sizes[2] * sizes[1],
    unit: sizes[6] * sizes[5] * sizes[4] * sizes[3] * sizes[2],
    sector: sizes[6] * sizes[5] * sizes[4] * sizes[3],
    cofog99: sizes[6] * sizes[5] * sizes[4],
    na_item: sizes[6] * sizes[5],
    geo: sizes[6],
    time: 1,
  };

  // Filter values
  const filteredValues: { [key: string]: number } = {};
  for (const key in value) {
    const index = parseInt(key);
    const cofogIdx = Math.floor(index / strides.cofog99) % sizes[3];

    const cofogKey = Object.keys(cofog99.category.index)[cofogIdx];
    filteredValues[cofogKey] = value[key];
  }

  // Build the tree
  const budgetTree: BudgetNode[] = [];
  for (let i = 1; i <= 10; i++) {
    const mainCategoryCode = `GF${i.toString().padStart(2, "0")}`;
    const mainCategoryValue = filteredValues[mainCategoryCode] || 0;
    const mainCategoryLabel = cofogLabels[mainCategoryCode];

    const children: BudgetNode[] = [];
    for (let j = 1; j <= (i === 10 ? 9 : 8); j++) {
      const subCategoryCode = `${mainCategoryCode}${j
        .toString()
        .padStart(2, "0")}`;
      if (cofogLabels[subCategoryCode]) {
        const subCategoryValue = filteredValues[subCategoryCode] || 0;
        children.push({
          name: cofogLabels[subCategoryCode],
          value: subCategoryValue,
          category: subCategoryCode,
        });
      }
    }

    budgetTree.push({
      name: mainCategoryLabel,
      value: mainCategoryValue,
      children: children.length > 0 ? children : undefined,
      category: mainCategoryCode,
    });
  }

  const totalNode: BudgetNode = {
    name: "Total General Government Expenditure",
    value: filteredValues["TOTAL"] || 0,
    children: budgetTree,
    category: "TOTAL",
  };
  console.log({ totalNode });

  return [totalNode];
}
