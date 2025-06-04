import { useState } from "react";
import { methods } from "./assets/methods";
import { DataView } from "./components/DataView";
// import { products } from "./assets/products";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    weight: 0,
    method: "",
    age: "",
    unit: "imperial",
  });

  type ChangeEvent =
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLSelectElement>;
  const handleChange = (e: ChangeEvent) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getMethodNames = () => Object.keys(methods);
  const getAgeNames = () => ["Adult", "Puppy"];
  const getUnitNames = () => (formData.unit === "imperial" ? "lb" : "kg");

  return (
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
          className="input"
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
          className="input"
        >
          {getAgeNames().map((age) => (
            <option key={age} value={age.toLowerCase()}>
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
          className="input"
        >
          {getMethodNames().map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <label htmlFor="unit" className="text-sm">
          Select Units:
        </label>
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="input"
        >
          <option value="imperial">Pounds (lb)</option>
          <option value="metric">Kilograms (kg)</option>
        </select>
      </div>
      <DataView />
    </div>
  );
}

export default App;
