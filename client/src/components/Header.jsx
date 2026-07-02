import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
import './Header.css';

export default function Header({ searchQuery, onSearchChange }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'he';

  return (
    <header className="header" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="header-inner">
        <div className="logo">
          <span className="logo-icon">❤</span>
          <span className="logo-text">{t('siteName')}</span>
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>
      </div>
    </header>
  );
}
