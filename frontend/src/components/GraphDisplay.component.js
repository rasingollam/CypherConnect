import React, { useEffect, useState } from 'react';
import { fetchAllGraphData } from '../services/Cypher.service';
import './GraphDisplay.css';

/**
 * Transforms Neo4j API response into a format compatible with Cytoscape.js.
 */
function neo4jToCytoscapeElements(resultArr) {
  const nodesMap = new Map();
  const elements = [];

  if (!Array.isArray(resultArr)) {
    return [];
  }

  resultArr.forEach(row => {
    // Process the 'n' node
    if (row.n && row.n.elementId && !nodesMap.has(row.n.elementId)) {
      nodesMap.set(row.n.elementId, true);
      elements.push({
        group: 'nodes',
        data: {
          id: row.n.elementId,
          label: row.n.properties?.name || (row.n.labels ? row.n.labels[0] : 'Node'),
          type: row.n.labels ? row.n.labels[0] : 'Node',
          ...row.n.properties,
        }
      });
    }

    // Process the 'm' node
    if (row.m && row.m.elementId && !nodesMap.has(row.m.elementId)) {
      nodesMap.set(row.m.elementId, true);
      elements.push({
        group: 'nodes',
        data: {
          id: row.m.elementId,
          label: row.m.properties?.name || (row.m.labels ? row.m.labels[0] : 'Node'),
          type: row.m.labels ? row.m.labels[0] : 'Node',
          ...row.m.properties,
        }
      });
    }

    // Process the 'r' relationship
    if (row.r && row.r.startNodeElementId && row.r.endNodeElementId) {
      elements.push({
        group: 'edges',
        data: {
          id: row.r.elementId,
          source: row.r.startNodeElementId,
          target: row.r.endNodeElementId,
          label: row.r.type
        }
      });
    }
  });

  return elements;
}


const GraphDisplay = () => {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGraph = async () => {
    setLoading(true);
    try {
      const data = await fetchAllGraphData();
      if (data && data.success) {
        // We still transform the data to check if the helper function works
        setElements(neo4jToCytoscapeElements(data.result));
      } else {
        setElements([]);
      }
    } catch (error) {
      console.error("Failed to load graph data:", error);
      setElements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, []);

  return (
    <div className="graph-display">
      <div className="graph-header">
        <h3>Graph Data (Debug View)</h3>
        <button
          className="refresh-btn"
          onClick={loadGraph}
          disabled={loading}
          title="Refresh Data"
        >
          {loading ? 'Refreshing...' : '⟳ Refresh'}
        </button>
      </div>
      <div className="graph-container" style={{ overflow: 'auto' }}>
        {loading ? (
          <div className="loading-text">Loading Data...</div>
        ) : (
          // Displaying the transformed data as JSON for debugging
          <pre style={{ color: '#fff', padding: '10px' }}>
            {JSON.stringify(elements, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default GraphDisplay;