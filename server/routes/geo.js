const express = require('express');
const router = express.Router();
const geoip = require('geoip-lite');

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
      country: 'unknown',
      region: '',
      city: '',
      ip: ip || 'localhost',
    });
  }

  res.json({
    country: geo.country || 'unknown',
    region: geo.region || '',
    city: geo.city || '',
    timezone: geo.timezone || '',
    ll: geo.ll || [],
    ip: ip || 'localhost',
  });
});

module.exports = router;
