import { useState, useEffect } from 'react';
import type { CalculationResult } from '../lib/calculator';
import Cookies from 'js-cookie';

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

export const RecipeVariations = ({ result, selectedProducts, unit, convertWeight }: RecipeVariationsProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [favorites, setFavorites] = useState<SavedFavorite[]>([]);

  useEffect(() => {
    // Load favorites from cookies
    const savedFavorites = Cookies.get('recipeFavorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (e) {
        console.error('Error parsing saved favorites:', e);
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
    selectedProducts.forEach(product => {
      const { composition } = product;
      if (composition.meat > 0) {
        const products = componentProducts.get('MuscleMeat') || [];
        componentProducts.set('MuscleMeat', [...products, product]);
      }
      if (composition.bone > 0) {
        const products = componentProducts.get('BoneyMeat') || [];
        componentProducts.set('BoneyMeat', [...products, product]);
      }
      if (composition.organ > 0) {
        const products = componentProducts.get('OrganMeat') || [];
        componentProducts.set('OrganMeat', [...products, product]);
      }
    });

    // Generate variations for each component
    const generateVariations = (componentName: string, products: typeof selectedProducts, count: number = 5) => {
      const variations: Recipe[] = [];
      const componentPercentage = result.breakdown.find(b => b.name === componentName)?.percentage || 0;
      const componentAmount = result.totalAmount * (componentPercentage / 100);

      // Try different combinations of products
      for (let i = 0; i < count; i++) {
        const recipe: Recipe = {};
        const availableProducts = [...products];
        
        // Randomly select products for this component
        while (availableProducts.length > 0 && !recipe[componentName]) {
          const randomIndex = Math.floor(Math.random() * availableProducts.length);
          const product = availableProducts[randomIndex];
          
          // Calculate the actual contribution of this product to the component
          let contributionPercentage = 0;
          switch (componentName) {
            case 'MuscleMeat':
              contributionPercentage = product.composition.meat;
              break;
            case 'BoneyMeat':
              contributionPercentage = product.composition.bone;
              break;
            case 'OrganMeat':
              contributionPercentage = product.composition.organ;
              break;
          }

          // Calculate the adjusted weight based on the product's contribution
          const adjustedWeight = (componentAmount * 100) / contributionPercentage;

          recipe[componentName] = {
            name: product.name,
            weight: adjustedWeight,
            percentage: componentPercentage,
            composition: product.composition
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
        variations.forEach(variation => {
          componentVariations.forEach(componentVariation => {
            const newVariation = { ...variation, ...componentVariation };
            // Create a unique key for this recipe
            const recipeKey = Object.entries(newVariation)
              .map(([comp, details]) => `${comp}:${details.name}`)
              .sort()
              .join('|');
            
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
    setCurrentRecipeIndex((prev) => (prev - 1 + recipes.length) % recipes.length);
  };

  const toggleFavorite = () => {
    const currentRecipe = recipes[currentRecipeIndex];
    const recipeName = `Recipe ${currentRecipeIndex + 1}`;
    const newFavorite: SavedFavorite = {
      recipe: currentRecipe,
      date: new Date().toISOString(),
      name: recipeName
    };

    const newFavorites = favorites.some(f => 
      JSON.stringify(f.recipe) === JSON.stringify(currentRecipe)
    )
      ? favorites.filter(f => JSON.stringify(f.recipe) !== JSON.stringify(currentRecipe))
      : [...favorites, newFavorite];

    setFavorites(newFavorites);
    Cookies.set('recipeFavorites', JSON.stringify(newFavorites), { expires: 365 });
  };

  const removeFavorite = (favorite: SavedFavorite) => {
    const newFavorites = favorites.filter(f => f !== favorite);
    setFavorites(newFavorites);
    Cookies.set('recipeFavorites', JSON.stringify(newFavorites), { expires: 365 });
  };

  const isCurrentRecipeFavorite = () => {
    return favorites.some(f => 
      JSON.stringify(f.recipe) === JSON.stringify(recipes[currentRecipeIndex])
    );
  };

  const renderRecipe = (recipe: Recipe) => {
    if (!recipe) return null;
    
    return (
      <div className="space-y-4">
        {Object.entries(recipe).map(([componentName, details]) => {
          const composition = details.composition;
          const totalPercentage = composition.meat + composition.bone + composition.organ;
          
          // Calculate the actual contribution to each component
          const meatContribution = (details.weight * composition.meat) / 100;
          const boneContribution = (details.weight * composition.bone) / 100;
          const organContribution = (details.weight * composition.organ) / 100;

          return (
            <div key={componentName} className="border-b pb-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{componentName}</span>
                <span>
                  {convertWeight(details.weight)} {unit === "imperial" ? "oz" : "kg"} ({details.percentage}%)
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                <div>Product: {details.name}</div>
                <div className="mt-1">
                  Composition Breakdown:
                  {composition.meat > 0 && (
                    <div className="ml-2">
                      • Muscle Meat: {convertWeight(meatContribution)} {unit === "imperial" ? "oz" : "kg"} ({composition.meat}%)
                    </div>
                  )}
                  {composition.bone > 0 && (
                    <div className="ml-2">
                      • Bone: {convertWeight(boneContribution)} {unit === "imperial" ? "oz" : "kg"} ({composition.bone}%)
                    </div>
                  )}
                  {composition.organ > 0 && (
                    <div className="ml-2">
                      • Organ: {convertWeight(organContribution)} {unit === "imperial" ? "oz" : "kg"} ({composition.organ}%)
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // If there are no recipes and no favorites, don't render anything
  if (recipes.length === 0 && favorites.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Recipe Variations Section */}
      {recipes.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recipe Variations</h2>
            <button
              onClick={toggleFavorite}
              className={`px-4 py-2 rounded ${
                isCurrentRecipeFavorite() ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {isCurrentRecipeFavorite() ? '★ Favorited' : '☆ Add to Favorites'}
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevRecipe}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-lg">
              Recipe {currentRecipeIndex + 1} of {recipes.length}
            </span>
            <button
              onClick={nextRecipe}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </button>
          </div>
          {renderRecipe(recipes[currentRecipeIndex])}
        </div>
      )}

      {/* Favorites Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Saved Favorites</h2>
        {favorites.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No favorite recipes saved yet.</p>
        ) : (
          <div className="space-y-6">
            {favorites.map((favorite, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{favorite.name}</h3>
                    <p className="text-sm text-gray-500">
                      Saved on {new Date(favorite.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFavorite(favorite)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    Remove
                  </button>
                </div>
                {renderRecipe(favorite.recipe)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 