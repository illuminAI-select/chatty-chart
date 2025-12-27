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
  setInitialState();
}

/**
 * Set initial state: only 'calls' active with 100% volume
 */
function setInitialState() {
  channels.forEach(({ key }) => {
    const enabledCheckbox = document.getElementById(`${key}-enabled`);
    const input = document.getElementById(key);
    const slider = document.getElementById(`${key}-slider`);

    if (key === 'calls') {
      // Set 'calls' to active with 100% volume and expanded
      enabledCheckbox.checked = true;
      input.value = 100;
      slider.value = 100;
    } else {
      // Set all other channels to inactive with 0% volume and collapsed
      enabledCheckbox.checked = false;
      input.value = 0;
      slider.value = 0;
      // Collapse inactive channels
      const group = document.querySelector(`[data-channel="${key}"]`);
      if (group) {
        group.classList.add('collapsed');
      }
    }
  });
}

/**
 * Create channel control UI elements
 */
function createChannelControls() {
  const controlsContainer = document.getElementById('controls');

  channels.forEach(({ key, name, percentage, analyzed }) => {
    const group = document.createElement('div');
    group.classList.add('channel-group');
    group.setAttribute('data-channel', key);

    group.innerHTML = `
      <div class="channel-header">
        <div class="channel-header-left">
          <button class="collapse-btn" onclick="toggleCollapse('${key}')" aria-label="Toggle section">▼</button>
          <span class="channel-name">${name}</span>
        </div>
        <label class="toggle-label">
          <input type="checkbox" id="${key}-enabled" checked class="channel-toggle" onchange="toggleChannel('${key}')">
          <span>Active</span>
        </label>
      </div>

      <div class="channel-content">
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
            <input type="checkbox" id="${key}-lock" class="lock-checkbox" onchange="handleLockChange('${key}')" title="Lock this channel's percentage">
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
  const group = document.querySelector(`[data-channel="${key}"]`);

  if (!enabled) {
    document.getElementById(key).value = 0;
    document.getElementById(`${key}-slider`).value = 0;
    // Collapse inactive channels
    if (group) {
      group.classList.add('collapsed');
    }
  } else {
    // Expand active channels
    if (group) {
      group.classList.remove('collapsed');
    }
  }
  // Trigger automatic volume splitting when active status changes
  autoSplitVolume();
}

/**
 * Toggle collapse/expand state for a channel section
 */
function toggleCollapse(key) {
  const groups = document.querySelectorAll('.channel-group');
  groups.forEach(group => {
    const header = group.querySelector('.channel-header');
    const nameElement = header.querySelector('.channel-name');
    if (nameElement && nameElement.textContent === channels.find(c => c.key === key).name) {
      group.classList.toggle('collapsed');
    }
  });
}

/**
 * Handle lock change event
 */
function handleLockChange(key) {
  // Trigger automatic volume splitting when lock status changes
  autoSplitVolume();
}

/**
 * Automatically split volume between unlocked and active channels
 */
function autoSplitVolume() {
  let lockedTotal = 0;
  const unlocked = [];

  channels.forEach(({ key }) => {
    const enabled = document.getElementById(`${key}-enabled`).checked;
    const locked = document.getElementById(`${key}-lock`).checked;
    const input = document.getElementById(key);
    const slider = document.getElementById(`${key}-slider`);
    const currentValue = parseInt(input.value) || 0;

    if (!enabled) {
      // Inactive channels get 0%
      input.value = 0;
      slider.value = 0;
    } else if (locked) {
      // Locked channels keep their value
      lockedTotal += currentValue;
    } else {
      // Track unlocked active channels
      unlocked.push({ key, input, slider });
    }
  });

  // Calculate remaining percentage for unlocked channels
  const remaining = 100 - lockedTotal;

  if (remaining < 0 || unlocked.length === 0) {
    return; // Can't split if over 100% or no unlocked channels
  }

  // Distribute remaining percentage equally among unlocked channels
  const base = Math.floor(remaining / unlocked.length);
  let leftover = remaining % unlocked.length;

  unlocked.forEach(({ input, slider }) => {
    const value = base + (leftover > 0 ? 1 : 0);
    input.value = value;
    slider.value = value;
    if (leftover > 0) leftover--;
  });
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

/**
 * Help Modal Functions
 */
function openHelpModal() {
  const modal = document.getElementById('helpModal');
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
}

function closeHelpModal() {
  const modal = document.getElementById('helpModal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  // Restore body scrolling
  document.body.style.overflow = '';
}

function initializeHelpModal() {
  const helpButton = document.getElementById('helpButton');
  const closeButton = document.getElementById('closeModal');
  const closeModalButton = document.getElementById('closeModalButton');
  const modal = document.getElementById('helpModal');

  // Open modal when help button is clicked
  if (helpButton) {
    helpButton.addEventListener('click', openHelpModal);
  }

  // Close modal when close button is clicked
  if (closeButton) {
    closeButton.addEventListener('click', closeHelpModal);
  }

  // Close modal when "Got It!" button is clicked
  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeHelpModal);
  }

  // Close modal when clicking on the backdrop
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeHelpModal();
      }
    });
  }

  // Prevent modal content clicks from bubbling to the backdrop
  const modalContent = modal ? modal.querySelector('.modal-content') : null;
  if (modalContent) {
    modalContent.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  // Close modal when ESC key is pressed
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const modal = document.getElementById('helpModal');
      if (modal && modal.classList.contains('show')) {
        closeHelpModal();
      }
    }
  });
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeHelpModal();
  });
} else {
  initializeApp();
  initializeHelpModal();
}
