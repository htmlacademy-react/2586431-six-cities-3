const RATING_TITLES: Record<TRatingValue, string> = {
  5: 'perfect',
  4: 'good',
  3: 'not bad',
  2: 'badly',
  1: 'terribly',
};

export type TRatingValue = 1 | 2 | 3 | 4 | 5;

type TRatingStarProps = {
  value: TRatingValue;
  onChange: (value: TRatingValue) => void;
  rating: TRatingValue;
  disabled?: boolean;
};

export const RatingStar = ({
  value,
  onChange,
  rating,
  disabled,
}: TRatingStarProps) => (
  <>
    <input
      className="form__rating-input visually-hidden"
      name="rating"
      value={value}
      onClick={() => {
        onChange(rating);
      }}
      checked={value >= rating}
      id={`${rating}-stars`}
      type="checkbox"
      disabled={disabled}
    />
    <label
      htmlFor={`${rating}-stars`}
      className="reviews__rating-label form__rating-label"
      title={RATING_TITLES[rating]}
    >
      <svg className="form__star-image" width={37} height={33}>
        <use xlinkHref="#icon-star" />
      </svg>
    </label>
  </>
);
