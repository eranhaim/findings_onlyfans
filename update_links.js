const m = require('mongoose');

async function run() {
  await m.connect(process.env.MONGODB_URI);
  console.log('Connected');

  const updates = [
    {
      username: 'yardenlasry',
      onlyfansLink: 'https://onlyfans.com/yardenlasry/trial/e8pvsv9u2upfhdbzvo4ilkrjtyvksonq',
      telegram: 'https://t.me/+atiM4jcFXIJmMjA0',
    },
    {
      username: 'Iambohema',
      onlyfansLink: 'https://onlyfans.com/the_bohema/trial/fxrwe39ecwmohmw0q8r2iwkrv7d9098e',
      telegram: 'https://t.me/+_K5SSde-mZRlNmJk',
    },
    {
      username: 'adeldahan69',
      onlyfansLink: 'https://onlyfans.com/adeldahan69/trial/1erckervm8lqtbrpcid3libh87xavdox',
      telegram: 'https://t.me/+x3hToWiy6RVhZDhk',
    },
    {
      username: 'ZayaAsfoor',
      onlyfansLink: 'https://onlyfans.com/zaya_trans999/trial/laylkb3leji5nfsujt5t6tursfs3a9v7',
      telegram: 'https://t.me/+wtrdLv9MmmMwYTE8',
    },
    {
      username: 'RomyA69',
      onlyfansLink: 'https://onlyfans.com/romyabergel/trial/nzdnarabjortbel6h3agvegtxjgxtqsz',
      telegram: 'https://t.me/+TI-lyozu_YdjZGNk',
    },
    {
      username: 'Tamar_gold',
      onlyfansLink: 'https://onlyfans.com/emunagold222/trial/czpfjwi4a7pattvu5awv6wrl2vaaulb3',
      telegram: 'https://t.me/+ShfAJ9AOX0k5NjZk',
    },
    {
      username: 'BarbieGreenn',
      onlyfansLink: 'https://onlyfans.com/greeneyebarbie/trial/grparhdmxz8qinmad9z6byscnfmsduuq',
      telegram: 'https://t.me/+zIlDt5342ko0YTZk',
    },
    {
      username: 'Crazy69angell',
      onlyfansLink: 'https://onlyfans.com/crazyangell/trial/9miypfvg0n8dututkhor0zwccmdjemxz',
      telegram: 'https://t.me/+1tw4YYNBbXcwYTY0',
    },
    {
      username: 'NataliePopov',
      onlyfansLink: '',
      telegram: 'https://t.me/+4rwU0HBpJYAwODM8',
    },
    {
      username: 'itsmilanbabe',
      onlyfansLink: 'https://onlyfans.com/itsmilanbabe/trial/ymplyfiar3bmqifoq5pry4bzpmng7ryk',
      telegram: 'https://t.me/+H-4Gxw6RdMxkNzk0',
    },
    {
      username: 'TirtzaKoren',
      onlyfansLink: 'https://onlyfans.com/tirzakoren555/trial/k1opimeixk63wnftadsrir1ss7yhwqpn',
      telegram: 'https://t.me/+Ck1qzFRq39gxMGJk',
    },
    {
      username: 'KarenS_XO',
      onlyfansLink: 'https://onlyfans.com/karen4youu/trial/ciwraylgsdgnqwxcn7ri10drwx9pxntq',
      telegram: 'https://t.me/+KkeRvHnA4VA0YzVk',
    },
    {
      username: 'BarburLovesYou',
      onlyfansLink: 'https://onlyfans.com/barsimantov10/trial/2qtlctsw05fq63emtldrxpt9qmax0p3q',
      telegram: 'https://t.me/+QofHs4zigdFmMjI0',
    },
  ];

  for (const u of updates) {
    const set = { 'socialLinks.telegram': u.telegram };
    if (u.onlyfansLink) set.onlyfansLink = u.onlyfansLink;

    const result = await m.connection.db.collection('profiles').updateOne(
      { username: { $regex: new RegExp('^' + u.username + '$', 'i') } },
      { $set: set }
    );

    const status = result.modifiedCount > 0 ? 'UPDATED' : (result.matchedCount > 0 ? 'NO CHANGE' : 'NOT FOUND');
    console.log(status, u.username);
  }

  await m.disconnect();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
