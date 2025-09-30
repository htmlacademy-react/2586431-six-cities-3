import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app';
import { offers } from './mocks/offers';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

export const Setting = {
  placesCount: 312,
};

root.render(
  <React.StrictMode>
    <App placesCount={Setting.placesCount} offers={offers} />
  </React.StrictMode>
);
