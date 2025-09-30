import { Link } from 'react-router-dom';
import { TOffer } from '../../types/offer';

type PlaceCardProps = {
  offer: TOffer;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  viewMode?: 'cities' | 'favorites';
};

export function PlaceCard({
  offer,
  onMouseEnter,
  onMouseLeave,
  viewMode = 'cities',
}: PlaceCardProps): JSX.Element {
  return (
    <article
      className={`place-card ${viewMode}__card`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className={`${viewMode}__image-wrapper place-card__image-wrapper`}>
        <img
          className="place-card__image"
          src={offer.previewImage}
          width={viewMode === 'favorites' ? 150 : 260}
          height={viewMode === 'favorites' ? 110 : 200}
          alt="Place image"
        />
      </div>
      <div
        className={`place-card__info ${
          viewMode === 'favorites' ? 'favorites__card-info' : ''
        }`}
      >
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">€{offer.price}</b>
            <span className="place-card__price-text">/&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button button ${
              offer.isFavorite ? 'place-card__bookmark-button--active' : ''
            }`}
            type="button"
          >
            <svg className="place-card__bookmark-icon" width={18} height={19}>
              <use xlinkHref="#icon-bookmark" />
            </svg>
            <span className="visually-hidden">
              {offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${offer.rating * 20}%` }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
        </h2>
        <p className="place-card__type" style={{ textTransform: 'capitalize' }}>
          {offer.type}
        </p>
      </div>
    </article>
  );
}
