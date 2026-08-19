const m = require('mongoose');

const FANSFINDER_URI = 'mongodb+srv://eranhaim321_db_user:PtILGzcZXHFeFI0X@cluster0.arkaqdy.mongodb.net/';
const TELESCOPE_URI = 'mongodb+srv://eranhaim321_db_user:56bLnZ8kf9iqXNkU@cluster0.pncliin.mongodb.net/';

async function run() {
  const srcConn = m.createConnection(FANSFINDER_URI);
  const dstConn = m.createConnection(TELESCOPE_URI);

  await new Promise(r => srcConn.once('connected', r));
  await new Promise(r => dstConn.once('connected', r));
  console.log('Connected to both DBs');

  const ffProfiles = await srcConn.db.collection('profiles').find({}).toArray();
  console.log('FansFinder profiles:', ffProfiles.length);

  let updated = 0;
  let notFound = 0;

  for (const p of ffProfiles) {
    const handle = p.username;
    if (!handle) continue;

    const linkButtons = [];
    if (p.onlyfansLink) {
      linkButtons.push({
        label: 'OnlyFans',
        url: p.onlyfansLink,
        linkType: 'onlyfans',
        order: 0,
      });
    }
    if (p.socialLinks?.telegram) {
      linkButtons.push({
        label: 'Telegram',
        url: p.socialLinks.telegram,
        linkType: 'telegram_group',
        order: 1,
      });
    }

    const updateFields = {
      name: p.name,
      handle: handle,
      profileImage: p.avatar || '',
      profileImageThumb: p.avatarThumb || '',
      tags: p.tags || [],
      clicks: p.likes || 0,
      isVerified: p.isVerified || false,
      linkButtons: linkButtons,
    };

    if (p.socialLinks?.telegram) {
      updateFields.telegramLink = p.socialLinks.telegram;
    }

    const result = await dstConn.db.collection('profiles').updateOne(
      { handle: { $regex: new RegExp('^' + handle + '$', 'i') } },
      { $set: updateFields }
    );

    if (result.matchedCount > 0) {
      console.log('RESTORED:', handle, '| links:', linkButtons.length, '| clicks:', updateFields.clicks);
      updated++;
    } else {
      console.log('NOT FOUND in Telescope:', handle);
      notFound++;
    }
  }

  console.log('\n--- SUMMARY ---');
  console.log('Restored:', updated);
  console.log('Not found in Telescope:', notFound);
  console.log('\nNOTE: Media arrays (individual video/image items with their S3 keys and click counts) cannot be');
  console.log('restored from FansFinder since only the top video was stored. S3 files still exist though.');

  await srcConn.close();
  await dstConn.close();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
