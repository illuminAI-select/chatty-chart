# Chatty Chart

A mobile-responsive visualization tool for analyzing communication channel transparency and distribution.

## Features

- **Mobile-First Responsive Design**: Optimized for all screen sizes from phones to desktops
- **Interactive Controls**: Adjust channel percentages with sliders and number inputs
- **Visual Grid Display**: See transparency distribution across channels
- **Channel Management**: Enable/disable channels and lock percentages
- **Quick Presets**: Apply analyzed percentages quickly with preset buttons

## Project Structure

```
chatty-chart/
├── index.html              # Main HTML file (required for GitHub Pages)
├── assets/
│   ├── css/
│   │   └── styles.css     # Mobile-first responsive styles
│   ├── js/
│   │   └── app.js         # Application logic
│   └── images/
│       └── FinServ - Customer Service & Account Support.png
├── LICENSE
└── README.md
```

## Technology Stack

- **HTML5**: Semantic markup with accessibility attributes
- **CSS3**: Mobile-first responsive design with CSS Grid and Flexbox
- **Vanilla JavaScript**: No dependencies, pure ES6+

## Mobile Optimization

- Touch-friendly controls (44px minimum touch targets)
- Responsive breakpoints: 480px, 768px, 1024px, 1280px
- Prevents zoom on iOS form inputs
- Optimized spacing and font sizes for mobile devices
- Stack layout on mobile, side-by-side on desktop

## Development

Simply open `index.html` in a modern web browser. No build process required.

## GitHub Pages

This project is configured for GitHub Pages deployment. The `index.html` file must remain in the root directory.

## License

See LICENSE file for details.
