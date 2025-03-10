import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { BudgetNode, CATEGORY_COLORS } from "../types/budget";

interface TreemapProps {
  data: BudgetNode;
  width?: number;
  height?: number;
}

// Define the d3 hierarchy node type to fix TypeScript errors
interface TreemapNode extends d3.HierarchyNode<BudgetNode> {
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
}

const Treemap: React.FC<TreemapProps> = ({
  data,
  width = 800,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear any existing content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create hierarchy
    const root = d3
      .hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Create treemap layout
    const treemap = d3
      .treemap<BudgetNode>()
      .size([width, height])
      .padding(1)
      .round(true);

    // Generate the treemap layout
    treemap(root as TreemapNode);

    // Filter out nodes with zero value
    const nonZeroLeaves = root
      .leaves()
      .filter((node) => node.value && node.value > 0);

    // Create a color scale for individual elements
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(nonZeroLeaves.map((d) => d.data.name))
      .range(d3.schemeCategory10);

    // Create group for each node
    const nodes = svg
      .selectAll("g")
      .data(nonZeroLeaves)
      .join("g")
      .attr(
        "transform",
        (d: TreemapNode) => `translate(${d.x0 || 0},${d.y0 || 0})`
      );

    // Add rectangles
    nodes
      .append("rect")
      .attr("width", (d: TreemapNode) => (d.x1 || 0) - (d.x0 || 0))
      .attr("height", (d: TreemapNode) => (d.y1 || 0) - (d.y0 || 0))
      .attr("fill", (d) => {
        // If we have a category, use the category color, otherwise use a unique color per item
        const category = d.parent?.data.name || "";
        if (CATEGORY_COLORS[category]) {
          return CATEGORY_COLORS[category];
        } else {
          return colorScale(d.data.name);
        }
      })
      .attr("stroke", "#fff");

    // Add text labels
    nodes
      .append("text")
      .attr("x", 3)
      .attr("y", (d: TreemapNode) =>
        Math.min(15, (d.y1 || 0) - (d.y0 || 0) - 5)
      )
      .text((d: TreemapNode) => {
        // Get the rectangle dimensions
        const width = (d.x1 || 0) - (d.x0 || 0);
        const height = (d.y1 || 0) - (d.y0 || 0);

        // Skip text if the box is too small
        if (width < 30 || height < 20) return "";

        const text = `${d.data.name}: €${d3.format(",.0f")(d.value || 0)}M`;

        // Calculate appropriate font size based on the rectangle size
        const fontSize = Math.max(8, Math.min(10, width / 20));

        // Truncate text if it's too long
        // Roughly estimate how many characters fit
        const charsPerWidth = width / (fontSize * 0.6); // Approximate character width

        if (text.length > charsPerWidth) {
          // If name is too long, truncate it
          const nameLength = Math.max(3, Math.floor(charsPerWidth * 0.7) - 10);
          const truncatedName =
            d.data.name.length > nameLength
              ? d.data.name.substring(0, nameLength) + "..."
              : d.data.name;
          return `${truncatedName}: €${d3.format(",.0f")(d.value || 0)}M`;
        }

        return text;
      })
      .attr("font-size", (d: TreemapNode) => {
        const width = (d.x1 || 0) - (d.x0 || 0);
        return `${Math.max(8, Math.min(10, width / 20))}px`;
      })
      .attr("fill", "black")
      // Add text wrapping for larger boxes
      .each(function (d: TreemapNode) {
        const width = (d.x1 || 0) - (d.x0 || 0);
        const height = (d.y1 || 0) - (d.y0 || 0);

        // For larger boxes, we can try to wrap the text into multiple lines
        if (width > 80 && height > 40) {
          const node = d3.select(this);
          const text = node.text();
          node.text(null); // Clear existing text

          // Split the text into name and value
          const parts = text.split(": €");
          if (parts.length === 2) {
            node.append("tspan").attr("x", 3).attr("y", 15).text(parts[0]);

            node
              .append("tspan")
              .attr("x", 3)
              .attr("y", 30)
              .text(`€${parts[1]}`);
          }
        }
      });

    // Add tooltips
    nodes.append("title").text(
      (d) =>
        `${d
          .ancestors()
          .reverse()
          .map((d) => d.data.name)
          .join("/")}\n€${d3.format(",.0f")(d.value || 0)}M`
    );
  }, [data, width, height]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};

export default Treemap;
