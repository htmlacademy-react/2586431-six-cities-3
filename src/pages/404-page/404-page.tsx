import { Link } from 'react-router-dom';
import './404-page.css';

export function NotFoundPage(): JSX.Element {
  return (
    <div className="page">
      <main className="page__main">
        <div className="container">
          <section className="not-found">
            <h1 className="not-found__title">404</h1>
            <p className="not-found__text">Page not found</p>
            <p className="not-found__description">
              The page you are looking for doesn&apos;t exist or has been moved.
            </p>
            <Link to="/" className="not-found__link button">
              Go to main page
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
