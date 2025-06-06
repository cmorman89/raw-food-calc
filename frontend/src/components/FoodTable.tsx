import type { Item } from "../types/products";
import { useState } from "react";

type FoodTableProps = {
  foodItem: Item;
  convertWeight: (weightInOz: number) => string;
  unitLabel: string;
  onSelectionChange: (selectedProducts: { [key: string]: boolean }) => void;
};

export const FoodTable = ({ foodItem, convertWeight, unitLabel, onSelectionChange }: FoodTableProps) => {
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: boolean }>({});

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
    <div className="overflow-x-auto">
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSelectAll}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Select All
        </button>
        <button
          onClick={handleDeselectAll}
          className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Deselect All
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Select
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Weight ({unitLabel})
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Meat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Organ
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(foodItem).map(([name, data]) => (
            <tr key={name}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedProducts[name] || false}
                  onChange={(e) => handleProductSelect(name, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {convertWeight(data.weight)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {data.composition.meat}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {data.composition.bone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {data.composition.organ}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
