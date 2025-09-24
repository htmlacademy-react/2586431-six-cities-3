import MainPage from '../pages/main-page/main-page';

type AppProps = {
  placesCount: number;
};

function App({ placesCount }: AppProps): JSX.Element {
  return <MainPage placesCount={placesCount} />;
}

export default App;
