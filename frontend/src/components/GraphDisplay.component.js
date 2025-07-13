import React, { useEffect, useState } from 'react';
import { fetchAllGraphData } from '../services/Cypher.service';
import './GraphDisplay.css';

const GraphDisplay = () => {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    fetchAllGraphData().then(setGraphData);
  }, []);

  return (
    <div className="graph-display">
      <div className="graph-header">
        <h3>Graph Visualization</h3>
        <span className="graph-tip">[Interactive graph coming soon]</span>
      </div>
      <div className="graph-json">
        <pre>
          {graphData
            ? JSON.stringify(graphData, null, 2)
            : 'Loading...'}
        </pre>
      </div>
    </div>
  );
};

export default GraphDisplay;