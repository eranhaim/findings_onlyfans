import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import FilterTabs from '../components/FilterTabs';
import ProfileCard from '../components/ProfileCard';
import { fetchProfiles, detectLanguage, detectLocation } from '../api';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('top');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userLocation, setUserLocation] = useState(null);

  const isRtl = i18n.language === 'he';

  useEffect(() => {
    detectLanguage().then((lang) => {
      if (['en', 'he', 'fr'].includes(lang)) {
        i18n.changeLanguage(lang);
      }
    });
    detectLocation().then((loc) => {
      setUserLocation(loc);
    });
  }, [i18n]);

  const loadProfiles = useCallback(async (filter, search, pageNum, location) => {
    setLoading(true);
    try {
      const params = {
        category: filter,
        search: search || undefined,
        page: pageNum,
        limit: 20,
      };

      if (filter === 'near' && location) {
        const searchTerms = [location.city, location.region, location.country].filter(Boolean);
        if (searchTerms.length > 0) {
          params.location = searchTerms[0];
        }
      }

      const data = await fetchProfiles(params);
      if (pageNum === 1) {
        setProfiles(data.profiles);
      } else {
        setProfiles((prev) => [...prev, ...data.profiles]);
      }
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to load profiles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    loadProfiles(activeFilter, searchQuery, 1, userLocation);
  }, [activeFilter, searchQuery, loadProfiles, userLocation]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadProfiles(activeFilter, searchQuery, nextPage, userLocation);
  };

  const pageTitle = activeFilter === 'near'
    ? t('nearYouTitle')
    : t('pageTitle');

  return (
    <div className="app" dir={isRtl ? 'rtl' : 'ltr'}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="main-content">
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          userCity={userLocation?.city || ''}
        />
        <Breadcrumb />

        <h1 className="page-title">{pageTitle}</h1>

        <div className="profiles-list">
          {loading && profiles.length === 0 ? (
            <div className="loading">
              {activeFilter === 'near' ? t('detectingLocation') : t('loading')}
            </div>
          ) : profiles.length === 0 ? (
            <div className="no-results">
              {activeFilter === 'near' ? t('noResultsNear') : t('noResults')}
            </div>
          ) : (
            profiles.map((profile) => (
              <ProfileCard key={profile._id} profile={profile} />
            ))
          )}
        </div>

        {!loading && page < totalPages && (
          <div className="load-more-container">
            <button className="load-more-btn" onClick={handleLoadMore}>
              {t('loadMore')}
            </button>
          </div>
        )}

        {loading && profiles.length > 0 && (
          <div className="loading">{t('loading')}</div>
        )}
      </main>
    </div>
  );
}
