import React from 'react';
import './GraphDisplay.css';

const GraphDisplay = ({ graphData }) => (
  <div className="graph-display">
    <div className="graph-header">
      <h3>Graph Visualization</h3>
      <span className="graph-tip">[Interactive graph coming soon]</span>
    </div>
    <div className="graph-json">
      <pre>{JSON.stringify(graphData, null, 2)}</pre>
    </div>
  </div>
);

export default GraphDisplay;