import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { store, authActions } from '../store';
import { AppRoutes } from './routes';

function App(): JSX.Element {
  useEffect(() => {
    store.dispatch(authActions.checkAuth());
  }, []);
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
