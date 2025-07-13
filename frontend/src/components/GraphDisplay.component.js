import React, { useEffect, useState } from 'react';
import { fetchAllGraphData } from '../services/Cypher.service';
import './GraphDisplay.css';

const GraphDisplay = () => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadGraph = async () => {
    setLoading(true);
    const data = await fetchAllGraphData();
    setGraphData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadGraph();
  }, []);

  return (
    <div className="graph-display">
      <div className="graph-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Graph Visualization</h3>
          <span className="graph-tip">[Interactive graph coming soon]</span>
        </div>
        <button
          className="refresh-btn"
          onClick={loadGraph}
          disabled={loading}
          title="Refresh Graph"
          style={{
            background: '#23272b',
            color: '#90caf9',
            border: '1px solid #343a40',
            borderRadius: '6px',
            padding: '6px 14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            marginLeft: '16px'
          }}
        >
          {loading ? 'Refreshing...' : '⟳ Refresh'}
        </button>
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