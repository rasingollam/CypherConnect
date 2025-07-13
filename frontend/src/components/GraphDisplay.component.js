import React, { useEffect, useState, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { fetchAllGraphData } from '../services/Cypher.service';
import './GraphDisplay.css';

function neo4jToCytoscapeElements(resultArr) {
  const nodesMap = new Map();
  const elements = [];

  resultArr.forEach(row => {
    if (row.n && row.n.elementId && !nodesMap.has(row.n.elementId)) {
      nodesMap.set(row.n.elementId, true);
      elements.push({
        data: {
          id: row.n.elementId,
          label: row.n.labels ? row.n.labels[0] : 'Node',
          ...row.n.properties
        }
      });
    }
    if (row.m && row.m.elementId && !nodesMap.has(row.m.elementId)) {
      nodesMap.set(row.m.elementId, true);
      elements.push({
        data: {
          id: row.m.elementId,
          label: row.m.labels ? row.m.labels[0] : 'Node',
          ...row.m.properties
        }
      });
    }
    if (row.r && row.r.startNodeElementId && row.r.endNodeElementId) {
      elements.push({
        data: {
          source: row.r.startNodeElementId,
          target: row.r.endNodeElementId,
          label: row.r.type
        }
      });
    }
  });

  return elements;
}

// Updated layout configuration for better separation
const SPREAD_LAYOUT = {
  name: 'cose',
  animate: true,
  animationDuration: 1500,
  fit: true,
  padding: 120,            // More padding
  nodeRepulsion: 1000000,   // Much more repulsion force
  nodeOverlap: 20,         // Stronger overlap prevention
  idealEdgeLength: 240,    // Longer ideal edge length
  edgeElasticity: 0.2,     // Slightly more flexible edges
  nestingFactor: 1.5,      
  gravity: 80,             // Less gravity to allow spreading
  numIter: 5000,           // More iterations for better layout
  initialTemp: 350,        // Higher starting temperature
  coolingFactor: 0.97,     // Slower cooling for better results
  minTemp: 1.0,
  randomize: true          // Start with random positions
};

const GraphDisplay = () => {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(false);
  const cyRef = useRef(null);

  const loadGraph = async () => {
    setLoading(true);
    const data = await fetchAllGraphData();
    if (data && data.success && Array.isArray(data.result)) {
      setElements(neo4jToCytoscapeElements(data.result));
      
      // Allow a moment for elements to be added to the graph
      setTimeout(() => {
        if (cyRef.current) {
          cyRef.current.layout(SPREAD_LAYOUT).run();
        }
      }, 100);
    } else {
      setElements([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGraph();
  }, []);

  // Handle manual refresh with layout reset
  const handleRefresh = () => {
    loadGraph();
  };

  return (
    <div className="graph-display">
      <div className="graph-header">
        <div>
          <h3>Graph Visualization</h3>
          <span className="graph-tip">[Interactive knowledge graph]</span>
        </div>
        <button
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={loading}
          title="Refresh Graph"
        >
          {loading ? 'Refreshing...' : '⟳ Refresh'}
        </button>
      </div>
      <div style={{ height: '500px', background: '#181a1b', borderRadius: '8px' }}>
        <CytoscapeComponent
          elements={elements}
          style={{ width: '100%', height: '100%' }}
          layout={SPREAD_LAYOUT}
          cy={(cy) => { cyRef.current = cy; }}
          stylesheet={[
            {
              selector: 'node',
              style: {
                'background-color': '#1976d2',
                'label': 'data(label)',
                'color': '#fff',
                'text-valign': 'center',
                'text-halign': 'center',
                'font-size': 14,
                'width': 50,               // Slightly larger nodes
                'height': 50,              // Slightly larger nodes
                'border-width': 2,
                'border-color': '#fff'
              }
            },
            {
              selector: 'node[label = "Person"]',
              style: {
                'background-color': '#e91e63', // Different color for Person nodes
              }
            },
            {
              selector: 'node[label = "City"]',
              style: {
                'background-color': '#4caf50', // Different color for City nodes
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 3,
                'line-color': '#90caf9',
                'target-arrow-color': '#90caf9',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'label': 'data(label)',
                'font-size': 12,
                'color': '#fff',
                'text-background-color': '#23272b',
                'text-background-opacity': 1,
                'text-background-padding': 2
              }
            }
          ]}
        />
      </div>
    </div>
  );
};

export default GraphDisplay;