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

router.get('/detect-language', (req, res) => {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket.remoteAddress;

  const cleanIp = ip === '::1' || ip === '127.0.0.1' ? null : ip;
  const geo = cleanIp ? geoip.lookup(cleanIp) : null;

  let language = 'en';
  if (geo && geo.country) {
    language = COUNTRY_TO_LANG[geo.country] || 'en';
  }

  res.json({
    language,
    country: geo?.country || 'unknown',
    ip: cleanIp || 'localhost',
  });
});

module.exports = router;
