import { useTranslation } from 'react-i18next';
import './FilterTabs.css';

const FILTERS = [
  { key: 'top', label: 'filter_top' },
  { key: 'new', label: 'filter_new' },
  { key: 'free', label: 'filter_free' },
  { key: 'popular', label: 'filter_popular' },
];

export default function FilterTabs({ activeFilter, onFilterChange }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'he';

  return (
    <div className="filter-tabs" dir={isRtl ? 'rtl' : 'ltr'}>
      {FILTERS.map((f) => (
        <button
          key={f.key}
          className={`filter-tab ${activeFilter === f.key ? 'active' : ''}`}
          onClick={() => onFilterChange(f.key)}
        >
          {t(f.label)}
        </button>
      ))}
    </div>
  );
}
