import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { fetchAllGraphData } from '../services/Cypher.service';
import './GraphDisplay.css';

/**
 * Transforms Neo4j API response into a format compatible with Cytoscape.js.
 * We will reuse this and then convert to D3's format.
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

/**
 * Converts Cytoscape-formatted elements to D3-compatible {nodes, links} format.
 */
function toD3Format(elements) {
  const nodes = elements
    .filter(el => el.group === 'nodes')
    .map(el => ({ ...el.data }));

  const links = elements
    .filter(el => el.group === 'edges')
    .map(el => ({ ...el.data }));

  return { nodes, links };
}

const GraphDisplay = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null); // State for selected link
  const d3Container = useRef(null);

  const loadGraph = async () => {
    setLoading(true);
    setSelectedNode(null);
    setSelectedLink(null); // Clear selection on refresh
    try {
      const data = await fetchAllGraphData();
      if (data && data.success) {
        const cytoElements = neo4jToCytoscapeElements(data.result);
        setGraphData(toD3Format(cytoElements));
      } else {
        setGraphData({ nodes: [], links: [] });
      }
    } catch (error) {
      console.error("Failed to load graph data:", error);
      setGraphData({ nodes: [], links: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, []);

  useEffect(() => {
    if (graphData.nodes.length > 0 && d3Container.current) {
      const { nodes, links } = graphData;
      const container = d3Container.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Clear previous render
      d3.select(container).selectAll('*').remove();

      const svg = d3.select(container).append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', [-width / 2, -height / 2, width, height])
        .attr('class', 'graph-svg-canvas') 
        .call(d3.zoom().on("zoom", (event) => {
           g.attr("transform", event.transform)
        }));

      const g = svg.append("g");

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(120))
        .force('charge', d3.forceManyBody().strength(-150))
        .force('center', d3.forceCenter());

      const link = g.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
          event.stopPropagation();
          setSelectedNode(null); // Deselect any node
          setSelectedLink(d);   // Select the link
        });

      const node = g.append('g')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 15)
        .attr('fill', d => d.type === 'Person' ? '#e91e63' : (d.type === 'City' ? '#2196f3' : '#555'))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .on('click', (event, d) => {
          event.stopPropagation();
          setSelectedLink(null); // Deselect any link
          setSelectedNode(d);    // Select the node
        })
        .call(drag(simulation));

      const labels = g.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .text(d => `${d.label} (${d.type})`)
        .attr('text-anchor', 'middle')
        .attr('dy', '2.5em')
        .attr('fill', 'white')
        .style('font-size', '10px')
        .style('pointer-events', 'none');

      const linkLabels = g.append("g")
        .selectAll("text")
        .data(links)
        .join("text")
        .text(d => d.label)
        .attr("text-anchor", "middle")
        .attr("fill", "#ccc")
        .style("font-size", "8px")
        .style("pointer-events", "none");

      simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
        labels
          .attr('x', d => d.x)
          .attr('y', d => d.y);
        linkLabels
          .attr("x", d => (d.source.x + d.target.x) / 2)
          .attr("y", d => (d.source.y + d.target.y) / 2);
      });

      function drag(simulation) {
        function dragstarted(event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
        function dragged(event, d) {
          d.fx = event.x;
          d.fy = event.y;
        }
        function dragended(event, d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
        return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
      }
    }
  }, [graphData]);

  return (
    <div className="graph-display">
      <div className="graph-header">
        <h3>Graph Visualization (D3)</h3>
        <button
          className="refresh-btn"
          onClick={loadGraph}
          disabled={loading}
          title="Refresh Data"
        >
          {loading ? 'Refreshing...' : '⟳ Refresh'}
        </button>
      </div>
      <div className="content-wrapper">
        <div 
          className="graph-container" 
          onClick={(e) => {
            if (e.target.classList.contains('graph-svg-canvas')) {
              setSelectedNode(null);
              setSelectedLink(null); // Clear link selection on background click
            }
          }}
        >
          {loading ? (
            <div className="loading-text">Loading Data...</div>
          ) : (
            <div ref={d3Container} style={{ width: '100%', height: '100%' }} />
          )}
        </div>
        {selectedNode && (
          <div className="properties-sidebar">
            <h4>Node Properties</h4>
            <ul>
              {Object.entries(selectedNode)
                .filter(([key]) => !['index', 'x', 'y', 'vx', 'vy', 'fx', 'fy'].includes(key))
                .map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                  </li>
              ))}
            </ul>
            <button className="close-sidebar-btn" onClick={() => setSelectedNode(null)}>Close</button>
          </div>
        )}
        {selectedLink && (
          <div className="properties-sidebar">
            <h4>Link Properties</h4>
            <ul>
              {Object.entries(selectedLink)
                .filter(([key]) => !['index', 'x', 'y', 'vx', 'vy', 'fx', 'fy'].includes(key))
                .map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                  </li>
              ))}
            </ul>
            <button className="close-sidebar-btn" onClick={() => setSelectedLink(null)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphDisplay;