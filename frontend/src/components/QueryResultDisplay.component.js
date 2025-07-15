import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './QueryResultDisplay.css';

const renderGraph = (data, container) => {
  // Clear previous graph
  d3.select(container).selectAll('*').remove();

  // Basic graph data extraction
  const nodes = data.nodes || [];
  const links = data.relationships || [];

  if (!nodes.length || !links.length) return;

  const width = 340,
    height = 220;
  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const simulation = d3
    .forceSimulation(nodes)
    .force('link', d3.forceLink(links).id((d) => d.id).distance(60))
    .force('charge', d3.forceManyBody().strength(-120))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = svg
    .append('g')
    .attr('stroke', '#90caf9')
    .attr('stroke-width', 2)
    .selectAll('line')
    .data(links)
    .enter()
    .append('line');

  const node = svg
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', 16)
    .attr('fill', '#43a047');

  const label = svg
    .append('g')
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', 5)
    .attr('fill', '#fff')
    .attr('font-size', 13)
    .text((d) => d.label || d.id);

  simulation.on('tick', () => {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

    label.attr('x', (d) => d.x).attr('y', (d) => d.y);
  });
};

const QueryResultDisplay = ({ result }) => {
  const graphRef = useRef(null);

  // Render D3 graph if result has nodes/relationships
  useEffect(() => {
    if (
      result &&
      typeof result.result === 'object' &&
      result.result.nodes &&
      result.result.relationships
    ) {
      renderGraph(result.result, graphRef.current);
    }
  }, [result]);

  if (!result) return <div className="query-result-display">No results yet.</div>;
  if (result.error) return <div className="query-result-display error">❌ Error: {result.error}</div>;
  if (
    typeof result.result === 'object' &&
    result.result.nodes &&
    result.result.relationships
  ) {
    // Graph visualization + JSON
    return (
      <div className="query-result-display">
        <div ref={graphRef} style={{ marginBottom: 18 }} />
        <pre>{JSON.stringify(result.result, null, 2)}</pre>
      </div>
    );
  }
  if (typeof result.result === 'string')
    return <div className="query-result-display success">{result.result}</div>;
  if (Array.isArray(result.result) && result.result.length > 0) {
    // Render each row as JSON for now, to avoid object rendering errors
    return (
      <div className="query-result-display">
        {result.result.map((row, i) => (
          <pre key={i} style={{ background: 'none', color: '#fff', margin: 0 }}>
            {JSON.stringify(row, null, 2)}
          </pre>
        ))}
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