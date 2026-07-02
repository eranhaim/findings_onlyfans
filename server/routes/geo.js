const express = require('express');
const router = express.Router();
const geoip = require('geoip-lite');

const COUNTRY_NAMES = {
  IL: 'Israel',
  US: 'United States',
  GB: 'United Kingdom',
  FR: 'France',
  DE: 'Germany',
  CA: 'Canada',
  AU: 'Australia',
  BR: 'Brazil',
  ES: 'Spain',
  IT: 'Italy',
  NL: 'Netherlands',
  BE: 'Belgium',
  CH: 'Switzerland',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  PL: 'Poland',
  RU: 'Russia',
  UA: 'Ukraine',
  JP: 'Japan',
  KR: 'South Korea',
  IN: 'India',
  MX: 'Mexico',
  AR: 'Argentina',
  CO: 'Colombia',
  ZA: 'South Africa',
  NG: 'Nigeria',
  EG: 'Egypt',
  TR: 'Turkey',
  AE: 'UAE',
  SA: 'Saudi Arabia',
  TH: 'Thailand',
  PH: 'Philippines',
  SG: 'Singapore',
  MY: 'Malaysia',
  ID: 'Indonesia',
  RO: 'Romania',
  CZ: 'Czech Republic',
  PT: 'Portugal',
  GR: 'Greece',
  HU: 'Hungary',
  AT: 'Austria',
  IE: 'Ireland',
  NZ: 'New Zealand',
  CL: 'Chile',
  PE: 'Peru',
};

const COUNTRY_TO_LANG = {
  IL: 'he',
  FR: 'fr',
  BE: 'fr',
  CH: 'fr',
  CA: 'fr',
  MC: 'fr',
  LU: 'fr',
  SN: 'fr',
  CI: 'fr',
  ML: 'fr',
  CM: 'fr',
  MG: 'fr',
};

function getGeoFromRequest(req) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket.remoteAddress;

  const cleanIp = ip === '::1' || ip === '127.0.0.1' ? null : ip;
  return { geo: cleanIp ? geoip.lookup(cleanIp) : null, ip: cleanIp };
}

router.get('/detect-language', (req, res) => {
  const { geo, ip } = getGeoFromRequest(req);

  let language = 'en';
  if (geo && geo.country) {
    language = COUNTRY_TO_LANG[geo.country] || 'en';
  }

  res.json({
    language,
    country: geo?.country || 'unknown',
    ip: ip || 'localhost',
  });
});

router.get('/location', (req, res) => {
  const { geo, ip } = getGeoFromRequest(req);

  if (!geo) {
    return res.json({
      countryCode: 'unknown',
      countryName: '',
      region: '',
      city: '',
      ip: ip || 'localhost',
    });
  }

  const code = geo.country || 'unknown';
  const countryName = COUNTRY_NAMES[code] || code;

  res.json({
    countryCode: code,
    countryName,
    region: geo.region || '',
    city: geo.city || '',
    timezone: geo.timezone || '',
    ll: geo.ll || [],
    ip: ip || 'localhost',
  });
});

module.exports = router;
