# StockFolio UI

StockFolio is a modern fintech dashboard application designed to provide users with a seamless experience in managing their stock portfolios. This project implements a consistent design system, utilizing a global design token system and reusable components to ensure a cohesive user interface.

## Features

- **Global Design Tokens**: A comprehensive design token system that includes color palettes, spacing, typography, border radius, and shadows for consistent styling across the application.
- **Lucide SVG Icons**: Replaces emoji icons with Lucide SVG icons for a more professional and modern look.
- **Reusable Components**: Includes various reusable components such as:
  - **Stat Card**: Displays key statistics in a visually appealing format.
  - **Chart Card**: Presents data visualizations in a card format.
  - **Empty State**: Provides a user-friendly message when there is no data to display.
  - **Sidebar Item**: Represents individual items in the sidebar navigation.

## Project Structure

```
stockfolio-ui
├── src
│   ├── app
│   │   ├── core
│   │   │   ├── design-tokens
│   │   │   └── icons
│   │   ├── shared
│   │   │   └── components
│   │   ├── layout
│   │   ├── features
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── styles
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

To get started with the StockFolio UI project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd stockfolio-ui
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Run the application:
   ```
   ng serve
   ```

5. Open your browser and navigate to `http://localhost:4200`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.