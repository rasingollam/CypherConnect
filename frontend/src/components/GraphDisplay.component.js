import React from 'react';
import './GraphDisplay.css';

const GraphDisplay = ({ graphData }) => (
  <div className="graph-display">
    <h3>Graph Visualization</h3>
    <pre>{JSON.stringify(graphData, null, 2)}</pre>
    {/* Replace the above with a real graph visualization library */}
  </div>
);

export default GraphDisplay;