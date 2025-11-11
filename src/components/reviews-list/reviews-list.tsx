import { useSelector } from 'react-redux';
import { ReviewsItem } from '../reviews-item';
import { State } from '../../types/state';
import { useEffect, useMemo } from 'react';
import { store, reviewsActions } from '../../store';
import { Spinner } from '../spinner';
import { MAX_REVIEWS_COUNT } from '../../constants';

export function ReviewsList({ offerId }: { offerId: string }): JSX.Element {
  const reviews = useSelector((state: State) => state.reviews.list);
  const reviewsSlice = useMemo(
    () => reviews?.slice(0, MAX_REVIEWS_COUNT) ?? [],
    [reviews]
  );
  const reviewsCount = reviews?.length ?? 0;
  const reviewsLoading = useSelector(
    (state: State) => state.reviews.listLoading
  );
  useEffect(() => {
    store.dispatch(reviewsActions.fetchList(offerId));
  }, [offerId]);

  if (reviewsLoading) {
    return <Spinner />;
  }

  return (
    <>
      <h2 className="reviews__title">
        Reviews · <span className="reviews__amount">{reviewsCount}</span>
      </h2>
      <ul className="reviews__list">
        {reviewsSlice.map((review) => (
          <ReviewsItem key={review.id} review={review} />
        ))}
      </ul>
    </>
  );
}
