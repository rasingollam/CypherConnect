import React, { useState } from 'react';
import QueryInputPanel from '../components/QueryInputPanel.component';
import QueryResultDisplay from '../components/QueryResultDisplay.component';
import GraphDisplay from '../components/GraphDisplay.component';
import { writeCypherQuery } from '../services/Cypher.service';
import './HomePage.css';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleQueryChange = (val) => setQuery(val);

  const handleRunQuery = async () => {
    // Only handle write queries here
    const res = await writeCypherQuery(query);
    setResult(res);
  };

  return (
    <div className="homepage-container">
      <div className="left-panel">
        <div className="result-section">
          <QueryResultDisplay result={result} />
        </div>
        <div className="input-section">
          <QueryInputPanel
            query={query}
            queryType="Write"
            onQueryChange={handleQueryChange}
            onQueryTypeChange={() => {}} // Not needed for now
            onRunQuery={handleRunQuery}
          />
        </div>
      </div>
      <div className="right-panel">
        <GraphDisplay />
      </div>
    </div>
  );
};

export default HomePage;