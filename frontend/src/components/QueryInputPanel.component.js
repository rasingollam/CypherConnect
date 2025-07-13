import React from 'react';
import './QueryInputPanel.css';

const QueryInputPanel = ({
  query,
  queryType,
  onQueryChange,
  onQueryTypeChange,
  onRunQuery
}) => (
  <div className="query-input-panel">
    <textarea
      value={query}
      onChange={e => onQueryChange(e.target.value)}
      placeholder="Type your Cypher query here..."
      rows={4}
    />
    <div className="query-type-toggle">
      <button
        className={queryType === 'Read' ? 'active' : ''}
        onClick={() => onQueryTypeChange('Read')}
      >
        Read
      </button>
      <button
        className={queryType === 'Write' ? 'active' : ''}
        onClick={() => onQueryTypeChange('Write')}
      >
        Write
      </button>
      <button className="run-query-btn" onClick={onRunQuery}>
        Run Query
      </button>
    </div>
  </div>
);

export default QueryInputPanel;