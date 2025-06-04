import type { Item } from "../types/products";

export const FoodTable = ({ foodItem }: { foodItem: Item }) => {
  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="max-w-1/2 m-1">Item</th>
            <th className="m-1 p-1">Weight</th>
            <th className="m-1 p-1">Meat</th>
            <th className="m-1 p-1">Bone</th>
            <th className="m-1 p-1">Organ</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(foodItem).map(([item, data]) => (
            <tr key={item} className="border-b border-gray-300">
              <td className="w-1/2 max-w-1/2 m-1">{item}</td>
              <td className="m-1 p-1">{data.weight}</td>
              <td className="m-1 p-1">{data.composition.meat}</td>
              <td className="m-1 p-1">{data.composition.bone}</td>
              <td className="m-1 p-1">{data.composition.organ}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
