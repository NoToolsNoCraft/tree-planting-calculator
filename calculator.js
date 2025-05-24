const treeData = [
  // Paulownia types (timber)
  { tree_type: "Paulovnija Shantong Hibrid F1", firewood: "2x2", industrial: "4x4" },
  { tree_type: "Paulovnija Elongata", firewood: "2x2", industrial: "4x4" },

  // Fruit trees (no industrial, use fruit spacing)
  { tree_type: "Apple Tree", firewood: "3x3", fruit: "5x5" },
  { tree_type: "Pear Tree", firewood: "3x3", fruit: "5x5" },
  { tree_type: "Cherry Tree", firewood: "3x3", fruit: "4x4" },
  { tree_type: "Peach Tree", firewood: "3x3", fruit: "5x5" },
  { tree_type: "Plum Tree", firewood: "3x3", fruit: "5x5" },

  // Timber trees
  { tree_type: "Oak", firewood: "2x2", industrial: "6x6" },
  { tree_type: "Pine", firewood: "2x2", industrial: "5x5" },
  { tree_type: "Spruce", firewood: "2x2", industrial: "5x5" },
  { tree_type: "Maple", firewood: "2.5x2.5", industrial: "5x5" },

  // Other trees (with industrial spacing)
  { tree_type: "Silver Birch", firewood: "2x2", industrial: "4x4" },
  { tree_type: "Dogwood", firewood: "2x2", industrial: "3x3" },
  { tree_type: "Magnolia", firewood: "2.5x2.5", industrial: "4x4" },

  // Nut trees (some could be for fruit too, but here assumed timber/industrial)
  { tree_type: "Walnut", firewood: "3x3", industrial: "6x6" },
  { tree_type: "Hazelnut", firewood: "2x2", industrial: "4x4" },

  // Other fruit trees
  { tree_type: "Apricot", firewood: "3x3", fruit: "5x5" },
  { tree_type: "Fig", firewood: "3x3", fruit: "4x4" },

  // Evergreen trees
  { tree_type: "Cedar", firewood: "2x2", industrial: "5x5" },
  { tree_type: "Fir", firewood: "2x2", industrial: "5x5" },
];

function populateTreeTypes() {
  const treeTypeSelect = document.getElementById('treeType');
  treeData.forEach(tree => {
    const option = document.createElement('option');
    option.value = tree.tree_type;
    option.text = tree.tree_type;
    treeTypeSelect.appendChild(option);
  });
}

function updateSuggestedValues() {
  const treeType = document.getElementById('treeType').value;
  const suggestedValuesDiv = document.getElementById('suggestedValues');
  suggestedValuesDiv.innerHTML = '';

  const tree = treeData.find(tree => tree.tree_type === treeType);
  if (tree) {
    const firewood = tree.firewood || 'N/A';
    const fruit = tree.fruit || null;
    const industrial = tree.industrial || null;

    let timberOrFruitText = '';
    if (fruit) {
      timberOrFruitText = `<p>=> Fruit production: ${fruit}m</p>`;
    } else if (industrial) {
      timberOrFruitText = `<p>=> Timber production: ${industrial}m</p>`;
    } else {
      timberOrFruitText = `<p>=> Timber production: N/A</p>`;
    }

    suggestedValuesDiv.innerHTML = `
      <p><strong>Recommended spacing between seedlings:</strong></p>
      <p>=> Firewood production: ${firewood}m</p>
      ${timberOrFruitText}
    `;
  }
}

function updateLandSize() {
    const landWidth = parseFloat(document.getElementById('landWidth').value);
    const landHeight = parseFloat(document.getElementById('landHeight').value);
    const unit = document.getElementById('unit').value;
    const landSizeDiv = document.getElementById('landSize');
    const areaSquareMetersField = document.getElementById('areaSquareMeters');

    if (!isNaN(landWidth) && !isNaN(landHeight)) {
        let landSizeText = `Land Size: ${landWidth} x ${landHeight} ${unit}`;
        let area = landWidth * landHeight;

        if (unit === 'meters') {
            // Update the separate field for square meters
            areaSquareMetersField.value = `${area.toFixed(2)} m²`;
            
            landSizeText += ` = ${area.toFixed(2)} m²`;
            if (area >= 10000) {
                landSizeText += ` = ${(area / 10000).toFixed(2)} hectars`;
            }
        } else {
            // If the unit is not in meters, still show the area in square meters
            areaSquareMetersField.value = `${area.toFixed(2)} m²`;
            landSizeText += ` = ${area.toFixed(2)} m²`;
        }

        landSizeDiv.innerHTML = landSizeText;
    } else {
        // Clear the output fields if the input is invalid
        landSizeDiv.innerHTML = '';
        areaSquareMetersField.value = '';
    }
}


