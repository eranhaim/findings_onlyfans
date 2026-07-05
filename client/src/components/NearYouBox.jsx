import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { fetchRandomNear } from '../api';
import ProfileCard from './ProfileCard';
import './NearYouBox.css';

export default function NearYouBox({ userCountry }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'he';
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (!userCountry) return;
    fetchRandomNear(userCountry, 4).then(setProfiles).catch(() => {});
  }, [userCountry]);

  if (!userCountry || profiles.length === 0) return null;

  return (
    <div className="near-you-box" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="near-you-header">
        <FaMapMarkerAlt className="near-you-icon" />
        <h2 className="near-you-title">{t('nearYouSection')}</h2>
        <span className="near-you-location">{userCountry}</span>
      </div>
      <div className="near-you-profiles">
        {profiles.map((profile) => (
          <ProfileCard key={profile._id} profile={profile} />
        ))}
      </div>
    </div>
  );
}
