import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { SortingOptions } from '../sorting-options';
import { State } from '../../../types/state';
import { SORTING_OPTIONS, USortingOptionValue } from '../../../constants';
import { store } from '../../../store';

vi.mock('../../../store', async () => {
  const actual = await vi.importActual<typeof import('../../../store')>(
    '../../../store'
  );
  const mockDispatch = vi.fn();
  return {
    ...actual,
    store: {
      dispatch: mockDispatch,
    },
  };
});

describe('SortingOptions', () => {
  const mockStoreCreator = configureMockStore<State>();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (sort: USortingOptionValue = 'popular') => {
    const mockStore = mockStoreCreator({
      filters: {
        city: 'Paris',
        sort,
      },
    });

    return render(
      <Provider store={mockStore}>
        <SortingOptions />
      </Provider>
    );
  };

  it('should render correctly', () => {
    const { container } = renderWithProviders();

    expect(screen.getByText('Sort by')).toBeInTheDocument();
    const sortType = container.querySelector('.places__sorting-type');
    expect(sortType).toHaveTextContent('Popular');
  });

  it('should display current sort option', () => {
    const { container } = renderWithProviders('price-low-to-high');

    const sortType = container.querySelector('.places__sorting-type');
    expect(sortType).toHaveTextContent('Price: low to high');
  });

  it('should toggle dropdown when clicking on sort type', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders();

    const sortType = container.querySelector(
      '.places__sorting-type'
    ) as HTMLElement;
    const optionsList = container.querySelector('.places__options');

    expect(optionsList).not.toHaveClass('places__options--opened');

    await user.click(sortType);
    expect(optionsList).toHaveClass('places__options--opened');

    await user.click(sortType);
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should render all sorting options', () => {
    renderWithProviders();

    SORTING_OPTIONS.forEach((option) => {
      const options = screen.getAllByText(option.label);
      expect(options.length).toBeGreaterThan(0);
    });
  });

  it('should mark active option', () => {
    const { container } = renderWithProviders('price-high-to-low');

    const activeOption = container.querySelector('.places__option--active');
    expect(activeOption).toBeInTheDocument();
    expect(activeOption).toHaveTextContent('Price: high to low');
  });

  it('should dispatch changeSort action when option is clicked', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders();

    const sortType = container.querySelector(
      '.places__sorting-type'
    ) as HTMLElement;
    await user.click(sortType);

    const options = screen.getAllByText('Price: low to high');
    const listOption = options.find((el) => el.closest('.places__option'));
    if (listOption) {
      await user.click(listOption);
    }

    expect(store.dispatch).toHaveBeenCalledOnce();
    const optionsList = container.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should close dropdown after selecting an option', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders();

    const sortType = container.querySelector(
      '.places__sorting-type'
    ) as HTMLElement;
    await user.click(sortType);

    const optionsList = container.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');

    const options = screen.getAllByText('Top rated first');
    const listOption = options.find((el) => el.closest('.places__option'));
    if (listOption) {
      await user.click(listOption);
    }

    expect(store.dispatch).toHaveBeenCalledOnce();
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should display correct label for each sort value', () => {
    SORTING_OPTIONS.forEach((option) => {
      const { container } = renderWithProviders(option.value);
      const sortType = container.querySelector('.places__sorting-type');
      expect(sortType).toHaveTextContent(option.label);
    });
  });
});
