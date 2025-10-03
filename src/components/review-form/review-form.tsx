import { useState } from 'react';
import { RatingStar, TRatingValue } from '../rating-star/rating-star';

const RATING_VALUES: TRatingValue[] = [5, 4, 3, 2, 1];

const DEFAULT_FORM_DATA = {
  review: '',
} as TFormData;

type TFormData = {
  rating: TRatingValue;
  review: string;
};

export function ReviewForm(): JSX.Element {
  const [formData, setFormData] = useState<TFormData>(DEFAULT_FORM_DATA);

  const submit = () => {
    // eslint-disable-next-line no-console
    console.log(formData);
    setFormData(DEFAULT_FORM_DATA);
  };

  return (
    <form
      className="reviews__form form"
      onSubmit={(evt) => {
        evt.preventDefault();
        submit();
      }}
    >
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      <div className="reviews__rating-form form__rating">
        {RATING_VALUES.map((rating) => (
          <RatingStar
            key={rating}
            rating={rating}
            onChange={(value) => setFormData({ ...formData, rating: value })}
            value={formData.rating}
          />
        ))}
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        defaultValue={''}
        value={formData.review}
        onChange={(evt) => {
          setFormData({ ...formData, review: evt.target.value });
        }}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
          with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={false}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
