import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage-container">
      {/* SVG logo in right upper corner */}
      <div style={{
        position: 'absolute',
        top: 24,
        right: 32,
        zIndex: 10,
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Inline SVG, scaled down */}
        <svg width="38" height="38" viewBox="0 0 1165 1383" fill="none" xmlns="http://t.w3.org/2000/svg">
          <path d="M0 0 C0.97425934 -0.00315216 1.94851868 -0.00630432 2.95230103 -0.009552 ..."/>
          <path d="M0 0 C1.41249023 -0.01836914 1.41249023 -0.01836914 2.85351562 -0.03710938 ..."/>
          {/* ...all other <path> elements from your SVG file... */}
        </svg>
      </div>
      <div className="left-panel">
        {/* Remove logo area from left panel */}
        <div className="result-section">
          {/* Existing result section code */}
        </div>
        <div className="input-section">
          {/* Existing input section code */}
        </div>
      </div>
      <div className="right-panel">
        {/* Existing right panel code */}
      </div>
    </div>
  );
}

export default HomePage;