function calculateTrees() {
const distanceX = parseFloat(document.getElementById('distanceX').value);
const distanceY = parseFloat(document.getElementById('distanceY').value);
const landWidth = parseFloat(document.getElementById('landWidth').value);
const landHeight = parseFloat(document.getElementById('landHeight').value);
const plantingStyle = document.querySelector('input[name="plantingStyle"]:checked').value;
const denominator = (Math.pow(distanceX, 2) * 0.866);


if (!distanceX || !distanceY || !landWidth || !landHeight) {
document.getElementById('result').innerText = 'Please fill in all the fields!';
return;
}

let totalTrees = 0;
const numTreesX = Math.floor(landWidth / distanceX) + 1;
const numTreesY = Math.floor(landHeight / distanceY) + 1;
const distance = distanceX * 2;
const area = landWidth * landHeight;
    

switch (plantingStyle) {
    case 'Square':
        // Check if all values are the same
    if (distanceX === distanceY && distanceX === landWidth && distanceX === landHeight) {
        document.getElementById('result').innerText = 'With the values you entered, if you plant one tree at each corner, that comes out to 4 seedlings.';
        return;
    }
    
        if (distanceX !== distanceY) {
            document.getElementById('result').innerText = 'In the square planting system, the spacing between seedlings must be equal (the X and Y values—length and width—must be the same).';
            return;
        }

        if (distanceX > landWidth && distanceY > landHeight) {
            document.getElementById('result').innerText = 'The spacing between seedlings and rows cannot be greater than the length of the plot.';
            return;
        }

        totalTrees = Math.floor(landWidth / distanceX) * Math.floor(landHeight / distanceY);
        break;

    case 'Rectangular':
        if (distanceX === distanceY) {
            document.getElementById('result').innerText = 'In the rectangular system, the spacing between seedlings must be different (the X and Y values—length and width—must differ).';
            return;
        }
        if (distanceX > landWidth && distanceY > landHeight) {
            document.getElementById('result').innerText = 'The spacing between seedlings and rows cannot be greater than the dimensions of the plot.';
            return;
        }
        totalTrees = Math.floor(landWidth / distanceX) * Math.floor(landHeight / distanceY);
        break;


case 'Hexagonal':
        if (distanceX !== distanceY) {
        document.getElementById('result').innerText = 'In the hexagonal (triangular) system, the spacing between seedlings must be equal (the values of X and Y must be the same).';
        return;
        }
        // Check if all values are the same
    if (distanceX === distanceY && distanceX === landWidth && distanceX === landHeight) {
        document.getElementById('result').innerText = 'Theoretically, 4 seedlings can be planted on this area, but only under the assumption that the land is diamond-shaped. If the land is square-shaped, only 3 seedlings can fit when planted using the triangular system.';
        return;
    }
    if (distanceX > landWidth && distanceY > landHeight) {
        document.getElementById('result').innerText = 'The spacing between seedlings and rows cannot be greater than the length of the plot.';
        return;
    }
        
        // Calculate row spacing based on plant spacing
    const rowSpacing = distanceX * 0.866; // distanceX and distanceY are equal

    // Calculate the total number of rows
    const totalRows = Math.floor((landWidth - distanceX) / rowSpacing) + 1;

    // Calculate the number of plants in odd and even rows
    const plantsOddRow = Math.floor(landHeight / distanceX);
    const plantsEvenRow = Math.floor((landHeight - (distanceX * 0.5)) / distanceX);

    // Calculate the number of even and odd rows
    const evenRows = Math.floor(totalRows / 2);
    const oddRows = totalRows - evenRows;

    // Calculate the total number of plants
    totalTrees = (plantsOddRow * oddRows) + (plantsEvenRow * evenRows);

        
    break;

default:
    document.getElementById('result').innerText = 'Invalid planting style selected.';
    return;
}

document.getElementById('result').innerText = `Optimal number of trees that can be planted on this land: ${totalTrees}`;
checkSpecialComment();
}


function checkSpecialComment() {
const distanceX = parseFloat(document.getElementById('distanceX').value);
const distanceY = parseFloat(document.getElementById('distanceY').value);
const landWidth = parseFloat(document.getElementById('landWidth').value);
const landHeight = parseFloat(document.getElementById('landHeight').value);
const plantingStyle = document.querySelector('input[name="plantingStyle"]:checked').value;


const specialCommentDiv = document.getElementById('specialcomment');
specialCommentDiv.innerHTML = ''; // Clear previous comments

if (plantingStyle === 'Square') {
specialCommentDiv.innerHTML = 'The square planting system is excellent for growing paulownia due to its efficient use of space and resources. By arranging the trees in a grid, this method ensures even spacing, allowing each tree enough light, water, and nutrients. This uniformity promotes healthy growth and maximizes yield. For example, a typical spacing might be 3 meters between trees and 3 meters between rows, optimizing the growth potential of each paulownia while making maintenance easier.';
}

if (plantingStyle === 'Rectangular') {
specialCommentDiv.innerHTML = 'The rectangular planting system is excellent for growing paulownia due to its efficient use of space and resources. By arranging the trees in a grid, this method ensures even spacing, allowing each tree enough light, water, and nutrients. This uniformity promotes healthy growth and maximizes yield. For example, a typical spacing might be 2 meters between trees and 3 meters between rows, optimizing the growth potential of each paulownia while making maintenance easier.';
}

if (plantingStyle === 'Hexagonal') {
specialCommentDiv.innerHTML = 'The hexagonal (triangular) method allows optimal use of space by minimizing empty gaps between trees. This increases the number of trees per unit area, improving yield and efficiency. Additionally, this method provides better access to each tree, making maintenance and harvesting easier. Furthermore, the balance of light and nutrients is improved due to reduced shading among the trees.';
}
}



window.onload = function() {
    populateTreeTypes();
}
