import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { ReviewForm } from '../review-form';
import { State } from '../../../types/state';
import { store } from '../../../store';

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(() => ({ unwrap: () => Promise.resolve() })),
}));

vi.mock('../../../store', async () => {
  const actual = await vi.importActual<typeof import('../../../store')>(
    '../../../store'
  );
  return {
    ...actual,
    store: {
      dispatch: mocks.dispatch,
    },
  };
});

const dispatchRejected = () => ({ unwrap: () => Promise.reject() });

describe('ReviewForm', () => {
  const mockStoreCreator = configureMockStore<State>();

  const renderWithProviders = (component: JSX.Element) => {
    const mockStore = mockStoreCreator({
      reviews: {
        list: [],
        listLoading: false,
        postNewLoading: false,
      },
    });

    return render(<Provider store={mockStore}>{component}</Provider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form correctly', () => {
    renderWithProviders(<ReviewForm offerId="1" />);

    expect(screen.getByLabelText('Your review')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        'Tell how was your stay, what you like and what can be improved'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should render all rating stars', () => {
    renderWithProviders(<ReviewForm offerId="1" />);

    const ratingInputs = screen.getAllByRole('checkbox');
    expect(ratingInputs).toHaveLength(5);
  });

  it('should disable submit button when form is invalid', () => {
    renderWithProviders(<ReviewForm offerId="1" />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm offerId="1" />);

    const ratingInputs = screen.getAllByRole('checkbox');
    await user.click(ratingInputs[0]);

    const textarea = screen.getByRole('textbox');
    await user.type(
      textarea,
      'This is a very detailed review with more than fifty characters to meet the minimum requirement.'
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).not.toBeDisabled();
  });

  it('should call onChange when rating is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm offerId="1" />);

    const ratingInputs = screen.getAllByRole('checkbox');
    await user.click(ratingInputs[2]);

    const textarea = screen.getByRole('textbox');
    await user.type(
      textarea,
      'This is a very detailed review with more than fifty characters to meet the minimum requirement.'
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).not.toBeDisabled();
  });

  it('should update textarea value when typing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm offerId="1" />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Test comment');

    expect(textarea).toHaveValue('Test comment');
  });

  it('should dispatch postNew action on form submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm offerId="1" />);

    const ratingInputs = screen.getAllByRole('checkbox');
    await user.click(ratingInputs[0]);

    const textarea = screen.getByRole('textbox');
    const comment =
      'This is a very detailed review with more than fifty characters to meet the minimum requirement.';
    await user.type(textarea, comment);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm offerId="1" />);

    const ratingInputs = screen.getAllByRole('checkbox');
    const comment =
      'This is a very detailed review with more than fifty characters to meet the minimum requirement.';
    await user.click(ratingInputs[0]);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, comment);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(store.dispatch).toHaveBeenCalled();
    expect(textarea).toHaveValue('');
  });

  it('should not reset form after failed submission', async () => {
    mocks.dispatch.mockImplementationOnce(() => dispatchRejected());
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm offerId="1" />);

    const ratingInputs = screen.getAllByRole('checkbox');
    const comment =
      'This is a very detailed review with more than fifty characters to meet the minimum requirement.';
    await user.click(ratingInputs[0]);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, comment);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);
    expect(store.dispatch).toHaveBeenCalledOnce();
    expect(textarea).toHaveValue(comment);
  });

  it('should disable submit button when postNewLoading is true', () => {
    const loadingStore = mockStoreCreator({
      reviews: {
        list: [],
        listLoading: false,
        postNewLoading: true,
      },
    });

    render(
      <Provider store={loadingStore}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();
  });

  it('should not allow submission with comment less than 50 characters', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm offerId="1" />);

    const ratingInputs = screen.getAllByRole('checkbox');
    await user.click(ratingInputs[0]);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Short comment');

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();
  });

  it('should not allow submission without rating', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm offerId="1" />);

    const textarea = screen.getByRole('textbox');
    await user.type(
      textarea,
      'This is a very detailed review with more than fifty characters to meet the minimum requirement.'
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();
  });
});
