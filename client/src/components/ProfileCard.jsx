import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaCamera, FaVideo, FaTag } from 'react-icons/fa';
import { IoTrendingUp } from 'react-icons/io5';
import { getS3Url } from '../api';
import './ProfileCard.css';

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(num >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

function resolveUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return getS3Url(url);
}

export default function ProfileCard({ profile }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'he';
  const lang = i18n.language;
  const bio = profile.bio?.[lang] || profile.bio?.en || '';

  const [hovering, setHovering] = useState(false);
  const videoRef = useRef(null);

  const avatarUrl = resolveUrl(profile.avatar);
  const previewVideoUrl = resolveUrl(profile.previewVideo);

  const handleMouseEnter = () => {
    if (previewVideoUrl) {
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
          src={avatarUrl || 'https://i.pravatar.cc/100'}
          alt={profile.name}
          className={hovering && previewVideoUrl ? 'hidden' : ''}
        />
        {previewVideoUrl && (
          <video
            ref={videoRef}
            className={`preview-video ${hovering ? 'visible' : ''}`}
            src={previewVideoUrl}
            muted
            loop
            playsInline
            preload="none"
          />
        )}
      </div>
      <div className="profile-card-info">
        <div className="profile-card-header">
          <a href={profile.onlyfansLink || '#'} target="_blank" rel="noreferrer" className="profile-name">
            {profile.name}
          </a>
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

        <p className="profile-card-bio">{bio}</p>
      </div>
    </div>
  );
}
