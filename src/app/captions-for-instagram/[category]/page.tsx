/**
 * Instagram 分类详情页面
 * @description 特定分类的 Instagram 文案页面，用于 SEO 和用户浏览
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CaptionListClient } from '@/components/caption/caption-list-client';
import { SimplifiedGenerator } from '@/components/generator/simplified-generator';
import { CATEGORIES_CONFIG, CATEGORY_HASHTAGS } from '@/config/constants';
import { PlatformId, GeneratedCaption } from '@/types';
import { generateUniqueId } from '@/lib/utils';

/**
 * 页面参数类型
 */
interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

/**
 * 根据分类 slug 获取分类配置
 * @param slug - 分类 URL slug
 * @returns 分类配置或 undefined
 */
function getCategoryBySlug(slug: string) {
  return CATEGORIES_CONFIG.find((cat) => cat.slug === slug);
}

/**
 * 生成静态参数（用于静态生成）
 */
export async function generateStaticParams() {
  return CATEGORIES_CONFIG.map((category) => ({
    category: category.slug,
  }));
}

/**
 * 生成页面元数据
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const title = `${category.displayName} Captions for Instagram - Best ${category.displayName} Caption Ideas`;
  const description = `Find the perfect ${category.displayName.toLowerCase()} captions for Instagram. Browse our curated collection of ${category.displayName.toLowerCase()} captions with hashtags. Copy and paste ready!`;

  return {
    title,
    description,
    keywords: [
      `${category.displayName.toLowerCase()} captions for instagram`,
      `instagram ${category.displayName.toLowerCase()} captions`,
      `${category.displayName.toLowerCase()} instagram quotes`,
      `best ${category.displayName.toLowerCase()} captions`,
      `${category.displayName.toLowerCase()} hashtags`,
    ],
    openGraph: {
      title,
      description,
    },
  };
}

/**
 * 生成示例文案（实际项目中应从数据库获取）
 * @param categoryId - 分类 ID
 * @returns 示例文案列表
 */
