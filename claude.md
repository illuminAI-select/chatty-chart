# Chatty Chart - Communication Channel Visualization Tool

## Project Overview

Chatty Chart is a web-based visualization tool designed to demonstrate transparency in communication channel analysis for financial services customer service and account support. It provides an interactive interface to explore how different communication channels are analyzed and visualized.

## Technology Stack

- **HTML5** - Structure and layout
- **CSS3** - Styling with responsive design (mobile-friendly at <800px)
- **Vanilla JavaScript** - All interactive functionality
- **No build tools required** - Single HTML file, runs directly in browser

## Project Structure

```
chatty-chart/
├── index.html                                    # Main application file
├── FinServ - Customer Service & Account Support.png  # Background image for visualization
├── README.md                                     # Project readme
├── LICENSE                                       # License file
└── claude.md                                     # This file - project context for Claude
```

## How to Run

Simply open `index.html` in a web browser. No build step or server required.

## Application Features

### Communication Channels

The application tracks 5 communication channels with default values:

1. **Calls** - 45% of total, 5% analyzed
2. **Email** - 25% of total, 10% analyzed
3. **Chat** - 10% of total, 4% analyzed
4. **External** - 10% of total, 12% analyzed
5. **Internal** - 10% of total, 2% analyzed

### Interactive Controls

**Sidebar Controls (Left Panel):**
- Channel percentage sliders and number inputs (synced)
- Analyzed percentage inputs for each channel
- Channel enable/disable toggles
- Lock functionality to prevent percentage redistribution
- Reset button to restore original values
- Preset buttons (10%-100%) to quickly set analyzed percentages
- "Distribute Remaining %" button to auto-distribute unlocked channels
- "Reshuffle" button to regenerate the visualization

**Visualization (Right Panel):**
- 100x100 grid overlay on the background image (10,000 squares total)
- Black squares become transparent based on the analyzed percentage
- Each channel gets a proportional segment of the grid
- Random distribution of transparency within each channel's segment

### Key Functionality

**Percentage Distribution:**
- Total channel percentages must equal 100%
- Locked channels maintain their values during distribution
- Unlocked channels can be redistributed to reach 100%

**Visualization Logic:**
1. Grid is divided into segments based on channel percentages
2. Within each segment, a number of squares equal to the analyzed percentage are made transparent
3. Transparency is randomly distributed within each channel's segment
4. Reshuffling regenerates the random distribution

**Responsive Design:**
- Desktop: Two-column layout (35% sidebar, 65% content)
- Mobile (<800px): Single-column layout

## Code Organization

### HTML Structure
- `<div class="sidebar">` - Control panel
- `<div class="content">` - Visualization container

### JavaScript Architecture

**Data Model:**
```javascript
channels = [
  { key: 'calls', name: 'Calls', percentage: 45, analyzed: 5 },
  // ... more channels
]
```

**Key Functions:**
- `syncSlider(key)` / `syncInput(key)` - Keep number input and slider in sync
- `toggleChannel(key)` - Enable/disable channels
- `resetToOriginal()` - Restore default values
- `setAnalyzedPercentage(value)` - Set all analyzed % to a preset value
- `distributeRemaining()` - Auto-distribute unlocked channels to total 100%
- `reshuffle()` - Main visualization rendering function

**Grid Generation:**
- 10,000 div elements (100×100 grid)
- Each square has class `square`
- Transparent squares get additional class `transparent`

### CSS Architecture

**Layout:**
- Flexbox for main layout
- CSS Grid for 100×100 visualization grid
- Media queries for responsive behavior

**Styling Patterns:**
- Variables: None (could be modernized with CSS custom properties)
- Color scheme: Blue primary (#007bff), light background (#f4f4f9)
- Transitions: Removed for performance (animating 10,000 squares caused freezing)

## Development Considerations

### Potential Improvements
- Add CSS custom properties for theming
- Extract JavaScript to separate file for better organization
- Add data persistence (localStorage)
- Export functionality for visualization
- Accessibility improvements (ARIA labels, keyboard navigation)

### Known Limitations
- Single page application - no routing
- No state management library
- Hard-coded channel data
- No unit tests

## Use Cases

This tool is useful for:
- Demonstrating data transparency in customer service operations
- Visualizing communication channel distribution
- Interactive presentations about data analysis coverage
- Educational purposes for understanding proportional representation

## File Details

**index.html** (368 lines)
- Lines 1-185: HTML structure and CSS
- Lines 186-215: HTML body (sidebar and content)
- Lines 217-365: JavaScript logic
