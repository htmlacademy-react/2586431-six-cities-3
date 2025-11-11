import { ReviewForm } from '../../components/review-form/review-form';
import { ReviewsList } from '../../components/reviews-list/reviews-list';
import Map from '../../components/map/map';
import { OffersList } from '../../components/offers-list/offers-list';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../types/state';
import { offerDetailsActions, offersActions } from '../../store';
import { store } from '../../store';
import { Spinner } from '../../components/spinner/spinner';
import { NotFoundPage } from '../404-page/404-page';
import { AuthorizationStatus } from '../../constants';

type OfferPageParams = { id: string };

function OfferPage(): JSX.Element {
  const { id } = useParams<OfferPageParams>();
  const auth = useSelector((state: State) => state.auth.status);
  const offer = useSelector((state: State) => state.offerDetails.current);
  const offerLoading = useSelector(
    (state: State) => state.offerDetails.currentLoading
  );
  const offersNearby = useSelector((state: State) => state.offers.nearby);
  const offersNearbyLoading = useSelector(
    (state: State) => state.offers.nearbyLoading
  );

  useEffect(() => {
    if (!id) {
      // такого быть никогда не должно, но всё же
      return;
    }
    store.dispatch(offerDetailsActions.fetchById(id));
    store.dispatch(offersActions.fetchNearby(id));
  }, [id]);

  if (offerLoading || offersNearbyLoading) {
    return <Spinner />;
  }

  if (!offer) {
    return <NotFoundPage />;
  }

  return (
    <div className="page">
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer.images.map((image) => (
                <div
                  className="offer__image-wrapper"
                  key={`${offer.id}-${image}`}
                >
                  <img
                    className="offer__image"
                    src={image}
                    alt="Photo studio"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              <div className="offer__mark">
                <span>{offer.isPremium ? 'Premium' : ''}</span>
              </div>
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer.title}</h1>
                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width={31} height={33}>
                    <use xlinkHref="#icon-bookmark" />
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${offer.rating * 20}%` }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {offer.rating}
                </span>
              </div>
              <ul className="offer__features">
                <li
                  className="offer__feature offer__feature--entire"
                  style={{ textTransform: 'capitalize' }}
                >
                  {offer.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offer.bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offer.maxAdults} adults
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">€{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offer.goods.map((good) => (
                    <li className="offer__inside-item" key={good}>
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img
                      className="offer__avatar user__avatar"
                      src={offer.host.avatarUrl}
                      width={74}
                      height={74}
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{offer.host.name}</span>
                  <span className="offer__user-status">
                    {offer.host.isPro ? 'Pro' : ''}
                  </span>
                </div>
                <div className="offer__description">
                  <p className="offer__text">{offer.description}</p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <ReviewsList offerId={offer.id} />
                {auth === AuthorizationStatus.Auth && (
                  <ReviewForm offerId={offer.id} />
                )}
              </section>
            </div>
          </div>
          <Map
            centerLocation={offer.location}
            offers={offersNearby}
            selectedOfferId={offer.id}
            className="offer__map"
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <OffersList offers={offersNearby} viewMode="near-places" />
          </section>
        </div>
      </main>
    </div>
  );
}

export { OfferPage };
