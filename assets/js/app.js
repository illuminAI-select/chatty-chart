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
        <span class="channel-name">${name}</span>
        <label class="toggle-label">
          <input type="checkbox" id="${key}-enabled" checked class="channel-toggle" onchange="toggleChannel('${key}')">
          <span>Active</span>
        </label>
      </div>

      <div class="control-row">
        <label class="control-label">
          <span class="label-text">Data Volume</span>
          <span class="label-help">% of total communications</span>
        </label>
        <div class="input-group">
          <button class="stepper-btn" onclick="adjustValue('${key}', -5)" aria-label="Decrease by 5">−</button>
          <input type="number" id="${key}" min="0" max="100" value="${percentage}" onchange="syncSlider('${key}')" aria-label="${name} percentage">
          <button class="stepper-btn" onclick="adjustValue('${key}', 5)" aria-label="Increase by 5">+</button>
          <span class="percentage-symbol">%</span>
        </div>
        <input type="range" id="${key}-slider" min="0" max="100" value="${percentage}" oninput="syncInput('${key}')" class="desktop-only" aria-label="${name} slider">
        <label class="lock-label">
          <input type="checkbox" id="${key}-lock" class="lock-checkbox" title="Lock this channel's percentage">
          <span class="lock-icon">🔒</span>
        </label>
      </div>

      <div class="control-row">
        <label class="control-label">
          <span class="label-text">Currently Analyzed</span>
          <span class="label-help">What you can actually see</span>
        </label>
        <div class="input-group">
          <button class="stepper-btn" onclick="adjustAnalyzed('${key}', -5)" aria-label="Decrease visibility by 5">−</button>
          <input type="number" id="${key}-analyzed" min="0" max="100" value="${analyzed}" aria-label="${name} visibility">
          <button class="stepper-btn" onclick="adjustAnalyzed('${key}', 5)" aria-label="Increase visibility by 5">+</button>
          <span class="percentage-symbol">%</span>
        </div>
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
 * Adjust channel percentage value with +/- buttons
 */
function adjustValue(key, delta) {
  const input = document.getElementById(key);
  const slider = document.getElementById(`${key}-slider`);
  const currentValue = parseInt(input.value) || 0;
  const newValue = Math.max(0, Math.min(100, currentValue + delta));

  input.value = newValue;
  slider.value = newValue;
}

/**
 * Adjust analyzed percentage value with +/- buttons
 */
function adjustAnalyzed(key, delta) {
  const input = document.getElementById(`${key}-analyzed`);
  const currentValue = parseInt(input.value) || 0;
  const newValue = Math.max(0, Math.min(100, currentValue + delta));

  input.value = newValue;
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
  // Auto-update visualization after preset selection
  debouncedReshuffle();
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
 * Fisher-Yates shuffle to select random indices efficiently
 */
function getRandomIndices(max, count) {
  if (count >= max) {
    return Array.from({ length: max }, (_, i) => i);
  }

  const indices = Array.from({ length: max }, (_, i) => i);
  const selected = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = i + Math.floor(Math.random() * (max - i));
    [indices[i], indices[randomIndex]] = [indices[randomIndex], indices[i]];
    selected.push(indices[i]);
  }

  return selected;
}

/**
 * Debounce function to limit rapid successive calls
 */
let reshuffleTimeout = null;
let isReshuffling = false;

function debouncedReshuffle(immediate = false) {
  if (reshuffleTimeout) {
    clearTimeout(reshuffleTimeout);
  }

  if (immediate) {
    reshuffle();
  } else {
    reshuffleTimeout = setTimeout(() => {
      reshuffle();
    }, 300);
  }
}

/**
 * Reshuffle the grid based on current channel settings
 */
function reshuffle() {
  // Prevent multiple simultaneous updates
  if (isReshuffling) {
    return;
  }

  isReshuffling = true;

  // Use requestAnimationFrame for smoother rendering
  requestAnimationFrame(() => {
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
      alert('Channel percentages must add up to 100% (currently: ' + totalPercentage + '%). Use "Auto-Balance Channels" to fix this automatically.');
      isReshuffling = false;
      return;
    }

    // Batch DOM updates
    const toRemove = [];
    const toAdd = [];

    // Track which squares should be visible (not covered)
    const visibleSquares = new Set();

    // Assign segments and select random squares
    let start = 0;
    channels.forEach(({ key }) => {
      if (!document.getElementById(`${key}-enabled`).checked) return;

      const count = counts[key];
      const randomIndices = getRandomIndices(count, analyzedCounts[key]);

      randomIndices.forEach(relativeIndex => {
        visibleSquares.add(start + relativeIndex);
      });

      start += count;
    });

    // Batch class changes - invert logic so visible squares are NOT covered
    squares.forEach((sq, index) => {
      const shouldBeVisible = visibleSquares.has(index);
      const isCovered = sq.classList.contains('covered');

      if (!shouldBeVisible && !isCovered) {
        // Should be covered but isn't - add covered class
        toAdd.push(sq);
      } else if (shouldBeVisible && isCovered) {
        // Should be visible but is covered - remove covered class
        toRemove.push(sq);
      }
    });

    // Apply all changes at once
    toRemove.forEach(sq => sq.classList.remove('covered'));
    toAdd.forEach(sq => sq.classList.add('covered'));

    // Scroll to top of visualization container
    const container = document.getElementById('visualization-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    isReshuffling = false;
  });
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
