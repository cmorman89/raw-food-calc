import type { Item } from "../types/products";
import { useState } from "react";
import { CompositionBar } from "./CompositionBar";

type FoodTableProps = {
  foodItem: Item;
  convertWeight: (weightInOz: number) => string;
  unitLabel: string;
  onSelectionChange: (selectedProducts: { [key: string]: boolean }) => void;
};

export const FoodTable = ({
  foodItem,
  convertWeight,
  unitLabel,
  onSelectionChange,
}: FoodTableProps) => {
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: boolean;
  }>({});

  const handleSelectAll = () => {
    const allSelected = Object.keys(foodItem).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setSelectedProducts(allSelected);
    onSelectionChange(allSelected);
  };

  const handleDeselectAll = () => {
    setSelectedProducts({});
    onSelectionChange({});
  };

  const handleProductSelect = (name: string, checked: boolean) => {
    const newSelection = { ...selectedProducts, [name]: checked };
    setSelectedProducts(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <div className=" flex flex-col h-full overflow-hidden max-h-[500px]">
      <div className="flex gap-2 mb-4 ">
        <button
          onClick={handleSelectAll}
          className="px-3 py-1 text-sm bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          Select All
        </button>
        <button
          onClick={handleDeselectAll}
          className="px-3 py-1 text-sm bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
        >
          Deselect All
        </button>
      </div>
      <div className="flex flex-col h-full w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="styledScrollbar overflow-x-auto overflow-y-auto h-full">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Weight ({unitLabel})
                </th>
                <th className="px-6 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Composition
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(foodItem).map(([name, data]) => (
                <tr
                  key={name}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts[name] || false}
                      onChange={(e) =>
                        handleProductSelect(name, e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {convertWeight(data.weight)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CompositionBar composition={data.composition} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
