const m = require('mongoose');

const TELESCOPE_URI = 'mongodb+srv://eranhaim321_db_user:56bLnZ8kf9iqXNkU@cluster0.pncliin.mongodb.net/';
const FANSFINDER_URI = process.env.MONGODB_URI;

async function run() {
  const srcConn = m.createConnection(TELESCOPE_URI);
  const dstConn = m.createConnection(FANSFINDER_URI);

  await new Promise(r => srcConn.once('connected', r));
  await new Promise(r => dstConn.once('connected', r));
  console.log('Connected to both DBs');

  const teleProfiles = await srcConn.db.collection('profiles').find({}).toArray();
  console.log('Telescope profiles:', teleProfiles.length);

  let updated = 0;
  for (const tp of teleProfiles) {
    const videos = (tp.media || []).filter(m => m.type === 'video');
    if (videos.length === 0) continue;

    videos.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    const topVideo = videos[0];

    const handle = (tp.handle || '').replace('@', '').trim();
    if (!handle) continue;

    const result = await dstConn.db.collection('profiles').updateOne(
      { username: handle },
      {
        $set: {
          previewVideo: topVideo.s3Key,
          previewVideoThumb: topVideo.thumbnail || ''
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(handle, '-> video:', topVideo.s3Key, '(clicks:', topVideo.clicks || 0, ')');
      updated++;
    }
  }

  console.log('Updated', updated, 'profiles with preview videos');
  await srcConn.close();
  await dstConn.close();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
