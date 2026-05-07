import React from 'react';
import ReactDOM from 'react-dom/client';
import SimpleApp from './app-simple';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <SimpleApp />
    </React.StrictMode>
  );
}
