// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// Game variables
let layers = [];
let currentLayer = 0; // Start at the top layer
let clicks = 0; // Clicks in current layer

// Difficulty settings
const difficultySettings = {
  easy:    [10, 20, 30, 40, 50],
  normal:  [10, 30, 50, 70, 100],
  hard:    [20, 50, 80, 120, 180]
};

// Layer names
const layerNames = ['Grass', 'Topsoil', 'Clay', 'Rock', 'Hard Rock', 'Water'];

// Percent positions for each layer (0 = top, 1 = bottom)
const drillPositionPercents = [0.265, 0.39, 0.5, 0.66, 0.72, 0.8];

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
const difficultyOverlay = document.getElementById('difficulty-overlay');

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

// Set up difficulty selection
function setDifficulty(difficulty) {
  // Set up layers array based on difficulty
  layers = [
    { name: 'Grass', clicksNeeded: difficultySettings[difficulty][0] },
    { name: 'Topsoil', clicksNeeded: difficultySettings[difficulty][1] },
    { name: 'Clay', clicksNeeded: difficultySettings[difficulty][2] },
    { name: 'Rock', clicksNeeded: difficultySettings[difficulty][3] },
    { name: 'Hard Rock', clicksNeeded: difficultySettings[difficulty][4] },
    { name: 'Water', clicksNeeded: 0 }
  ];
  currentLayer = 0;
  clicks = 0;
  clickCount.textContent = `Clicks: 0`;
  moveDrill(0);
  digBtn.disabled = false;
  difficultyOverlay.style.display = 'none';
}

// Add event listeners to difficulty buttons
document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const difficulty = this.getAttribute('data-difficulty');
    setDifficulty(difficulty);
  });
});

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
  // Get the height of the background area
  const bgHeight = backgroundArea.offsetHeight;

  // Calculate the top position as a percentage of the background height
  const percent = drillPositionPercents[layerIndex];
  const topPx = bgHeight * percent;

  // Move the drill image to the correct position
  drill.style.top = `${topPx}px`;
  originalTop = topPx; // Update the original top position for animation
  offset = 0; // Reset the offset so the drill doesn't jump
  drill.style.top = `${originalTop}px`; // Ensure drill is at the correct position
}

let drillAnimationInterval = null; // To store the interval ID
let drillAnimationTimeout = null;  // To store the timeout ID
let drillIsAnimating = false;      // Track if animation is running
let originalTop = drillPositionPercents[0]; // Start at the first layer
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
  // Don't allow clicking if difficulty not selected
  if (digBtn.disabled) return;

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

    // Change background for each layer
    if (currentLayer === 1) {
      backgroundArea.style.backgroundImage = 'url("img/Layer2.png")';
    } else if (currentLayer === 2) {
      backgroundArea.style.backgroundImage = 'url("img/Layer3.png")';
    } else if (currentLayer === 3) {
      backgroundArea.style.backgroundImage = 'url("img/Layer4.png")';
    } else if (currentLayer === 4) {
      backgroundArea.style.backgroundImage = 'url("img/Layer5.png")';
    } else if (currentLayer === 5) {
      backgroundArea.style.backgroundImage = 'url("img/Layer6.png")';
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

// Initial setup: show overlay, disable dig button
digBtn.disabled = true;
moveDrill(0);

// Update drill position on window resize
window.addEventListener('resize', () => {
  moveDrill(currentLayer);
});