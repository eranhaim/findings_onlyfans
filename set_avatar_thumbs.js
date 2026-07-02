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
    const handle = (tp.handle || '').replace('@', '').trim();
    if (!handle) continue;

    const updates = {};

    if (tp.profileImageThumb) {
      updates.avatarThumb = tp.profileImageThumb;
    }

    if (tp.profileImage && !tp.profileImage.startsWith('http')) {
      updates.avatar = tp.profileImage;
    }

    if (Object.keys(updates).length === 0) continue;

    const result = await dstConn.db.collection('profiles').updateOne(
      { username: handle },
      { $set: updates }
    );

    if (result.modifiedCount > 0) {
      console.log(handle, '->', JSON.stringify(updates));
      updated++;
    }
  }

  console.log('Updated', updated, 'profiles with avatar data');
  await srcConn.close();
  await dstConn.close();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
