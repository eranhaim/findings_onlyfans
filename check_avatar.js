const m = require('mongoose');
m.connect(process.env.MONGODB_URI).then(async () => {
  const p = await m.connection.db.collection('profiles').findOne({ avatar: { $ne: '' } });
  console.log('AVATAR:', p ? p.avatar : 'none');
  await m.disconnect();
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
