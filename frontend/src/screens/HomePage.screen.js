import React, { useState } from 'react';
import QueryInputPanel from '../components/QueryInputPanel.component';
import QueryResultDisplay from '../components/QueryResultDisplay.component';
import GraphDisplay from '../components/GraphDisplay.component';
import './HomePage.css';

// Placeholder for backend integration
const executeCypherQuery = async (query, queryType) => {
  // Simulate API call
  // Replace with actual fetch/axios call to backend
  if (!query) return { success: false, error: 'No query provided' };
  if (queryType === 'Read') {
    // Simulate read result
    return {
      success: true,
      result: [
        { name: 'Alice', age: 24 },
        { name: 'Bob', age: 30 }
      ],
      graph: {
        nodes: [
          { id: 1, label: 'Person', properties: { name: 'Alice', age: 24 } },
          { id: 2, label: 'Person', properties: { name: 'Bob', age: 30 } }
        ],
        edges: [
          { from: 1, to: 2, label: 'KNOWS' }
        ]
      }
    };
  } else {
    // Simulate write result
    return { success: true, result: 'Write query executed successfully.' };
  }
};

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState('Read');
  const [result, setResult] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  const handleQueryChange = (val) => setQuery(val);
  const handleQueryTypeChange = (type) => setQueryType(type);

  const handleRunQuery = async () => {
    const res = await executeCypherQuery(query, queryType);
    setResult(res);
    if (res.graph) setGraphData(res.graph);
  };

  return (
    <div className="homepage-container">
      <div className="left-panel">
        <QueryResultDisplay result={result} />
        <QueryInputPanel
          query={query}
          queryType={queryType}
          onQueryChange={handleQueryChange}
          onQueryTypeChange={handleQueryTypeChange}
          onRunQuery={handleRunQuery}
        />
      </div>
      <div className="right-panel">
        <GraphDisplay graphData={graphData} />
      </div>
    </div>
  );
};

export default HomePage;