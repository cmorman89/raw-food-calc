import { useState } from "react";
import { methods } from "./assets/methods";
import { DataView } from "./components/DataView";
import { calculateDogFood, type CalculationResult } from "./lib/calculator";
import { ThemeToggle } from "./components/ThemeToggle";
// import { products } from "./assets/products";
import "./App.css";
import { CompositionBar } from "./components/CompositionBar";

function App() {
  const [formData, setFormData] = useState({
    weight: 0,
    method: "",
    age: "",
    unit: "imperial",
    percentage: 2.5,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  type ChangeEvent =
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLSelectElement>;
  const handleChange = (e: ChangeEvent) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCalculate = () => {
    try {
      const calculationResult = calculateDogFood({
        weight: Number(formData.weight),
        method: formData.method,
        age: formData.age,
        unit: formData.unit as "imperial" | "metric",
        percentage: Number(formData.percentage),
      });
      setResult(calculationResult);
    } catch (error) {
      console.error("Calculation error:", error);
      // You might want to show an error message to the user here
    }
  };

  const getMethodNames = () => Object.keys(methods);
  const getAgeNames = () => ["Adult", "Puppy"];
  const getUnitNames = () => (formData.unit === "imperial" ? "lb" : "kg");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <ThemeToggle />
      <div className="flex flex-col gap-2 p-8 items-center">
        <h1 className="text-2xl font-bold">The Raw Dog Food Calculator</h1>
        <div className="input-group">
          <label htmlFor="weight" className="text-sm">
            Your dog's weight (in {getUnitNames()})
          </label>
          <input
            type="number"
            name="weight"
            placeholder={`Weight in ${getUnitNames()}`}
            value={formData.weight}
            onChange={handleChange}
            className="input bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="input-group">
          <label htmlFor="age" className="text-sm">
            Your dog's age
          </label>
          <select
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="input bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select age</option>
            {getAgeNames().map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="method" className="text-sm">
            Your dog's method of feeding
          </label>
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="input bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select method</option>
            {getMethodNames().map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="percentage" className="text-sm">
            Food percentage of body weight
          </label>
          <input
            type="number"
            name="percentage"
            placeholder="Percentage (e.g., 2.5)"
            value={formData.percentage}
            onChange={handleChange}
            className="input bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            step="0.1"
            min="1"
            max="10"
          />
        </div>
        <div className="input-group">
          <label htmlFor="unit" className="text-sm">
            Select Units:
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="input bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          >
            <option value="imperial">Pounds (lb)</option>
            <option value="metric">Kilograms (kg)</option>
          </select>
        </div>
        <button
          onClick={handleCalculate}
          className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors"
          disabled={!formData.weight || !formData.method || !formData.age}
        >
          Calculate
        </button>
        <DataView
          result={result}
          unit={formData.unit}
          weight={Number(formData.weight)}
          method={formData.method}
          age={formData.age}
          percentage={Number(formData.percentage)}
        />
      </div>
    </div>
  );
}

export default App;
