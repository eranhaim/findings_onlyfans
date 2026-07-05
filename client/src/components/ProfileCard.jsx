import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaCamera, FaVideo, FaTag, FaTelegram } from 'react-icons/fa';
import { IoTrendingUp } from 'react-icons/io5';
import './ProfileCard.css';

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(num >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export default function ProfileCard({ profile }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'he';
  const lang = i18n.language;
  const bio = profile.bio?.[lang] || profile.bio?.en || '';

  const [hovering, setHovering] = useState(false);
  const videoRef = useRef(null);

  const avatarSrc = profile.avatarThumbUrl || profile.avatarUrl || '';
  const videoSrc = profile.previewVideoUrl || '';
  const videoPoster = profile.previewVideoThumbUrl || '';

  const telegramLink = profile.socialLinks?.telegram || '';
  const onlyfansLink = profile.onlyfansLink || '';

  const handleMouseEnter = () => {
    if (videoSrc) {
      setHovering(true);
      videoRef.current?.play()?.catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="profile-card" dir={isRtl ? 'rtl' : 'ltr'}>
      <div
        className="profile-card-avatar"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={avatarSrc || 'https://i.pravatar.cc/100'}
          alt={profile.name}
          className={hovering && videoSrc ? 'hidden' : ''}
          loading="lazy"
        />
        {videoSrc && (
          <video
            ref={videoRef}
            className={`preview-video ${hovering ? 'visible' : ''}`}
            src={videoSrc}
            poster={videoPoster || undefined}
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
      </div>
      <div className="profile-card-info">
        <div className="profile-card-header">
          <span className="profile-name">{profile.name}</span>
          {profile.isOnline && (
            <span className="online-badge">🟢 {t('online')} 🟢</span>
          )}
          <span className="profile-divider">|</span>
          <span className="profile-gt">&gt;</span>
          <span className="profile-username">{profile.username}</span>
        </div>

        <div className="profile-card-meta">
          {profile.isNewModel && (
            <span className="badge badge-new">
              <IoTrendingUp /> {t('new')}
            </span>
          )}
          <span className="stat">
            <FaHeart className="stat-icon heart" />
            {formatNumber(profile.likes)}
          </span>
          <span className="stat">
            <FaCamera className="stat-icon" />
            {profile.photos}
          </span>
          <span className="stat">
            <FaVideo className="stat-icon" />
            {profile.videos}
          </span>
          {profile.isFree ? (
            <span className="badge badge-free">
              <FaTag /> {t('free')}
            </span>
          ) : (
            <span className="price">
              <FaTag className="stat-icon" /> ${profile.price.toFixed(2)}
            </span>
          )}
        </div>

        {bio && <p className="profile-card-bio">{bio}</p>}

        <div className="profile-card-actions">
          {onlyfansLink && (
            <a
              href={onlyfansLink}
              target="_blank"
              rel="noreferrer"
              className="profile-cta cta-onlyfans"
            >
              <span className="cta-icon">🔥</span> {t('ctaOnlyfans')}
            </a>
          )}
          {telegramLink && (
            <a
              href={telegramLink}
              target="_blank"
              rel="noreferrer"
              className="profile-cta cta-telegram"
            >
              <FaTelegram className="cta-icon" /> {t('ctaTelegram')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
