# German Government Expenditure Visualization

This application provides an interactive visualization of German Government Expenditure data using an advanced D3.js treemap. The visualization helps users understand how government funds are allocated across different sectors and categories.

## Features

- **Interactive Treemap Visualization**: View government expenditure data in a hierarchical treemap layout
- **Year Selection**: Select expenditure data from different years (2019-2023)
- **Intelligent Rendering**:
  - Zero value items are automatically filtered out
  - Each category is displayed with distinct colors
  - Element-specific coloring for better differentiation
  - Adaptive text sizing and truncation for optimal readability
  - Text that properly fits within each box, with multi-line support for larger boxes
- **Tooltips**: Hover over any section to see detailed information

## Data Source

Data is sourced from Eurostat - Government Expenditure by Function (COFOG).

## Technical Implementation

The application is built with:

- **Next.js**: React framework for the frontend
- **D3.js**: For creating the advanced treemap visualization
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling components

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

The main visualization component is the Treemap, which handles:

- Hierarchical data processing
- Layout calculation and rendering
- Adaptive text sizing and positioning
- Custom coloring schemes

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [D3.js Documentation](https://d3js.org/) - learn about D3.js data visualization.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
