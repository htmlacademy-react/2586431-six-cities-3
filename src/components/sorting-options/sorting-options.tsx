import { useMemo, useState } from 'react';
import { SORTING_OPTIONS, USortingOptionValue } from '../../constants';
import { useSelector } from 'react-redux';
import { State } from '../../types/state';
import { store, filtersActions } from '../../store';

export const SortingOptions = () => {
  const [open, setOpen] = useState(false);
  const sort = useSelector((state: State) => state.filters.sort);
  const handleOptionClick = (optionValue: USortingOptionValue) => {
    store.dispatch(filtersActions.changeSort(optionValue));
    setOpen(false);
  };

  const selectedOptionLabel = useMemo(
    () => SORTING_OPTIONS.find((option) => option.value === sort)?.label,
    [sort]
  );

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      &nbsp;
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setOpen(!open)}
      >
        {selectedOptionLabel}
        <svg className="places__sorting-arrow" width={7} height={4}>
          <use xlinkHref="#icon-arrow-select" />
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${
          open ? 'places__options--opened' : ''
        }`}
      >
        {SORTING_OPTIONS.map((option) => (
          <li
            className={`places__option ${
              sort === option.value ? 'places__option--active' : ''
            }`}
            key={option.value}
            tabIndex={0}
            onClick={() => handleOptionClick(option.value)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </form>
  );
};