function generateExampleCaptions(categoryId: string): GeneratedCaption[] {
  const hashtags = CATEGORY_HASHTAGS[categoryId] || [];
  
  // 根据分类生成不同的示例文案（每个分类约50条）
  const captionTemplates: Record<string, string[]> = {
    selfie: [
      "Be yourself, there's no one better ✨",
      "Confidence level: Selfie with no filter",
      "Just me being me 📸",
      "Self love is the best love 💕",
      "Good vibes and selfies only",
      "Woke up like this 💅",
      "Not perfect, just real",
      "Making memories with myself",
      "This is my happy face 😊",
      "Feeling myself today",
      "Smile, it confuses people 😏",
      "Current mood: Fabulous",
      "Be a voice, not an echo",
      "Selfie game strong 💪",
      "Life isn't perfect but your selfie can be",
      "Proof that I can take selfies better than most 📱",
      "Me, myself, and I ✨",
      "Catch flights, not feelings",
      "I didn't choose the selfie life, the selfie life chose me",
      "Be your own kind of beautiful",
      "Less perfection, more authenticity",
      "Main character energy only ✨",
      "Sorry for the spam, I just love my face 🤷‍♀️",
      "Self portrait Sunday",
      "A selfie a day keeps the insecurities away",
      "Living for the moments you can't put into words",
      "Be the reason someone smiles today",
      "Sunshine mixed with a little hurricane 🌪",
      "Too glam to give a damn 💅",
      "Warning: May cause extreme jealousy",
    ],
    travel: [
      "Adventure awaits ✈️",
      "Collect moments, not things",
      "Wanderlust and city dust",
      "Lost in the right direction 🧭",
      "Travel far, travel wide",
      "The world is my playground 🌍",
      "Eat. Sleep. Travel. Repeat.",
      "Leave only footprints, take only memories",
      "Not all who wander are lost",
      "Life is short and the world is wide",
      "Travel is the only thing you buy that makes you richer",
      "Adventure is out there 🏔",
      "Exploring the unexplored",
      "Find me under the palms 🌴",
      "Jet lag is for amateurs",
      "Take me anywhere",
      "Currently accepting applications for travel buddy ✈️",
      "I've got a bad case of wanderlust",
      "Travel far enough to meet yourself",
      "Passport stamps are the best souvenirs",
      "Catch me if you can ✈️",
      "Blessed with this view",
      "Making memories around the world",
      "Travel vibes only",
      "Where to next? 🗺",
      "Another day, another destination",
      "Living my travel dreams",
      "Home is wherever I'm with my suitcase",
      "Tourist mode: ON",
      "Exploring one city at a time",
    ],
    food: [
      "Good food, good mood 🍕",
      "Eating my way through life",
      "Food is my love language 💕",
      "Life is too short for bad food",
      "First we eat, then we do everything else",
      "Happiness is homemade 🏠",
      "Food before dudes 🍔",
      "Diet starts tomorrow... maybe",
      "You can't make everyone happy, you're not pizza 🍕",
      "I followed my heart and it led me to the fridge",
      "Stressed spelled backwards is desserts 🍰",
      "When nothing goes right, go eat 🍴",
      "But first, coffee ☕",
      "Cooking is love made visible",
      "My diet plan: Make all my friends cookies 🍪",
      "Sorry, I'm in a relationship with food",
      "Food is fuel, but also happiness",
      "In pizza we trust 🍕",
      "This is why I have trust issues with salads",
      "Calories don't count on weekends",
      "I like food and sleep. If I give you attention, you're special 💕",
      "Food is art, and I'm a masterpiece",
      "Running late is my cardio",
      "Made with love (and probably butter)",
      "Brunch without champagne is just a sad breakfast 🥂",
      "If you're not hungry, you're not paying attention",
      "Chef's kiss 👨‍🍳💋",
      "Food coma incoming 😴",
      "Eat well, travel often, love always",
      "Life is uncertain. Eat dessert first 🧁",
    ],
    couple: [
      "You're my favorite notification 💕",
      "Together is my favorite place to be",
      "You make my heart smile 💑",
      "Love you to the moon and back 🌙",
      "My partner in crime and in life",
      "Forever isn't long enough with you",
      "You're the cheese to my macaroni 🧀",
      "Home is wherever I'm with you",
      "You're my favorite hello and hardest goodbye",
      "Every love story is beautiful, but ours is my favorite",
      "I love you more than pizza, and that's saying a lot 🍕",
      "You had me at hello",
      "My person, my partner, my love 💕",
      "Side by side or miles apart, we are connected by the heart",
      "I choose you, every day",
      "Together we have it all",
      "You're worth every mile between us",
      "Two hearts that beat as one",
      "I'd rather be with you",
      "Found my missing puzzle piece 🧩",
      "Love is in the air ❤️",
      "You and me, always",
      "Better together 💕",
      "My favorite person on the planet",
      "Love looks good on us",
      "Just two hearts making memories",
      "You're my today and all of my tomorrows",
      "Falling for you every single day",
      "With you, I'm home",
      "My ride or die 💪",
    ],
    friends: [
      "Friends who slay together, stay together 💅",
      "Good times + Crazy friends = Amazing memories",
      "Squad goals 🔥",
      "Life is better with friends",
      "Friends make everything better",
      "My tribe, my vibe 👯",
      "Friends are the family we choose",
      "Real queens fix each other's crowns 👑",
      "I'd take a bullet for you... not in the head tho",
      "Best friends don't let you do stupid things... alone",
      "We go together like coffee and donuts ☕🍩",
      "Soul sisters from another mister",
      "Finding friends with the same mental disorder: Priceless",
      "Friendship isn't a big thing, it's a million little things",
      "Good friends don't let you do stupid things alone",
      "Life was meant for good friends and great adventures",
      "True friends don't judge each other",
      "Friends buy you lunch. Best friends eat your lunch 🍔",
      "Side by side or miles apart, real friends are always close to the heart",
      "We don't see each other enough, but when we do, it's like no time has passed",
      "Friends who brunch together, stay together 🥂",
      "Through thick and thin 💕",
      "Partners in crime 👯‍♀️",
      "No new friends needed",
      "Laughing with you is my favorite thing",
      "Friend group chat name: Chaos",
      "We're the friends your mom warned you about",
      "Friendship goals achieved 🎯",
      "Making memories one adventure at a time",
      "The more the merrier 🎉",
    ],
    birthday: [
      "Another year older, still not wiser 🎂",
      "It's my party and I'll post what I want 🎉",
      "Making my years count, not counting my years",
      "Cheers to another trip around the sun ☀️",
      "Birthday mood: ON 🎈",
      "Aged to perfection 🍷",
      "On this day, a queen was born 👑",
      "It's my birthday, I can do what I want",
      "Sassy since birth 💅",
      "Vintage but make it fashion",
      "Birthday vibes only 🎂",
      "New age, same me",
      "Feeling 22... forever",
      "Born to be fabulous",
      "The earth says I'm ____ but my spirit says forever young",
      "Cake is my love language 🎂",
      "Warning: Birthday girl/boy alert 🚨",
      "Today is a good day to have a good day",
      "Grateful for another year of blessings",
      "Birthdays are nature's way of telling us to eat more cake",
      "Level unlocked: New age achieved 🎮",
      "Making a wish ✨",
      "Birthday glam ready 💄",
      "Celebrating me today",
      "Another year of being fabulous",
      "Birthday calories don't count",
      "Ready for my birthday adventure 🎈",
      "Just here for the cake 🍰",
      "It's not just my day, it's my whole birth month",
      "Blessed with another year of life 🙏",
    ],
    gym: [
      "Sweat now, shine later 💪",
      "No pain, no gain",
      "Strong is the new beautiful",
      "Progress, not perfection",
      "Train insane or remain the same",
      "Gym hair, don't care 🏋️",
      "Beast mode: ACTIVATED",
      "Making gains and taking names",
      "Your only competition is yourself",
      "Sore today, strong tomorrow",
      "Lift heavy, feel happy",
      "The gym is my therapy 🏋️",
      "Fitness is not a destination, it's a lifestyle",
      "Stronger than yesterday",
      "Good things come to those who sweat",
      "Earning my carbs one rep at a time",
      "Workout because you love your body, not because you hate it",
      "Be stronger than your excuses",
      "The only bad workout is the one you didn't do",
      "Gym selfie or it didn't happen 📸",
      "Making myself proud one workout at a time",
      "Results happen over time, not overnight",
      "Push yourself because no one else will",
      "Fitness goals in progress 🎯",
      "Hustle for that muscle 💪",
      "Obsessed is a word lazy people use",
      "Rise and grind 🌅",
      "Turning can'ts into cans",
      "Building a better me",
      "Working on my fitness 🏃",
    ],
    work: [
      "Boss moves only 💼",
      "Hustle in silence, let success make the noise",
      "Dream big, work hard",
      "Making moves and making progress",
      "Monday motivation activated 🚀",
      "Work hard, stay humble",
      "CEO of my own destiny",
      "Building an empire, one day at a time",
      "Good things happen to those who hustle",
      "Currently in my empire-building era 👑",
      "Success is a journey, not a destination",
      "Working on myself, for myself, by myself",
      "Rise and grind ☕",
      "Making dreams into plans",
      "Proof that hard work pays off",
      "Out here making boss moves",
      "Behind every success is hard work",
      "On my grind 💪",
      "Turning passion into profession",
      "Coffee and confidence ☕",
      "Professional overthinker and overachiever",
      "In my productive era",
      "Doing the work that matters",
      "Career goals: In progress 📈",
      "Work mode: Unstoppable",
      "Creating opportunities, not waiting for them",
      "Focused on growth 🌱",
      "Success loading... Please wait ⏳",
      "Making it happen, one step at a time",
      "Today's hustle, tomorrow's reward",
    ],
    nature: [
      "Nature is my therapy 🌿",
      "Find me where the wild things are",
      "In every walk with nature, one receives far more than they seek",
      "The earth has music for those who listen 🌍",
      "Into the wild I go",
      "Nature never goes out of style",
      "Not all classrooms have four walls 🏔",
      "Let's find some beautiful place to get lost",
      "The mountains are calling and I must go 🏔",
      "Life is better by the lake",
      "Take only memories, leave only footprints",
      "Sunshine is the best medicine ☀️",
      "Earth has no sorrow that nature cannot heal",
      "Fresh air and freedom",
      "My kind of therapy 🌲",
      "Lost in nature, found myself",
      "Nature is not a place to visit, it is home",
      "Green is my favorite color 💚",
      "Sky above, earth below, peace within",
      "Happiness is a day spent in nature",
      "The best views come after the hardest climbs",
      "Keep close to nature's heart",
      "Born to explore 🧭",
      "Wild and free 🌿",
      "Mother Nature's favorite child",
      "Adventure is worthwhile in itself",
      "Life's a garden, dig it 🌻",
      "Grounding myself in nature",
      "Peace, love, and fresh air",
      "Where the wifi is weak but the connection is strong",
    ],
    fashion: [
      "Style is a way to say who you are without speaking 👗",
      "Fashion is my passion",
      "Dressed to impress",
      "Life is too short to wear boring clothes",
      "Outfit of the day, every day",
      "Fashion fades, style is eternal ✨",
      "Clothes aren't going to change the world. The women who wear them will 👑",
      "Fashion is art and you are the canvas",
      "Style is knowing who you are",
      "Confidence is the best outfit",
      "Shopping is my cardio 🛍",
      "Creating my own runway",
      "Fashion is instant language",
      "Slaying since day one 💅",
      "Less bitter, more glitter ✨",
      "My outfit speaks louder than words",
      "Fashion is about something that comes from within",
      "Dressing well is a form of good manners",
      "Cinderella is proof that a new pair of shoes can change your life 👠",
      "Elegance is the only beauty that never fades",
      "I'm not a fashion victim, I'm a fashion victor",
      "Outfit repeat? I don't know her",
      "Dressed like I'm already famous",
      "Fashion is what you buy, style is what you do with it",
      "In a world full of trends, remain a classic",
      "Every day is a fashion show",
      "Your style is a reflection of your personality",
      "Trendsetter in training 👠",
      "Making fashion statements daily",
      "My wardrobe is my happy place",
    ],
    pet: [
      "My best friend has four paws 🐕",
      "Home is where the dog is",
      "Who rescued who?",
      "Pawsitively adorable 🐾",
      "Living that pet life",
      "My heart belongs to my furry friend",
      "Love is a four-legged word",
      "The more people I meet, the more I love my pet",
      "Not spoiled, just well taken care of",
      "My therapist has fur and four legs 🐾",
      "Happiness is a warm puppy",
      "Life is better with pets",
      "All you need is love and a dog 🐕",
      "Making memories with my best friend",
      "Pet parent life is the best life",
      "Warning: May spontaneously talk about my pet",
      "Sorry, I have plans with my dog",
      "In a committed relationship with my pet",
      "Fur baby appreciation post 💕",
      "The pawfect companion",
      "My pet is my favorite person",
      "Living the good life together",
      "Side by side, fur to fur",
      "Pet snuggles are the best kind",
      "Unconditional love in fur form",
      "Can't imagine life without this face",
      "Best friends fur-ever 🐾",
      "Home is where my pet is",
      "Adopted and adored",
      "Making every day an adventure together",
    ],
    music: [
      "Music is my escape 🎵",
      "Where words fail, music speaks",
      "Life is better with music",
      "Turn up the volume, turn down the noise",
      "Music on, world off 🎧",
      "Dancing through life",
      "Without music, life would be a mistake",
      "Music is the soundtrack of your life",
      "Lost in the rhythm 🎶",
      "Feel the beat, be the beat",
      "Music is life, that's why our hearts have beats",
      "Dancing like nobody's watching 💃",
      "One good thing about music is when it hits, you feel no pain",
      "Let the music take control",
      "Vibing to the beat 🎵",
      "Music feeds my soul",
      "Concert mode: Activated 🎤",
      "If music be the food of love, play on",
      "Live for the music",
      "Playlist on repeat",
      "Can't stop the music 🎶",
      "Every song has a memory attached",
      "Turn up and tune out",
      "Music is my superpower",
      "This song hits different",
      "Ears full of music, heart full of joy",
      "Dancing to my own rhythm",
      "Life's too short for bad music",
      "Sound on, stress off 🎧",
      "Making melodies and memories",
    ],
  };

  const templates = captionTemplates[categoryId] || [
    "Living my best life ✨",
    "Making memories",
    "Good vibes only",
    "Life is beautiful",
    "Embrace the moment",
    "Stay positive",
    "Today is a gift, that's why it's called the present",
    "Creating my own sunshine ☀️",
    "Just here to have a good time",
    "Life is short, smile while you have teeth",
    "Making every moment count",
    "Finding joy in the little things",
    "Plot twist: Everything worked out",
    "Main character energy",
    "Grateful for today",
    "Building the life I want",
    "One day at a time",
    "Making magic happen ✨",
  ];

  return templates.map((content) => ({
    id: generateUniqueId(),
    content,
    formattedContent: content,
    hashtags: hashtags.slice(0, 10),
    characterCount: content.length,
  }));
}

