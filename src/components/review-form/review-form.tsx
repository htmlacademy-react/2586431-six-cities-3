import { useMemo, useState } from 'react';
import { RatingStar, TRatingValue } from '../rating-star';
import { useSelector } from 'react-redux';
import { State } from '../../types/state';
import { store, reviewsActions } from '../../store';
import { MAX_COMMENT_LENGTH, MIN_COMMENT_LENGTH } from '../../constants';

const RATING_VALUES: TRatingValue[] = [5, 4, 3, 2, 1];

const DEFAULT_FORM_DATA = {
  comment: '',
} as TFormData;

type TFormData = {
  rating: TRatingValue;
  comment: string;
};

export function ReviewForm({ offerId }: { offerId: string }): JSX.Element {
  const [formData, setFormData] = useState<TFormData>(DEFAULT_FORM_DATA);
  const postReviewLoading = useSelector(
    (state: State) => state.reviews.postNewLoading
  );
  const submit = () => {
    store
      .dispatch(reviewsActions.postNew({ offerId, ...formData }))
      .unwrap()
      .then(() => {
        setFormData(DEFAULT_FORM_DATA);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error posting review:', error);
      });
  };
  const isValid = useMemo(
    () =>
      formData.comment.length >= MIN_COMMENT_LENGTH &&
      formData.comment.length <= MAX_COMMENT_LENGTH &&
      formData.rating > 0,
    [formData]
  );

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
            disabled={postReviewLoading}
          />
        ))}
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        defaultValue={''}
        value={formData.comment}
        minLength={MIN_COMMENT_LENGTH}
        maxLength={MAX_COMMENT_LENGTH}
        required
        onChange={(evt) => {
          setFormData({ ...formData, comment: evt.target.value });
        }}
        disabled={postReviewLoading}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
          with at least{' '}
          <b className="reviews__text-amount">
            {MIN_COMMENT_LENGTH} characters
          </b>
          .
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={postReviewLoading || !isValid}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
