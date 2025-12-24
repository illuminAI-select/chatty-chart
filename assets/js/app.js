/**
 * Communication Channel Transparency Visualization
 * Handles channel input controls and grid visualization
 */

// Channel configuration data
const channels = [
  { key: 'calls', name: 'Calls', percentage: 45, analyzed: 5 },
  { key: 'email', name: 'Email', percentage: 25, analyzed: 10 },
  { key: 'chat', name: 'Chat', percentage: 10, analyzed: 4 },
  { key: 'external', name: 'External', percentage: 10, analyzed: 12 },
  { key: 'internal', name: 'Internal', percentage: 10, analyzed: 2 }
];

/**
 * Initialize the application when DOM is ready
 */
function initializeApp() {
  createChannelControls();
  initializeGrid();
}

/**
 * Create channel control UI elements
 */
function createChannelControls() {
  const controlsContainer = document.getElementById('controls');

  channels.forEach(({ key, name, percentage, analyzed }) => {
    const group = document.createElement('div');
    group.classList.add('channel-group');

    group.innerHTML = `
      <div class="channel-header">
        <span>${name}</span>
        <label>
          <input type="checkbox" id="${key}-enabled" checked class="channel-toggle" onchange="toggleChannel('${key}')">
          <span>Enabled</span>
        </label>
      </div>
      <div class="percentage-section">
        <label>${name} %:</label>
        <input type="number" id="${key}" min="0" max="100" value="${percentage}" onchange="syncSlider('${key}')">
        <input type="range" id="${key}-slider" min="0" max="100" value="${percentage}" oninput="syncInput('${key}')">
        <input type="checkbox" id="${key}-lock" class="lock" title="Lock Channel %">
      </div>
      <div class="analyzed-section">
        <label>Analyzed %:</label>
        <input type="number" id="${key}-analyzed" min="0" max="100" value="${analyzed}">
      </div>
    `;

    controlsContainer.appendChild(group);
  });
}

/**
 * Sync slider value from number input
 */
function syncSlider(key) {
  const value = document.getElementById(key).value;
  document.getElementById(`${key}-slider`).value = value;
}

/**
 * Sync number input value from slider
 */
function syncInput(key) {
  const value = document.getElementById(`${key}-slider`).value;
  document.getElementById(key).value = value;
}

/**
 * Toggle channel enabled/disabled state
 */
function toggleChannel(key) {
  const enabled = document.getElementById(`${key}-enabled`).checked;
  if (!enabled) {
    document.getElementById(key).value = 0;
    document.getElementById(`${key}-slider`).value = 0;
  }
}

/**
 * Reset all channels to original values
 */
function resetToOriginal() {
  channels.forEach(({ key, percentage, analyzed }) => {
    document.getElementById(key).value = percentage;
    document.getElementById(`${key}-slider`).value = percentage;
    document.getElementById(`${key}-analyzed`).value = analyzed;
    document.getElementById(`${key}-lock`).checked = false;
    document.getElementById(`${key}-enabled`).checked = true;
  });
}

/**
 * Set analyzed percentage for all channels
 */
function setAnalyzedPercentage(value) {
  channels.forEach(({ key }) => {
    document.getElementById(`${key}-analyzed`).value = value;
  });
}

/**
 * Distribute remaining percentage among unlocked channels
 */
function distributeRemaining() {
  let used = 0;
  const editable = [];

  channels.forEach(({ key }) => {
    if (!document.getElementById(`${key}-enabled`).checked) return;

    const input = document.getElementById(key);
    const slider = document.getElementById(`${key}-slider`);
    const locked = document.getElementById(`${key}-lock`).checked;
    const val = parseInt(input.value) || 0;

    if (locked) {
      used += val;
    } else {
      editable.push({ key, input, slider });
    }
  });

  let remaining = 100 - used;
  if (remaining < 0 || editable.length === 0) return;

  const base = Math.floor(remaining / editable.length);
  let leftover = remaining % editable.length;

  editable.forEach(({ input, slider }) => {
    const value = base + (leftover > 0 ? 1 : 0);
    input.value = value;
    slider.value = value;
    if (leftover > 0) leftover--;
  });
}

/**
 * Initialize the visualization grid
 */
const gridSize = 100;
const squares = [];

function initializeGrid() {
  const grid = document.getElementById('grid');

  for (let i = 0; i < gridSize * gridSize; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    grid.appendChild(square);
    squares.push(square);
  }
}

/**
 * Reshuffle the grid based on current channel settings
 */
function reshuffle() {
  // Reset all squares
  squares.forEach(sq => sq.classList.remove('transparent'));

  const totalSquares = gridSize * gridSize;
  let totalPercentage = 0;
  const counts = {};
  const analyzedCounts = {};
  const segments = {};

  // Calculate counts for each channel
  channels.forEach(({ key }) => {
    if (!document.getElementById(`${key}-enabled`).checked) return;

    const percent = parseInt(document.getElementById(key).value) || 0;
    const analyzed = parseInt(document.getElementById(`${key}-analyzed`).value) || 0;

    totalPercentage += percent;
    counts[key] = Math.round((percent / 100) * totalSquares);
    analyzedCounts[key] = Math.round((analyzed / 100) * counts[key]);
  });

  // Validate total percentage
  if (totalPercentage !== 100) {
    alert('The total percentage of communication channels must equal 100%.');
    return;
  }

  // Assign segments to each channel
  let start = 0;
  channels.forEach(({ key }) => {
    if (!document.getElementById(`${key}-enabled`).checked) return;
    segments[key] = squares.slice(start, start + counts[key]);
    start += counts[key];
  });

  // Randomly reveal squares based on analyzed percentage
  channels.forEach(({ key }) => {
    if (!document.getElementById(`${key}-enabled`).checked) return;

    const segment = segments[key];
    const reveal = new Set();

    while (reveal.size < analyzedCounts[key]) {
      reveal.add(Math.floor(Math.random() * segment.length));
    }

    reveal.forEach(i => segment[i].classList.add('transparent'));
  });
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
