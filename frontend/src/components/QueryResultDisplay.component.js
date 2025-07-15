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

const renderGraph = (data, container, onNodeClick, onLinkClick) => {
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

  // Add a group for all elements to apply zoom to
  const g = svg.append("g");

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(60))
    .force('charge', d3.forceManyBody().strength(-120))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = g.append('g')
    .attr('stroke', '#90caf9')
    .attr('stroke-width', 2)
    .selectAll('line')
    .data(links)
    .join('line')
    .on('click', (event, d) => {
      event.stopPropagation();
      if (onNodeClick) onNodeClick(null);
      if (typeof onLinkClick === 'function') onLinkClick(d);
    });

  // Drag behavior for nodes
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

  const node = g.append('g')
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
    })
    .call(drag(simulation)); // Apply drag behavior

  const label = g.append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .attr('text-anchor', 'middle')
    .attr('dy', 5)
    .attr('fill', '#fff')
    .attr('font-size', 13)
    .style('cursor', 'pointer')
    .style('pointer-events', 'none') // So clicks pass through to the node
    .text(d => `${d.label} (${d.type})`);

  const linkLabels = g.append('g')
    .selectAll('text')
    .data(links)
    .join('text')
    .attr('text-anchor', 'middle')
    .attr('fill', '#ccc')
    .attr('font-size', 10)
    .style('pointer-events', 'none')
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

  // Zoom behavior
  const zoom = d3.zoom().on('zoom', (event) => {
    g.attr('transform', event.transform);
  });
  svg.call(zoom);
};

const QueryResultDisplay = ({ result }) => {
  const graphRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);

  useEffect(() => {
    setSelectedNode(null);
    setSelectedLink(null);
    if (
      result &&
      Array.isArray(result.result) &&
      result.result.length > 0
    ) {
      const d3Data = extractGraphElements(result.result);
      renderGraph(
        d3Data,
        graphRef.current,
        setSelectedNode,
        setSelectedLink
      );
    }
  }, [result]);

  if (!result) return <div className="query-result-display">No results yet.</div>;
  if (result.error) return <div className="query-result-display error">❌ Error: {result.error}</div>;

  if (Array.isArray(result.result) && result.result.length > 0) {
    return (
      <div className="query-result-display" style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div
            ref={graphRef}
            style={{
              width: '100%',
              height: '100%',
              minHeight: 0,
              minWidth: 0,
              flex: 1,
              position: 'relative'
            }}
            onClick={() => {
              setSelectedNode(null);
              setSelectedLink(null);
            }}
          />
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
            <h4>Relationship Properties</h4>
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