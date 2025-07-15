import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-cypher';
import 'prismjs/themes/prism-solarizedlight.css';

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
    <div className="editor-container">
      <Editor
        value={query}
        onValueChange={onQueryChange}
        highlight={code => highlight(code, languages.cypher, 'cypher')}
        placeholder="Type your Cypher query here..."
        padding={10}
        className="query-editor"
      />
    </div>
    <div className="query-controls">
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
      </div>
      <button className="run-query-btn" onClick={onRunQuery}>
        ▶ Run Query
      </button>
    </div>
  </div>
);

export default QueryInputPanel;