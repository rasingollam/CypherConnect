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
    <label className="query-label">Cypher Query</label>
    <textarea
      value={query}
      onChange={e => onQueryChange(e.target.value)}
      placeholder="Type your Cypher query here..."
      rows={5}
      className="query-textarea"
    />
    <div className="query-type-toggle">
      <button
        className={queryType === 'Read' ? 'active' : ''}
        onClick={() => onQueryTypeChange('Read')}
        title="Read queries (MATCH, RETURN, etc.)"
      >
        Read
      </button>
      <button
        className={queryType === 'Write' ? 'active' : ''}
        onClick={() => onQueryTypeChange('Write')}
        title="Write queries (CREATE, MERGE, DELETE, etc.)"
      >
        Write
      </button>
      <button className="run-query-btn" onClick={onRunQuery}>
        ▶ Run Query
      </button>
    </div>
  </div>
);

export default QueryInputPanel;