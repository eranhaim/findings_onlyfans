import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMousePointer, FaTimes } from 'react-icons/fa';
import './HoverHint.css';

export default function HoverHint() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'he';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('hover_hint_seen')) return;
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem('hover_hint_seen', '1');
  };

  if (!visible) return null;

  return (
    <div className="hover-hint-overlay" onClick={dismiss}>
      <div
        className="hover-hint-popup"
        dir={isRtl ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="hover-hint-close" onClick={dismiss}>
          <FaTimes />
        </button>
        <div className="hover-hint-animation">
          <div className="hover-hint-circle">
            <div className="hover-hint-play">▶</div>
          </div>
          <FaMousePointer className="hover-hint-cursor" />
        </div>
        <p className="hover-hint-text">{t('hoverHint')}</p>
      </div>
    </div>
  );
}
