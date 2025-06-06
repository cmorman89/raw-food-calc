import { methods } from "../assets/methods";
import { products } from "../assets/products";
import type { ItemComposition } from "../types/products";

export type CalculationInput = {
  weight: number;
  method: string;
  age: string;
  unit: "imperial" | "metric";
  percentage?: number;
};

export type CalculationResult = {
  totalAmount: number;
  breakdown: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  suggestedProducts: {
    [key: string]: Array<{
      name: string;
      weight: number;
      matchScore: number;
    }>;
  };
};

// Define valid component names and their categories
type MeatComponent = "MuscleMeat" | "BoneyMeat" | "Liver" | "LiverMeat" | "OrganMeat";
type PlantComponent = "Veggie" | "Fruit" | "Seeds";
type ComponentName = MeatComponent | PlantComponent;
type ComponentCategory = keyof ItemComposition;

const componentToCategory: Record<MeatComponent, ComponentCategory> = {
  MuscleMeat: "meat",
  BoneyMeat: "bone",
  Liver: "organ",
  LiverMeat: "organ",
  OrganMeat: "organ",
};

type Product = {
  name: string;
  weight: number;
  composition: {
    meat: number;
    bone: number;
    organ: number;
  };
};

export function calculateDogFood(input: CalculationInput): CalculationResult {
  const {
    weight,
    method,
    age,
    unit,
    percentage = 2.5, // Default to 2.5% of body weight
  } = input;

  // Convert weight to kg if in imperial
  const weightInKg = unit === "imperial" ? weight / 2.2 : weight;

  // Get the selected method configuration
  const methodConfig = methods[method]?.[age];
  if (!methodConfig) {
    throw new Error("Invalid method or age selected");
  }

  // Calculate total daily food amount in kg
  const foodWeightKG = weightInKg * (percentage / 100);

  // Calculate breakdown by component
  const breakdown = Object.entries(methodConfig).map(([name, percentage]) => {
    const amountInKg = foodWeightKG * (percentage / 100);
    // Convert amount to oz if imperial
    const amount = unit === "imperial" ? amountInKg * 35.274 : amountInKg;
    
    return {
      name: name as ComponentName,
      amount,
      percentage,
    };
  });

  // Find matching products for each component (excluding Veggie, Fruit, Seeds)
  const suggestedProducts: CalculationResult["suggestedProducts"] = {};
  for (const component of breakdown) {
    if (component.name in componentToCategory) {
      const matches = findMatchingProducts(component.name as MeatComponent, component.amount);
      if (matches.length > 0) {
        suggestedProducts[component.name] = matches;
      }
    }
  }

  // Convert total amount to oz if imperial
  const totalAmount = unit === "imperial" ? foodWeightKG * 35.274 : foodWeightKG;

  return {
    totalAmount,
    breakdown,
    suggestedProducts,
  };
}

function findMatchingProducts(componentName: MeatComponent, requiredWeight: number): Array<{ name: string; weight: number; matchScore: number }> {
  const category = componentToCategory[componentName];
  if (!category) return [];

  // Get all products from all animal types
  const allProducts = Object.entries(products).flatMap(([animalType, items]) =>
    Object.entries(items).map(([name, data]) => ({
      name,
      animalType,
      ...data,
    }))
  );

  // Calculate match score for each product
  const scoredProducts = allProducts
    .map((product) => {
      const composition = product.composition[category];
      if (!composition) return null;
      
      // Calculate the actual contribution of this product to the required component
      const effectiveWeight = (product.weight * composition) / 100;
      
      // Calculate match score based on:
      // 1. How close the effective weight is to required weight (80-120% range)
      // 2. The composition percentage of the required category
      const weightRatio = effectiveWeight / requiredWeight;
      const weightScore = weightRatio >= 0.8 && weightRatio <= 1.2 ? 1 : 0.5;
      const compositionScore = composition / 100;
      const matchScore = weightScore * compositionScore;

      return {
        name: product.name,
        weight: product.weight,
        matchScore,
      };
    })
    .filter((product): product is NonNullable<typeof product> => product !== null)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3); // Return top 3 matches

  return scoredProducts;
} 