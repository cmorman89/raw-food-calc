import { products } from "../assets/products";
import { FoodTable } from "./FoodTable";

export const DataView = () => {
  return (
    <div>
      <h1>DataView</h1>
      <div className="flex flex-col gap-2 w-full max-w-md">
        {/* Pass the sub-dictionary of products to the FoodTable component */}
        {Object.keys(products).map((product: string) => (
          <div
            key={product}
            className="border border-gray-300 rounded-xl p-2 bg-white shadow-md w-full"
          >
            <span className="text-lg font-bold">{product.toUpperCase()}</span>
            <FoodTable key={product} foodItem={products[product]} />
          </div>
        ))}
      </div>
    </div>
  );
};
