import React from 'react';
import './App.css';
import PathfindingVisualizer from 'D:/Projects/Shortest Path Finder/src/PathfindingVisualizer/PathfindingVisualizer';

// The App component serves as the entry point for the application and renders the PathfindingVisualizer component, which contains the pathfinding visualization and user interface.
function App() {
  return (
    <div className="App">
      <PathfindingVisualizer></PathfindingVisualizer>
    </div>
  );
}

export default App;