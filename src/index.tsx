import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const Setting = {
  placesCount: 312,
};

root.render(
  <React.StrictMode>
    <App placesCount={Setting.placesCount} />
  </React.StrictMode>
);
