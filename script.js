// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// Game variables
const layers = [
  { name: 'Grass', clicksNeeded: 10 },
  { name: 'Topsoil', clicksNeeded: 13 },
  { name: 'Clay', clicksNeeded: 15 },
  { name: 'Rock', clicksNeeded: 20 },
  { name: 'Hard Rock', clicksNeeded: 25 },
  { name: 'Water', clicksNeeded: 0 } // Last layer, win on entry
];
let currentLayer = 0; // Start at the top layer
let clicks = 0; // Clicks in current layer

// Drill positions for each layer (in px from top)
const drillPositions = [130, 180, 220, 290, 340, 430];

// Info bubbles to show at different stages
const infoBubbles = [
  'charity: water has helped 20.3 million people gain access to safe drinking water.',
  '771 million people lack access to clean water worldwide.',
  'Every $40 can bring clean water to one person.',
  'Clean water changes everything: health, education, and income.',
  'Water is life. It\'s essential for survival and development.',
  'You did it! You reached water!'
];

// Get DOM elements
const digBtn = document.getElementById('dig-btn');
const drill = document.getElementById('drill');
const infoBubble = document.getElementById('info-bubble');
const victoryScreen = document.getElementById('victory-screen');

// Show an info bubble with a message
function showInfoBubble(message) {
  infoBubble.textContent = message;
  infoBubble.style.display = 'block';
  // Hide after 3 seconds
  setTimeout(() => {
    infoBubble.style.display = 'none';
  }, 3000);
}

// Move the drill down visually
function moveDrill(layerIndex) {
  // Move the drill image to the correct position
  drill.style.top = `${drillPositions[layerIndex]}px`;
}

// Handle dig button click
function handleDig() {
  // Add one click
  clicks++;
  // Show a debug message
  console.log(`Clicked! Layer: ${layers[currentLayer].name}, Clicks: ${clicks}`);

  // Check if enough clicks to go to next layer
  if (clicks >= layers[currentLayer].clicksNeeded) {
    // Go to next layer
    currentLayer++;
    clicks = 0;
    // Move the drill down
    moveDrill(currentLayer);
    // Show info bubble for this layer, if available
    if (infoBubbles[currentLayer]) {
      showInfoBubble(infoBubbles[currentLayer]);
    }
    // If reached water, show victory screen
    if (layers[currentLayer].name === 'Water') {
      digBtn.style.display = 'none';
      victoryScreen.style.display = 'flex';
    }
  }
}

digBtn.addEventListener('click', handleDig);

// Initial setup
moveDrill(0);
