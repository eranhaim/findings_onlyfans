const mongoose = require('mongoose');
require('dotenv').config();
const Profile = require('./models/Profile');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fansfinder';

const profiles = [
  {
    name: 'Kayla',
    username: 'kaylabumssyy',
    avatar: 'https://i.pravatar.cc/300?img=1',
    likes: 65721,
    photos: 354,
    videos: 1,
    price: 3.0,
    isFree: false,
    isNewModel: false,
    isOnline: false,
    bio: {
      en: "Hello! My name is Kayla. I just turned 18 so I'm finally old enough for this site! I'm excited to explore myself with you :) I'm 18, so anything goes now! Can't wait to have some fun with you. I like guys that are older than me...",
      he: "שלום! שמי קיילה. רק מלאו לי 18 אז סוף סוף אני מספיק גדולה לאתר הזה! אני נרגשת לחקור את עצמי איתכם :) אני בת 18, אז הכל אפשרי עכשיו! מחכה ליהנות איתכם.",
      fr: "Bonjour! Je m'appelle Kayla. Je viens d'avoir 18 ans, donc je suis enfin assez grande pour ce site! Je suis excitée de me découvrir avec vous :) J'ai 18 ans, alors tout est permis maintenant!",
    },
    tags: ['blonde', 'teen', 'new'],
    category: 'top',
  },
  {
    name: 'Ava red head TEEN',
    username: 'avareber',
    avatar: 'https://i.pravatar.cc/300?img=9',
    likes: 1200,
    photos: 5,
    videos: 1,
    price: 0,
    isFree: true,
    isNewModel: true,
    isOnline: true,
    bio: {
      en: "Hiii I'm Ava, I'm 19 and I still can't believe I actually opened this account cause my dad doesn't even know about this so I can't wait to get to know you. 19 with a support teddy named Luffy... sooo whatt.",
      he: "היי אני אווה, בת 19 ואני עדיין לא מאמינה שפתחתי את החשבון הזה כי אבא שלי אפילו לא יודע על זה אז אני ממש מחכה להכיר אתכם. בת 19 עם דובי תמיכה בשם לופי... אז מה.",
      fr: "Salut, je suis Ava, j'ai 19 ans et je n'arrive toujours pas à croire que j'ai ouvert ce compte car mon père ne sait même pas. J'ai hâte de vous connaître. 19 ans avec un nounours de soutien nommé Luffy...",
    },
    tags: ['redhead', 'teen', 'free', 'new'],
    category: 'new',
  },
  {
    name: 'Sophie',
    username: 'sophierosex',
    avatar: 'https://i.pravatar.cc/300?img=5',
    likes: 42300,
    photos: 890,
    videos: 45,
    price: 9.99,
    isFree: false,
    isNewModel: false,
    isOnline: true,
    bio: {
      en: "Hey there! I'm Sophie, 22, and I love creating exclusive content just for you. DM me for custom requests. I post daily and love chatting with my fans!",
      he: "היי! אני סופי, בת 22, ואני אוהבת ליצור תוכן בלעדי בשבילכם. שלחו לי הודעה לבקשות מותאמות. אני מעלה תוכן כל יום ואוהבת לשוחח עם המעריצים שלי!",
      fr: "Salut! Je suis Sophie, 22 ans, et j'adore créer du contenu exclusif juste pour vous. Envoyez-moi un DM pour des demandes personnalisées. Je publie tous les jours!",
    },
    tags: ['brunette', 'daily', 'custom'],
    category: 'top',
  },
  {
    name: 'Emma',
    username: 'emmawildx',
    avatar: 'https://i.pravatar.cc/300?img=16',
    likes: 31500,
    photos: 567,
    videos: 23,
    price: 5.99,
    isFree: false,
    isNewModel: false,
    isOnline: false,
    bio: {
      en: "Welcome to my page! I'm Emma, 21. I'm a fitness model who loves to share my journey. Exclusive workout content and much more inside!",
      he: "ברוכים הבאים לעמוד שלי! אני אמה, בת 21. אני דוגמנית כושר שאוהבת לשתף את המסע שלה. תוכן אימונים בלעדי והרבה יותר בפנים!",
      fr: "Bienvenue sur ma page! Je suis Emma, 21 ans. Je suis mannequin fitness et j'adore partager mon parcours. Contenu d'entraînement exclusif et bien plus encore!",
    },
    tags: ['fitness', 'model', 'brunette'],
    category: 'popular',
  },
  {
    name: 'Mia',
    username: 'miababyy',
    avatar: 'https://i.pravatar.cc/300?img=20',
    likes: 89000,
    photos: 1200,
    videos: 78,
    price: 12.99,
    isFree: false,
    isNewModel: false,
    isOnline: true,
    bio: {
      en: "Hey loves! I'm Mia, 24. Top 0.1% creator. I post multiple times daily and respond to every message. Come join my world!",
      he: "היי אהובים! אני מיה, בת 24. יוצרת בטופ 0.1%. אני מעלה תוכן כמה פעמים ביום ועונה לכל הודעה. בואו להצטרף לעולם שלי!",
      fr: "Coucou les amours! Je suis Mia, 24 ans. Créatrice du top 0.1%. Je publie plusieurs fois par jour et réponds à chaque message. Rejoignez mon monde!",
    },
    tags: ['top creator', 'daily', 'responsive'],
    category: 'top',
  },
  {
    name: 'Luna',
    username: 'lunastarz',
    avatar: 'https://i.pravatar.cc/300?img=25',
    likes: 15700,
    photos: 234,
    videos: 12,
    price: 0,
    isFree: true,
    isNewModel: false,
    isOnline: false,
    bio: {
      en: "Hi! I'm Luna, 20. Free page because I just love sharing. Upgrade to VIP for exclusive content. Cosplay queen and gamer girl!",
      he: "היי! אני לונה, בת 20. עמוד חינמי כי אני פשוט אוהבת לשתף. שדרגו ל-VIP לתוכן בלעדי. מלכת הקוספליי וגיימרית!",
      fr: "Salut! Je suis Luna, 20 ans. Page gratuite parce que j'adore partager. Passez au VIP pour du contenu exclusif. Reine du cosplay et gameuse!",
    },
    tags: ['cosplay', 'gamer', 'free'],
    category: 'free',
  },
  {
    name: 'Bella',
    username: 'bellafinee',
    avatar: 'https://i.pravatar.cc/300?img=32',
    likes: 52000,
    photos: 780,
    videos: 56,
    price: 7.99,
    isFree: false,
    isNewModel: false,
    isOnline: true,
    bio: {
      en: "Hola! I'm Bella, 23. Latina queen bringing the heat daily. Custom content available. I love connecting with my subscribers one on one!",
      he: "הולה! אני בלה, בת 23. מלכת לטינה שמביאה את החום כל יום. תוכן מותאם אישית זמין. אני אוהבת להתחבר עם המנויים שלי אחד על אחד!",
      fr: "Hola! Je suis Bella, 23 ans. Reine latina qui apporte la chaleur au quotidien. Contenu personnalisé disponible. J'adore me connecter avec mes abonnés en tête-à-tête!",
    },
    tags: ['latina', 'custom', 'daily'],
    category: 'popular',
  },
  {
    name: 'Chloe',
    username: 'chloexbaby',
    avatar: 'https://i.pravatar.cc/300?img=36',
    likes: 8900,
    photos: 89,
    videos: 4,
    price: 0,
    isFree: true,
    isNewModel: true,
    isOnline: false,
    bio: {
      en: "New here! I'm Chloe, 19. Just started my journey and I'm so excited. Free page to start, come say hi! I love meeting new people.",
      he: "חדשה פה! אני קלואי, בת 19. רק התחלתי את המסע שלי ואני כל כך נרגשת. עמוד חינמי להתחלה, בואו להגיד שלום! אני אוהבת להכיר אנשים חדשים.",
      fr: "Nouvelle ici! Je suis Chloé, 19 ans. Je viens de commencer mon aventure et je suis tellement excitée. Page gratuite pour commencer, venez dire bonjour!",
    },
    tags: ['new', 'free', 'blonde'],
    category: 'new',
  },
  {
    name: 'Zara',
    username: 'zaraqueenn',
    avatar: 'https://i.pravatar.cc/300?img=38',
    likes: 27600,
    photos: 456,
    videos: 34,
    price: 4.99,
    isFree: false,
    isNewModel: false,
    isOnline: true,
    bio: {
      en: "Hey! I'm Zara, 22. Model by day, content creator by night. I love lingerie and travel content. Join me on my adventures around the world!",
      he: "היי! אני זארה, בת 22. דוגמנית ביום, יוצרת תוכן בלילה. אני אוהבת הלבשה תחתונה ותוכן טיולים. הצטרפו אליי בהרפתקאות שלי ברחבי העולם!",
      fr: "Salut! Je suis Zara, 22 ans. Mannequin le jour, créatrice de contenu la nuit. J'adore la lingerie et le contenu voyage. Rejoignez-moi dans mes aventures!",
    },
    tags: ['model', 'travel', 'lingerie'],
    category: 'popular',
  },
  {
    name: 'Lily',
    username: 'lilyrosee',
    avatar: 'https://i.pravatar.cc/300?img=44',
    likes: 3400,
    photos: 45,
    videos: 2,
    price: 0,
    isFree: true,
    isNewModel: true,
    isOnline: true,
    bio: {
      en: "Hi cuties! I'm Lily, 18. Just turned legal and ready to have fun! Free page with PPV specials. Art student who loves to pose!",
      he: "היי חמודים! אני לילי, בת 18. רק הפכתי לחוקית ומוכנה ליהנות! עמוד חינמי עם מבצעי PPV. סטודנטית לאמנות שאוהבת לדגמן!",
      fr: "Coucou les mignons! Je suis Lily, 18 ans. Je viens d'atteindre la majorité et je suis prête à m'amuser! Page gratuite avec des offres PPV. Étudiante en art qui adore poser!",
    },
    tags: ['new', 'free', 'art', 'teen'],
    category: 'new',
  },
  {
    name: 'Jade',
    username: 'jadebaddie',
    avatar: 'https://i.pravatar.cc/300?img=47',
    likes: 71200,
    photos: 1050,
    videos: 89,
    price: 15.99,
    isFree: false,
    isNewModel: false,
    isOnline: false,
    bio: {
      en: "Welcome! I'm Jade, 25. Professional model and top creator. Full-length videos, daily posts, and 1-on-1 video calls available. Your fantasy awaits!",
      he: "ברוכים הבאים! אני ג'ייד, בת 25. דוגמנית מקצועית ויוצרת מובילה. סרטונים באורך מלא, פוסטים יומיים ושיחות וידאו אישיות זמינים. הפנטזיה שלכם מחכה!",
      fr: "Bienvenue! Je suis Jade, 25 ans. Mannequin professionnelle et créatrice de premier plan. Vidéos complètes, publications quotidiennes et appels vidéo en tête-à-tête disponibles!",
    },
    tags: ['professional', 'model', 'video calls'],
    category: 'top',
  },
  {
    name: 'Nora',
    username: 'norasweet',
    avatar: 'https://i.pravatar.cc/300?img=49',
    likes: 19800,
    photos: 320,
    videos: 18,
    price: 6.99,
    isFree: false,
    isNewModel: false,
    isOnline: true,
    bio: {
      en: "Hey there! I'm Nora, 21. Sweet girl next door vibes. I love cooking content mixed with spicy surprises. Subscribe and let's get to know each other!",
      he: "היי! אני נורה, בת 21. אווירת השכנה החמודה. אני אוהבת תוכן בישול עם הפתעות חריפות. הירשמו ובואו נכיר!",
      fr: "Salut! Je suis Nora, 21 ans. Ambiance fille d'à côté. J'adore le contenu cuisine mélangé à des surprises piquantes. Abonnez-vous et faisons connaissance!",
    },
    tags: ['sweet', 'cooking', 'girl next door'],
    category: 'popular',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Profile.deleteMany({});
    console.log('Cleared existing profiles');

    await Profile.insertMany(profiles);
    console.log(`Seeded ${profiles.length} profiles`);

    await mongoose.disconnect();
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
