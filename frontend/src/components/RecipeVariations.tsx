import { useState, useEffect } from "react";
import type { CalculationResult } from "../lib/calculator";
import Cookies from "js-cookie";
import { parseComponentName } from "../lib/stringUtils";

type RecipeVariationsProps = {
  result: CalculationResult;
  selectedProducts: Array<{
    name: string;
    weight: number;
    composition: {
      meat: number;
      bone: number;
      organ: number;
    };
  }>;
  unit: string;
  convertWeight: (weightInOz: number) => string;
};

type Recipe = {
  [componentName: string]: {
    name: string;
    weight: number;
    percentage: number;
    composition: {
      meat: number;
      bone: number;
      organ: number;
    };
  };
};

type SavedFavorite = {
  recipe: Recipe;
  date: string;
  name: string;
};

export const RecipeVariations = ({
  result,
  selectedProducts,
  unit,
  convertWeight,
}: RecipeVariationsProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [favorites, setFavorites] = useState<SavedFavorite[]>([]);

  useEffect(() => {
    // Load favorites from cookies
    const savedFavorites = Cookies.get("recipeFavorites");
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (e) {
        console.error("Error parsing saved favorites:", e);
        setFavorites([]);
      }
    }
    if (result && selectedProducts.length > 0) {
      generateRecipeVariations();
    }
  }, [selectedProducts, result]);

  const generateRecipeVariations = () => {
    const variations: Recipe[] = [];
    const componentProducts = new Map<string, typeof selectedProducts>();
    const seenRecipes = new Set<string>();

    // Group products by their composition type
    selectedProducts.forEach((product) => {
      const { composition } = product;
      if (composition.meat > 0) {
        const products = componentProducts.get("MuscleMeat") || [];
        componentProducts.set("MuscleMeat", [...products, product]);
      }
      if (composition.bone > 0) {
        const products = componentProducts.get("BoneyMeat") || [];
        componentProducts.set("BoneyMeat", [...products, product]);
      }
      if (composition.organ > 0) {
        const products = componentProducts.get("OrganMeat") || [];
        componentProducts.set("OrganMeat", [...products, product]);
      }
    });

    // Generate variations for each component
    const generateVariations = (
      componentName: string,
      products: typeof selectedProducts,
      count: number = 5
    ) => {
      const variations: Recipe[] = [];
      const componentPercentage =
        result.breakdown.find((b) => b.name === componentName)?.percentage || 0;
      const componentAmount = result.totalAmount * (componentPercentage / 100);

      // Try different combinations of products
      for (let i = 0; i < count; i++) {
        const recipe: Recipe = {};
        const availableProducts = [...products];

        // Randomly select products for this component
        while (availableProducts.length > 0 && !recipe[componentName]) {
          const randomIndex = Math.floor(
            Math.random() * availableProducts.length
          );
          const product = availableProducts[randomIndex];

          // Calculate the actual contribution of this product to the component
          let contributionPercentage = 0;
          switch (componentName) {
            case "MuscleMeat":
              contributionPercentage = product.composition.meat;
              break;
            case "BoneyMeat":
              contributionPercentage = product.composition.bone;
              break;
            case "OrganMeat":
              contributionPercentage = product.composition.organ;
              break;
          }

          // Calculate the adjusted weight based on the product's contribution
          const adjustedWeight =
            (componentAmount * 100) / contributionPercentage;

          recipe[componentName] = {
            name: product.name,
            weight: adjustedWeight,
            percentage: componentPercentage,
            composition: product.composition,
          };
          availableProducts.splice(randomIndex, 1);
        }

        if (Object.keys(recipe).length > 0) {
          variations.push(recipe);
        }
      }

      return variations;
    };

    // Generate variations for each component type
    componentProducts.forEach((products, componentName) => {
      const componentVariations = generateVariations(componentName, products);
      if (variations.length === 0) {
        variations.push(...componentVariations);
      } else {
        // Combine with existing variations
        const newVariations: Recipe[] = [];
        variations.forEach((variation) => {
          componentVariations.forEach((componentVariation) => {
            const newVariation = { ...variation, ...componentVariation };
            // Create a unique key for this recipe
            const recipeKey = Object.entries(newVariation)
              .map(([comp, details]) => `${comp}:${details.name}`)
              .sort()
              .join("|");

            // Only add if we haven't seen this combination before
            if (!seenRecipes.has(recipeKey)) {
              seenRecipes.add(recipeKey);
              newVariations.push(newVariation);
            }
          });
        });
        variations.splice(0, variations.length, ...newVariations);
      }
    });

    setRecipes(variations);
  };

  const nextRecipe = () => {
    setCurrentRecipeIndex((prev) => (prev + 1) % recipes.length);
  };

  const prevRecipe = () => {
    setCurrentRecipeIndex(
      (prev) => (prev - 1 + recipes.length) % recipes.length
    );
  };

  const toggleFavorite = () => {
    const currentRecipe = recipes[currentRecipeIndex];
    const recipeName = `Recipe ${currentRecipeIndex + 1}`;
    const newFavorite: SavedFavorite = {
      recipe: currentRecipe,
      date: new Date().toISOString(),
      name: recipeName,
    };

    const newFavorites = favorites.some(
      (f) => JSON.stringify(f.recipe) === JSON.stringify(currentRecipe)
    )
      ? favorites.filter(
          (f) => JSON.stringify(f.recipe) !== JSON.stringify(currentRecipe)
        )
      : [...favorites, newFavorite];

    setFavorites(newFavorites);
    Cookies.set("recipeFavorites", JSON.stringify(newFavorites), {
      expires: 365,
    });
  };

  const removeFavorite = (favorite: SavedFavorite) => {
    const newFavorites = favorites.filter((f) => f !== favorite);
    setFavorites(newFavorites);
    Cookies.set("recipeFavorites", JSON.stringify(newFavorites), {
      expires: 365,
    });
  };

  const isCurrentRecipeFavorite = () => {
    return favorites.some(
      (f) =>
        JSON.stringify(f.recipe) === JSON.stringify(recipes[currentRecipeIndex])
    );
  };



  const renderRecipe = (recipe: Recipe) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Recipe Details
        </h3>
        <div className="space-y-4">
          {Object.entries(recipe).map(([componentName, details]) => (
            <div
              key={componentName}
              className="border-b border-gray-200 dark:border-gray-700 pb-4"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-white">
                  {parseComponentName(componentName)}
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {convertWeight(details.weight)} ({details.percentage}%)
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-left flex justify-center items-center gap-2 ">
                  <p>{details.name}</p>
                  <p className="text-xs opacity-50 flex border rounded-full px-2 py-1 items-center gap-2 bg-gray-100 dark:bg-gray-700">
                    {componentName === "MuscleMeat" && (
                      <span>
                        Meat: {details.composition.meat}%
                      </span>
                    )}
                    {componentName === "BoneyMeat" && (
                      <span>
                        Bone: {details.composition.bone}%
                      </span>
                    )}
                    {componentName === "OrganMeat" && (
                      <span>
                        Organ: {details.composition.organ}%
                      </span>
                  )}
                </p>  
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (recipes.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recipe Variations
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevRecipe}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={nextRecipe}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Next
          </button>
          <button
            onClick={toggleFavorite}
            className={`px-4 py-2 rounded transition-colors ${
              isCurrentRecipeFavorite()
                ? "bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            }`}
          >
            {isCurrentRecipeFavorite() ? "★ Favorited" : "☆ Favorite"}
          </button>
        </div>
      </div>

      {renderRecipe(recipes[currentRecipeIndex])}

      {favorites.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Saved Favorites
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((favorite, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {favorite.name}
                  </h4>
                  <button
                    onClick={() => removeFavorite(favorite)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Saved on {new Date(favorite.date).toLocaleDateString()}
                </p>
                {renderRecipe(favorite.recipe)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
