import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './FilterTabs.css';

const FILTERS = [
  { key: 'top', label: 'filter_top' },
  { key: 'new', label: 'filter_new' },
  { key: 'free', label: 'filter_free' },
  { key: 'popular', label: 'filter_popular' },
  { key: 'near', label: 'filter_near', icon: true },
];

export default function FilterTabs({ activeFilter, onFilterChange, userCity }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'he';

  return (
    <div className="filter-tabs" dir={isRtl ? 'rtl' : 'ltr'}>
      {FILTERS.map((f) => (
        <button
          key={f.key}
          className={`filter-tab ${activeFilter === f.key ? 'active' : ''} ${f.key === 'near' ? 'near-tab' : ''}`}
          onClick={() => onFilterChange(f.key)}
        >
          {f.icon && <FaMapMarkerAlt className="near-icon" />}
          {t(f.label)}
          {f.key === 'near' && userCity && (
            <span className="near-city"> ({userCity})</span>
          )}
        </button>
      ))}
    </div>
  );
}
