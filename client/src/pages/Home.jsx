import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import FilterTabs from '../components/FilterTabs';
import ProfileCard from '../components/ProfileCard';
import { fetchProfiles, detectLanguage } from '../api';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('top');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isRtl = i18n.language === 'he';

  useEffect(() => {
    detectLanguage().then((lang) => {
      if (['en', 'he', 'fr'].includes(lang)) {
        i18n.changeLanguage(lang);
      }
    });
  }, [i18n]);

  const loadProfiles = useCallback(async (filter, search, pageNum) => {
    setLoading(true);
    try {
      const data = await fetchProfiles({
        category: filter,
        search: search || undefined,
        page: pageNum,
        limit: 20,
      });
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
    loadProfiles(activeFilter, searchQuery, 1);
  }, [activeFilter, searchQuery, loadProfiles]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadProfiles(activeFilter, searchQuery, nextPage);
  };

  const today = new Date().toLocaleDateString(
    i18n.language === 'he' ? 'he-IL' : i18n.language === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="app" dir={isRtl ? 'rtl' : 'ltr'}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="main-content">
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <Breadcrumb />

        <h1 className="page-title">{t('pageTitle')}</h1>
        <p className="last-updated">
          {t('lastUpdated')} {today}
        </p>

        <div className="profiles-list">
          {loading && profiles.length === 0 ? (
            <div className="loading">{t('loading')}</div>
          ) : profiles.length === 0 ? (
            <div className="no-results">{t('noResults')}</div>
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
