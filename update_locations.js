const m = require('mongoose');
m.connect(process.env.MONGODB_URI).then(async () => {
  const result = await m.connection.db.collection('profiles').updateMany(
    {},
    { $set: { location: 'Israel' } }
  );
  console.log('Updated', result.modifiedCount, 'profiles to location: Israel');
  await m.disconnect();
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
