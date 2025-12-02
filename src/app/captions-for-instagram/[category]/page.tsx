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
import { CaptionList } from '@/components/caption/caption-list';
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
  
  // 根据分类生成不同的示例文案
  const captionTemplates: Record<string, string[]> = {
    selfie: [
      "Be yourself, there's no one better ✨",
      "Confidence level: Selfie with no filter",
      "Just me being me 📸",
      "Self love is the best love 💕",
      "Good vibes and selfies only",
      "Woke up like this 💅",
    ],
    travel: [
      "Adventure awaits ✈️",
      "Collect moments, not things",
      "Wanderlust and city dust",
      "Lost in the right direction 🧭",
      "Travel far, travel wide",
      "The world is my playground 🌍",
    ],
    food: [
      "Good food, good mood 🍕",
      "Eating my way through life",
      "Food is my love language 💕",
      "Life is too short for bad food",
      "First we eat, then we do everything else",
      "Happiness is homemade 🏠",
    ],
    couple: [
      "You're my favorite notification 💕",
      "Together is my favorite place to be",
      "You make my heart smile 💑",
      "Love you to the moon and back 🌙",
      "My partner in crime and in life",
      "Forever isn't long enough with you",
    ],
    friends: [
      "Friends who slay together, stay together 💅",
      "Good times + Crazy friends = Amazing memories",
      "Squad goals 🔥",
      "Life is better with friends",
      "Friends make everything better",
      "My tribe, my vibe 👯",
    ],
    birthday: [
      "Another year older, still not wiser 🎂",
      "It's my party and I'll post what I want 🎉",
      "Making my years count, not counting my years",
      "Cheers to another trip around the sun ☀️",
      "Birthday mood: ON 🎈",
      "Aged to perfection 🍷",
    ],
    gym: [
      "Sweat now, shine later 💪",
      "No pain, no gain",
      "Strong is the new beautiful",
      "Progress, not perfection",
      "Train insane or remain the same",
      "Gym hair, don't care 🏋️",
    ],
    work: [
      "Boss moves only 💼",
      "Hustle in silence, let success make the noise",
      "Dream big, work hard",
      "Making moves and making progress",
      "Monday motivation activated 🚀",
      "Work hard, stay humble",
    ],
    nature: [
      "Nature is my therapy 🌿",
      "Find me where the wild things are",
      "In every walk with nature, one receives far more than they seek",
      "The earth has music for those who listen 🌍",
      "Into the wild I go",
      "Nature never goes out of style",
    ],
    fashion: [
      "Style is a way to say who you are without speaking 👗",
      "Fashion is my passion",
      "Dressed to impress",
      "Life is too short to wear boring clothes",
      "Outfit of the day, every day",
      "Fashion fades, style is eternal ✨",
    ],
    pet: [
      "My best friend has four paws 🐕",
      "Home is where the dog is",
      "Who rescued who?",
      "Pawsitively adorable 🐾",
      "Living that pet life",
      "My heart belongs to my furry friend",
    ],
    music: [
      "Music is my escape 🎵",
      "Where words fail, music speaks",
      "Life is better with music",
      "Turn up the volume, turn down the noise",
      "Music on, world off 🎧",
      "Dancing through life",
    ],
  };

  const templates = captionTemplates[categoryId] || [
    "Living my best life ✨",
    "Making memories",
    "Good vibes only",
    "Life is beautiful",
    "Embrace the moment",
    "Stay positive",
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

      {/* 文案列表 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Best {category.displayName} Captions
            </h2>
            
            <CaptionList
              captions={captions}
              platform={PlatformId.INSTAGRAM}
              showHashtags={true}
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
