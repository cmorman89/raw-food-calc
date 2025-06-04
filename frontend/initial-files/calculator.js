// Import the products data
const products = require('./ratios.js');
const modesOfFood = require('./foodMode.js');

function calculateAll() {
    // Get input values
    const weightInput = parseFloat(document.getElementById('dogWeight').value);
    const methodInput = document.getElementById('method').value;
    const unit = document.getElementById('unit').value;
    const mode = document.getElementById('mode').value;
    const resultDiv = document.getElementById('result');
    const percentInput = parseFloat(document.getElementById('percentage').value) || 2.5;
    const percentage = percentInput / 100;

    // Validate inputs
    if (isNaN(weightInput) || !methodInput || !mode) {
        resultDiv.textContent = "Please enter all fields correctly.";
        return;
    }

    // Convert weight to kg if needed
    let dogWeightKG;
    if (unit === "lb") {
        dogWeightKG = weightInput / 2.2;
    } else {
        dogWeightKG = weightInput;
    }

    // Get the selected food mode configuration
    const selectedMode = modesOfFood[methodInput]?.[mode];
    if (!selectedMode) {
        resultDiv.innerHTML = 'Invalid food mode selected';
        return;
    }

    // Calculate total daily food amount
    const foodWeightKG = dogWeightKG * percentage;

    // Calculate individual components
    let resultHTML = '<h3>Daily Food Requirements:</h3>';
    
    // Display total amount in selected unit
    const displayWeight = unit === "lb" ? (foodWeightKG * 2.2).toFixed(2) : foodWeightKG.toFixed(2);
    const unitLabel = unit === "lb" ? "pounds" : "kg";
    resultHTML += `<p>Total daily amount: ${displayWeight} ${unitLabel}</p>`;
    
    // Display breakdown by component
    resultHTML += '<h4>Breakdown by component:</h4>';
    resultHTML += '<ul>';

    selectedMode.forEach(component => {
        const componentWeightKG = foodWeightKG * (component.percentage / 100);
        const displayComponentWeight = unit === "lb" ? 
            (componentWeightKG * 2.2).toFixed(2) : 
            componentWeightKG.toFixed(2);
        
        resultHTML += `<li>${component.name}: ${displayComponentWeight} ${unitLabel} (${component.percentage}%)</li>`;
    });

    resultHTML += '</ul>';

    // Add food suggestions based on components
    resultHTML += '<h4>Suggested Food Options:</h4>';
    resultHTML += '<div class="food-suggestions">';

    selectedMode.forEach(component => {
        const componentWeightKG = foodWeightKG * (component.percentage / 100);
        const displayComponentWeight = unit === "lb" ? 
            (componentWeightKG * 2.2).toFixed(2) : 
            componentWeightKG.toFixed(2);

        // Find matching products for this component
        const matchingProducts = findMatchingProducts(component.name, componentWeightKG);
        
        if (matchingProducts.length > 0) {
            resultHTML += `<div class="component-suggestions">`;
            resultHTML += `<h5>${component.name} (${displayComponentWeight} ${unitLabel}):</h5>`;
            resultHTML += '<ul>';
            matchingProducts.forEach(product => {
                resultHTML += `<li>${product.name} - ${product.weight} ${unitLabel}</li>`;
            });
            resultHTML += '</ul></div>';
        }
    });

    resultHTML += '</div>';
    resultDiv.innerHTML = resultHTML;
}

function findMatchingProducts(componentName, requiredWeight) {
    // Map component names to product categories
    const componentToCategory = {
        'MuscleMeat': 'meat',
        'BoneyMeat': 'bone',
        'Liver': 'organ',
        'LiverMeat': 'organ',
        'OrganMeat': 'organ'
    };

    const category = componentToCategory[componentName];
    if (!category) return [];

    // Get all products from all animal types
    const allProducts = Object.values(products).flat();

    // Filter products that match the category and have sufficient weight
    return allProducts.filter(product => {
        if (!product[category]) return false;
        const productWeight = parseFloat(product.weight);
        return productWeight >= requiredWeight * 0.8; // Allow products that are at least 80% of required weight
    }).slice(0, 3); // Return top 3 matches
}