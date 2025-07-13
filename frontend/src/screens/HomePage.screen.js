import React, { useState } from 'react';
import QueryInputPanel from '../components/QueryInputPanel.component';
import QueryResultDisplay from '../components/QueryResultDisplay.component';
import GraphDisplay from '../components/GraphDisplay.component';
import { writeCypherQuery, readCypherQuery } from '../services/Cypher.service';
import './HomePage.css';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState('Read');
  const [result, setResult] = useState(null);

  const handleRunQuery = async () => {
    let res;
    if (queryType === 'Read') {
      res = await readCypherQuery(query);
    } else {
      res = await writeCypherQuery(query);
    }
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
            queryType={queryType}
            onQueryChange={setQuery}
            onQueryTypeChange={setQueryType}
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