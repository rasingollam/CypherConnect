import React from 'react';
import './QueryResultDisplay.css';

const QueryResultDisplay = ({ result }) => {
  if (!result) return <div className="query-result-display">No results yet.</div>;
  if (result.error) return <div className="query-result-display error">❌ Error: {result.error}</div>;
  if (typeof result.result === 'string')
    return <div className="query-result-display success">{result.result}</div>;
  if (Array.isArray(result.result) && result.result.length > 0) {
    const keys = Object.keys(result.result[0]);
    return (
      <div className="query-result-display">
        <table>
          <thead>
            <tr>
              {keys.map(k => <th key={k}>{k}</th>)}
            </tr>
          </thead>
          <tbody>
            {result.result.map((row, i) => (
              <tr key={i}>
                {keys.map(k => <td key={k}>{row[k]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="query-result-display">
      <pre>{JSON.stringify(result.result, null, 2)}</pre>
    </div>
  );
};

export default QueryResultDisplay;