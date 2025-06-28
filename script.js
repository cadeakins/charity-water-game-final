// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// Game variables
const layers = [
  { name: 'Grass', clicksNeeded: 10 },
  { name: 'Topsoil', clicksNeeded: 30 },
  { name: 'Clay', clicksNeeded: 50 },
  { name: 'Rock', clicksNeeded: 70 },
  { name: 'Hard Rock', clicksNeeded: 100 },
  { name: 'Water', clicksNeeded: 0 } // Last layer, win on entry
];
let currentLayer = 0; // Start at the top layer
let clicks = 0; // Clicks in current layer

// Drill positions for each layer (in px from top)
const drillPositions = [160, 250, 320, 410, 450, 500];

// Info bubbles to show at different stages
const infoBubbles = [
  '703 million people lack access to clean water worldwide.',
  'charity: water has helped 20.3 million people gain access to safe drinking water.',
  'Every $40 can bring clean water to one person.',
  'Clean water changes everything: health, education, and income.',
  'Water is life. It\'s essential for survival and development.',
];

// Get DOM elements
const digBtn = document.getElementById('dig-btn');
const drill = document.getElementById('drill');
const infoBubble = document.getElementById('info-bubble');
const victoryScreen = document.getElementById('victory-screen');
const clickCount = document.getElementById('click-count');
const digSound = new Audio('sounds/dig_sound.wav');
const waterSound = new Audio('sounds/water_sound.wav');
const backgroundArea = document.getElementById('background-area');

const layerImages = [
  'img/Full Layers BG.png', // Grass
  'img/Layer2.png',         // Topsoil
  'img/Layer3.png',         // Clay
  'img/Layer4.png',         // Rock
  'img/Layer5.png',         // Hard Rock
  'img/Layer6.png'          // Water
]

//Preload the images
const preloadedImages = [];
for (let i = 0; i < layerImages.length; i++) {
  const img = new Image();
  img.src = layerImages[i];
  preloadedImages.push(img);
}

// Show an info bubble with a message
function showInfoBubble(message) {
  // Set the message text
  infoBubble.textContent = message;
  // Add the 'show' class to fade in
  infoBubble.classList.add('show');

  // Remove the 'show' class after 3 seconds to fade out
  setTimeout(() => {
    infoBubble.classList.remove('show');
  }, 3000);
}

// Move the drill down visually
function moveDrill(layerIndex) {
  // Move the drill image to the correct position
  drill.style.top = `${drillPositions[layerIndex]}px`;
  originalTop = drillPositions[layerIndex]; // Update the original top position
  offset = 0; // Reset the offset so the drill doesn't jump
  drill.style.top = `${originalTop}px`; // Ensure drill is at the correct position
}

let drillAnimationInterval = null; // To store the interval ID
let drillAnimationTimeout = null;  // To store the timeout ID
let drillIsAnimating = false;      // Track if animation is running
let originalTop = drillPositions[0]; // Start at the first layer
let offset = 0;

function startDrillAnimation() {
  if (drillIsAnimating) {
    resetDrillAnimationTimeout();
    return;
  }

  drillIsAnimating = true;
  let direction = 1;

  drillAnimationInterval = setInterval(() => {
    // Move drill up and down by 8px
    offset += direction * 5;
    if (offset > 10 || offset < -10) {
      direction *= -1; // Change direction
    }
    drill.style.top = `${originalTop + offset}px`;
  }, 25);

  resetDrillAnimationTimeout();
}

function resetDrillAnimationTimeout() {
  // Clear any previous timeout
  if (drillAnimationTimeout) {
    clearTimeout(drillAnimationTimeout);
  }
  // Stop animation after 1.5 seconds of no clicks
  drillAnimationTimeout = setTimeout(stopDrillAnimation, 1500);
}

function stopDrillAnimation() {
  if (drillAnimationInterval) {
    clearInterval(drillAnimationInterval);
    drillAnimationInterval = null;
  }
  drillIsAnimating = false;
  // Reset drill to its correct position for the current layer
  moveDrill(currentLayer);
}

// Handle dig button click
function handleDig() {
  // Start or continue the drill animation
  startDrillAnimation();

  // Add one click
  clicks++;
  // Show a debug message
  console.log(`Clicked! Layer: ${layers[currentLayer].name}, Clicks: ${clicks}`);
  clickCount.textContent = `Clicks: ${clicks}`; // Update the click count text

  // Check if enough clicks to go to next layer
  if (clicks >= layers[currentLayer].clicksNeeded) {
    // Go to next layer
    currentLayer++;

    digSound.currentTime = 0; // Reset sound to start
    digSound.play(); // Play the digging sound

    // Move the drill down
    moveDrill(currentLayer);

    if (currentLayer === 1) {
      backgroundArea.style.backgroundImage = 'url("img/Layer2.png")'; // Change background for Layer 2
    } else if (currentLayer === 2) {
      backgroundArea.style.backgroundImage = 'url("img/Layer3.png")'; // Change background for Layer 3
    } else if (currentLayer === 3) {
      backgroundArea.style.backgroundImage = 'url("img/Layer4.png")'; // Change background for Layer 4
    } else if (currentLayer === 4) {
      backgroundArea.style.backgroundImage = 'url("img/Layer5.png")'; // Change background for Layer 5
    } else if (currentLayer === 5) {
      backgroundArea.style.backgroundImage = 'url("img/Layer6.png")'; // Change background for Layer 6
    }

    // Show info bubble for this layer, if available
    if (infoBubbles[currentLayer]) {
      showInfoBubble(infoBubbles[currentLayer]);
    }

    // If reached water, show victory screen
    if (layers[currentLayer].name === 'Water') {
      digBtn.style.display = 'none';
      waterSound.currentTime = 0; // Reset water sound to start
      waterSound.play(); // Play water sound
      setTimeout(() => {
        victoryScreen.classList.add('show'); // Show the victory screen
      }, 2000); // Wait 2 seconds before showing victory screen
    }
  }
}

digBtn.addEventListener('click', handleDig);

// Initial setup
moveDrill(0);