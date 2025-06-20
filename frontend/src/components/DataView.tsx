import { products } from "../assets/products";
import { FoodTable } from "./FoodTable";
import { RecipeVariations } from "./RecipeVariations";
import type { CalculationResult } from "../lib/calculator";
import { useState, useEffect } from "react";
import { parseComponentName } from "../lib/stringUtils";

type DataViewProps = {
  result: CalculationResult | null;
  unit: string;
  weight: number;
  method: string;
  age: string;
  percentage: number;
};

export const DataView = ({
  result,
  unit,
  weight,
  method,
  age,
  percentage,
}: DataViewProps) => {
  const unitLabel = unit === "imperial" ? "oz" : "kg";
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({});
  const [filteredResult, setFilteredResult] =
    useState<CalculationResult | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [showPounds, setShowPounds] = useState(false);

  // Convert weight from oz to kg only when metric is selected
  const convertWeight = (weightInOz: number) => {
    if (unit === "imperial") {
      if (showPounds) {
        const pounds = Math.floor(weightInOz / 16);
        const ounces = weightInOz % 16;
        return pounds > 0
          ? `${pounds}lb ${ounces.toFixed(1)}oz`
          : `${ounces.toFixed(1)}oz`;
      }
      return weightInOz.toFixed(1) + "oz";
    }
    return (weightInOz / 35.274).toFixed(2) + "kg";
  };

  const handleSelectionChange = (
    category: string,
    selections: { [key: string]: boolean }
  ) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [category]: selections,
    }));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Get all selected products across all categories
  const getAllSelectedProducts = () => {
    return Object.entries(selectedProducts).reduce(
      (acc, [category, selections]) => {
        Object.entries(selections).forEach(([productName, isSelected]) => {
          if (isSelected) {
            acc.push({
              name: productName,
              ...products[category][productName],
            });
          }
        });
        return acc;
      },
      [] as Array<{
        name: string;
        weight: number;
        composition: { meat: number; bone: number; organ: number };
      }>
    );
  };

  // Recalculate whenever selection changes
  useEffect(() => {
    if (result) {
      const selectedProductsList = getAllSelectedProducts();
      const filteredSuggestions = { ...result.suggestedProducts };

      // Filter suggestions for each component
      Object.keys(filteredSuggestions).forEach((componentName) => {
        filteredSuggestions[componentName] = filteredSuggestions[
          componentName
        ].filter((product) =>
          selectedProductsList.some(
            (selected) => selected.name === product.name
          )
        );
      });

      setFilteredResult({
        ...result,
        suggestedProducts: filteredSuggestions,
      });
    }
  }, [result, selectedProducts]);

  return (
    <div className="w-full max-w-4xl mt-8">
      {/* Calculation Results */}
      {filteredResult && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Daily Food Requirements
              </h2>
              {unit === "imperial" && (
                <button
                  onClick={() => setShowPounds(!showPounds)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
                >
                  {showPounds ? "Show in Ounces" : "Show in Pounds"}
                </button>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Total Amount
              </h3>
              <p className="text-lg text-gray-800 dark:text-gray-200">
                {convertWeight(filteredResult.totalAmount)}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Breakdown by Component
              </h3>
              <div className="space-y-4">
                {filteredResult.breakdown.map((component) => (
                  <div
                    key={component.name}
                    className="border-b border-gray-200 dark:border-gray-700 pb-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {parseComponentName(component.name)}
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {convertWeight(component.amount)} (
                        {component.percentage}%)
                      </span>
                    </div>
                    {filteredResult.suggestedProducts[component.name] &&
                      filteredResult.suggestedProducts[component.name].length >
                        0 && (
                        <div className="mt-2 pl-4 text-sm text-gray-600 dark:text-gray-400">
                          <p className="font-medium mb-1">
                            Available Products:
                          </p>
                          <ul className="list-disc pl-4">
                            {filteredResult.suggestedProducts[
                              component.name
                            ].map((product) => (
                              <li key={product.name}>
                                {product.name} -{" "}
                                {convertWeight(Number(product.weight))}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recipe Variations */}
          <RecipeVariations
            result={filteredResult}
            selectedProducts={getAllSelectedProducts()}
            unit={unit}
            convertWeight={convertWeight}
          />
        </>
      )}

      {/* Product Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Available Products
          </h2>
          {unit === "imperial" && (
            <button
              onClick={() => setShowPounds(!showPounds)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
            >
              {showPounds ? "Show in Ounces" : "Show in Pounds"}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full h-full">
          {Object.keys(products).map((product: string) => (
            <div
              key={product}
              className="border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md w-full"
            >
              <button
                onClick={() => toggleCategory(product)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl transition-colors"
              >
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {product.toUpperCase()}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {expandedCategories[product] ? "▼" : "▶"}
                </span>
              </button>
              {expandedCategories[product] && (
                <div className="flex flex-col p-4 pt-0 h-full">
                  <FoodTable
                    key={product}
                    foodItem={products[product]}
                    convertWeight={convertWeight}
                    unitLabel={unitLabel}
                    onSelectionChange={(selections) =>
                      handleSelectionChange(product, selections)
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
