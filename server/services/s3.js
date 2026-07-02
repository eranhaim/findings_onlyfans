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
const URL_EXPIRY = 86400;
const CACHE_TTL = 82800_000;

const urlCache = new Map();

async function getSignedMediaUrl(key) {
  if (!key) return '';

  const cached = urlCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const url = await getSignedUrl(s3, command, { expiresIn: URL_EXPIRY });

  urlCache.set(key, { url, expiresAt: Date.now() + CACHE_TTL });
  return url;
}

async function signProfileUrls(profile) {
  const obj = typeof profile.toObject === 'function' ? profile.toObject() : { ...profile };

  if (obj.avatar) {
    obj.avatarUrl = await getSignedMediaUrl(obj.avatar);
  }
  if (obj.avatarThumb) {
    obj.avatarThumbUrl = await getSignedMediaUrl(obj.avatarThumb);
  }
  if (obj.previewVideo) {
    obj.previewVideoUrl = await getSignedMediaUrl(obj.previewVideo);
  }
  if (obj.previewVideoThumb) {
    obj.previewVideoThumbUrl = await getSignedMediaUrl(obj.previewVideoThumb);
  }

  return obj;
}

module.exports = { getSignedMediaUrl, signProfileUrls, s3, BUCKET };
