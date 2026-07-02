const express = require('express');
const router = express.Router();
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.S3_BUCKET_NAME || 'telescope-media-us';

const urlCache = new Map();
const CACHE_TTL = 3500 * 1000;

router.get('/signed-url', async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: 'Missing key parameter' });

    const cached = urlCache.get(key);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return res.json({ url: cached.url });
    }

    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    urlCache.set(key, { url, ts: Date.now() });
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/proxy/*', async (req, res) => {
  try {
    const key = req.params[0];
    if (!key) return res.status(400).json({ error: 'Missing key' });

    const s3Params = { Bucket: BUCKET, Key: key };

    if (req.headers.range) {
      s3Params.Range = req.headers.range;
    }

    const command = new GetObjectCommand(s3Params);
    const response = await s3.send(command);

    const contentType = response.ContentType || 'application/octet-stream';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=604800');
    res.set('Accept-Ranges', 'bytes');

    if (response.ContentLength) {
      res.set('Content-Length', String(response.ContentLength));
    }

    if (req.headers.range && response.ContentRange) {
      res.status(206);
      res.set('Content-Range', response.ContentRange);
    }

    response.Body.pipe(res);
  } catch (err) {
    if (err.name === 'NoSuchKey') {
      return res.status(404).json({ error: 'Not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
