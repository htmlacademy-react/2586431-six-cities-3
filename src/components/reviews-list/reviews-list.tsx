import { ReviewsItem } from '../reviews-item/reviews-item';

export function ReviewsList(): JSX.Element {
  const count = 3;
  return (
    <>
      <h2 className="reviews__title">
        Reviews · <span className="reviews__amount">{count}</span>
      </h2>
      <ul className="reviews__list">
        {Array.from({ length: count }, (_, index) => index).map((id) => (
          <ReviewsItem key={id} />
        ))}
      </ul>
    </>
  );
}
