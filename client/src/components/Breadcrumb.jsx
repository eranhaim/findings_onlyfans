import { useTranslation } from 'react-i18next';
import './Breadcrumb.css';

export default function Breadcrumb() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'he';

  return (
    <nav className="breadcrumb" dir={isRtl ? 'rtl' : 'ltr'}>
      <a href="#" className="breadcrumb-link">
        {t('breadcrumb_onlyfans')}
      </a>
      <span className="breadcrumb-sep">&gt;</span>
      <a href="#" className="breadcrumb-link active">
        {t('breadcrumb_featured')}
      </a>
    </nav>
  );
}
