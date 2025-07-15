import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './QueryResultDisplay.css';

function extractGraphElements(records) {
  const nodesMap = new Map();
  const relsMap = new Map();

  function addNode(node) {
    if (
      node &&
      node.elementId &&
      node.labels &&
      !nodesMap.has(node.elementId)
    ) {
      nodesMap.set(node.elementId, {
        id: node.elementId,
        label: node.properties?.name || (node.labels ? node.labels[0] : 'Node'),
        type: node.labels ? node.labels[0] : 'Node',
        ...node.properties,
      });
    }
  }

  function addRel(rel) {
    if (
      rel &&
      rel.elementId &&
      rel.type &&
      rel.startNodeElementId &&
      rel.endNodeElementId &&
      !relsMap.has(rel.elementId)
    ) {
      relsMap.set(rel.elementId, {
        id: rel.elementId,
        source: rel.startNodeElementId,
        target: rel.endNodeElementId,
        label: rel.type,
      });
    }
  }

  function handleValue(val) {
    if (!val) return;
    // Node
    if (val.elementId && val.labels) {
      addNode(val);
    }
    // Relationship
    else if (val.elementId && val.type && val.startNodeElementId && val.endNodeElementId) {
      addRel(val);
    }
    // Path (for path queries)
    else if (val.segments) {
      val.segments.forEach(seg => {
        addNode(seg.start);
        addNode(seg.end);
        addRel(seg.relationship);
      });
    }
    // Array of nodes/relationships/paths
    else if (Array.isArray(val)) {
      val.forEach(handleValue);
    }
    // Object with nested values
    else if (typeof val === 'object') {
      Object.values(val).forEach(handleValue);
    }
  }

  records.forEach(row => {
    Object.values(row).forEach(handleValue);
  });

  return {
    nodes: Array.from(nodesMap.values()),
    links: Array.from(relsMap.values()),
  };
}

const renderGraph = (data, container, onNodeClick) => {
  d3.select(container).selectAll('*').remove();

  const nodes = data.nodes || [];
  const links = data.links || [];

  if (!nodes.length) return;

  const width = container.clientWidth || 340;
  const height = container.clientHeight || 220;
  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height]);

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(60))
    .force('charge', d3.forceManyBody().strength(-120))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = svg.append('g')
    .attr('stroke', '#90caf9')
    .attr('stroke-width', 2)
    .selectAll('line')
    .data(links)
    .join('line');

  const node = svg.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 16)
    .attr('fill', d => d.type === 'Person' ? '#e91e63' : (d.type === 'City' ? '#2196f3' : '#43a047'))
    .on('click', (event, d) => {
      event.stopPropagation();
      if (onNodeClick) onNodeClick(d);
    });

  const label = svg.append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .attr('text-anchor', 'middle')
    .attr('dy', 5)
    .attr('fill', '#fff')
    .attr('font-size', 13)
    .style('cursor', 'pointer')
    .text(d => `${d.label} (${d.type})`)
    .on('click', (event, d) => {
      event.stopPropagation();
      if (onNodeClick) onNodeClick(d);
    });

  const linkLabels = svg.append('g')
    .selectAll('text')
    .data(links)
    .join('text')
    .attr('text-anchor', 'middle')
    .attr('fill', '#ccc')
    .attr('font-size', 10)
    .text(d => d.label);

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr('cx', d => d.x).attr('cy', d => d.y);
    label.attr('x', d => d.x).attr('y', d => d.y);
    linkLabels
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2);
  });
};

const QueryResultDisplay = ({ result }) => {
  const graphRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    setSelectedNode(null); // Clear selection on new result
    if (
      result &&
      Array.isArray(result.result) &&
      result.result.length > 0
    ) {
      const d3Data = extractGraphElements(result.result);
      renderGraph(d3Data, graphRef.current, setSelectedNode);
    }
  }, [result]);

  if (!result) return <div className="query-result-display">No results yet.</div>;
  if (result.error) return <div className="query-result-display error">❌ Error: {result.error}</div>;

  if (Array.isArray(result.result) && result.result.length > 0) {
    return (
      <div className="query-result-display" style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div ref={graphRef} style={{ marginBottom: 18 }} />
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
      </div>
    );
  }
  // Fallback for other types
  return (
    <div className="query-result-display">
      <pre>{JSON.stringify(result.result, null, 2)}</pre>
    </div>
  );
};

export default QueryResultDisplay;