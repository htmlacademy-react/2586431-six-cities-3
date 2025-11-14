import { useSelector } from 'react-redux';
import { State } from '../../types/state';
import { store } from '../../store';
import { filtersActions } from '../../store/filters';

const CityItem = ({ city }: { city: string }) => {
  const isActive = useSelector((state: State) => state.filters.city === city);
  const handleCityChange = () => {
    store.dispatch(filtersActions.changeCity(city));
  };

  return (
    <li className="locations__item">
      <a
        className={`locations__item-link tabs__item ${
          isActive ? 'tabs__item--active' : ''
        }`}
        onClick={handleCityChange}
      >
        <span>{city}</span>
      </a>
    </li>
  );
};

export default CityItem;
