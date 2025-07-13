import React, { useEffect, useState } from 'react';
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

const COSE_LAYOUT = {
  name: 'cose',
  animate: true,
  animationDuration: 1200,
  fit: true,
  padding: 50,
  nodeRepulsion: 400000,
  nodeOverlap: 5,
  idealEdgeLength: 180,
  edgeElasticity: 0.1,
  nestingFactor: 1.2,
  gravity: 120,
  numIter: 3000,
  initialTemp: 300,
  coolingFactor: 0.95,
  minTemp: 1.0
};

const GraphDisplay = () => {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadGraph = async () => {
    setLoading(true);
    const data = await fetchAllGraphData();
    if (data && data.success && Array.isArray(data.result)) {
      setElements(neo4jToCytoscapeElements(data.result));
    } else {
      setElements([]);
    }
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
          <span className="graph-tip">[Interactive knowledge graph]</span>
        </div>
        <button
          className="refresh-btn"
          onClick={loadGraph}
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
          layout={COSE_LAYOUT}
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
                'width': 40,
                'height': 40,
                'border-width': 2,
                'border-color': '#fff'
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