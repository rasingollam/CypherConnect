import React from 'react';
import './QueryResultDisplay.css';

const QueryResultDisplay = ({ result }) => {
  if (!result) return <div className="query-result-display">No results yet.</div>;
  if (result.error) return <div className="query-result-display error">❌ Error: {result.error}</div>;
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