/**
 * Instagram 分类详情页面组件
 */
export default async function InstagramCategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  // 分类不存在时返回 404
  if (!category) {
    notFound();
  }

  // 获取示例文案
  const captions = generateExampleCaptions(category.id);
  
  // 获取分类相关的 hashtags
  const hashtags = CATEGORY_HASHTAGS[category.id] || [];

  return (
    <div className="flex flex-col">
      {/* 面包屑导航 */}
      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/captions-for-instagram" className="hover:text-primary">
              Instagram Captions
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium">
              {category.displayName}
            </span>
          </nav>
        </div>
      </section>

      {/* Hero 区域 */}
      <section className="py-12 bg-gradient-to-b from-pink-50 to-background dark:from-pink-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* 返回链接 */}
            <Link 
              href="/captions-for-instagram"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to all categories
            </Link>
            
            {/* 分类图标和标题 */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-5xl">{category.icon}</span>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {category.displayName} Captions for Instagram
                </h1>
                <p className="text-muted-foreground mt-2">
                  {category.description}
                </p>
              </div>
            </div>
            
            {/* CTA 按钮 */}
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href={`/generator?platform=instagram&category=${category.id}`}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate {category.displayName} Captions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 推荐 Hashtags */}
      {hashtags.length > 0 && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-semibold mb-4">
                Popular {category.displayName} Hashtags
              </h2>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 内嵌简化版生成器 */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <SimplifiedGenerator
              platform={PlatformId.INSTAGRAM}
              categoryId={category.id}
              title={`Generate ${category.displayName} Captions`}
              description={`Get AI-generated ${category.displayName.toLowerCase()} captions instantly`}
              themeClass="bg-white dark:bg-zinc-900 border shadow-lg"
              buttonClass="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white"
            />
          </div>
        </div>
      </section>

      {/* 文案列表 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Best {category.displayName} Captions
            </h2>
            
            <CaptionListClient
              captions={captions}
              platform={PlatformId.INSTAGRAM}
              categoryId={category.id}
              showHashtags={true}
              showSort={true}
              showLoadMore={true}
              pageSize={12}
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* 相关分类 */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Categories</h2>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES_CONFIG
                .filter((cat) => cat.id !== category.id)
                .slice(0, 6)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/captions-for-instagram/${cat.slug}`}
                  >
                    <Badge
                      variant="outline"
                      className="text-base py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <span className="mr-2">{cat.icon}</span>
                      {cat.displayName}
                    </Badge>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need More {category.displayName} Captions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let AI generate unique captions tailored for your {category.displayName.toLowerCase()} posts
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href={`/generator?platform=instagram&category=${category.id}`}>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate More Captions
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
