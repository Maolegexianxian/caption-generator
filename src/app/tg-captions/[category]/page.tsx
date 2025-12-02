/**
 * Telegram 分类详情页面
 * @description 特定分类的 Telegram 文案页面，用于 SEO 和用户浏览
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, ArrowLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CaptionList } from '@/components/caption/caption-list';
import { MOODS_CONFIG } from '@/config/constants';
import { PlatformId, GeneratedCaption } from '@/types';
import { generateUniqueId } from '@/lib/utils';

/**
 * Telegram 特定分类配置
 * @description 定义 Telegram 平台的特有分类
 */
const TG_CATEGORIES = [
  {
    id: 'channel',
    slug: 'channel',
    displayName: 'Channel Posts',
    description: 'Engaging captions for Telegram channel announcements and updates',
    icon: '📢',
  },
  {
    id: 'group',
    slug: 'group',
    displayName: 'Group Messages',
    description: 'Perfect captions for Telegram group chats and discussions',
    icon: '👥',
  },
  {
    id: 'bot',
    slug: 'bot',
    displayName: 'Bot Descriptions',
    description: 'Professional descriptions for Telegram bots',
    icon: '🤖',
  },
  {
    id: 'status',
    slug: 'status',
    displayName: 'Status Updates',
    description: 'Short status messages and quick updates',
    icon: '📌',
  },
  {
    id: 'announcement',
    slug: 'announcement',
    displayName: 'Announcements',
    description: 'Important announcements and news for your audience',
    icon: '📣',
  },
  {
    id: 'promo',
    slug: 'promo',
    displayName: 'Promotional',
    description: 'Marketing and promotional content for channels',
    icon: '🎯',
  },
];

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
  return TG_CATEGORIES.find((cat) => cat.slug === slug);
}

/**
 * 生成静态参数（用于静态生成）
 */
export async function generateStaticParams() {
  return TG_CATEGORIES.map((category) => ({
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

  const title = `TG ${category.displayName} Captions - Best Telegram ${category.displayName} Ideas`;
  const description = `Find the perfect ${category.displayName.toLowerCase()} captions for Telegram. Browse our curated collection of TG captions. Copy and paste ready!`;

  return {
    title,
    description,
    keywords: [
      `tg ${category.displayName.toLowerCase()} captions`,
      `telegram ${category.displayName.toLowerCase()} captions`,
      `tg ${category.slug}`,
      `telegram ${category.slug}`,
      'tg captions',
    ],
    openGraph: {
      title,
      description,
    },
  };
}

/**
 * 生成 Telegram 特定分类的示例文案
 * @param categoryId - 分类 ID
 * @returns 示例文案列表
 */
function generateTelegramCaptions(categoryId: string): GeneratedCaption[] {
  /** 各分类对应的示例文案模板 */
  const captionTemplates: Record<string, string[]> = {
    channel: [
      '📢 Breaking news just dropped! Stay tuned for more updates 👆',
      '🔥 Hot content alert! This one is going to be epic',
      '💎 Exclusive content for our subscribers only',
      '🚀 Big announcement loading... You don\'t want to miss this!',
      '✨ Fresh updates delivered straight to your feed',
      '📌 Pin this one! Important information inside',
    ],
    group: [
      '👋 Welcome to the community! Introduce yourself below',
      '💬 Let\'s discuss! Drop your thoughts in the comments',
      '🎉 Group milestone achieved! Thank you all for being here',
      '📋 Quick poll: What content do you want to see more of?',
      '🤝 Community guidelines reminder - Let\'s keep it friendly!',
      '💡 Pro tip from the community shared below',
    ],
    bot: [
      '🤖 Your intelligent assistant is ready to help',
      '⚡ Fast, reliable, and always available for you',
      '🔧 Automate your workflow with this powerful bot',
      '📊 Get instant analytics and insights on demand',
      '🎯 Precision tools for power users',
      '💫 Making your Telegram experience magical',
    ],
    status: [
      '🟢 Online and ready to create amazing content',
      '📍 Currently working on something exciting',
      '💭 Thoughts of the day incoming...',
      '🌟 Feeling inspired and motivated today',
      '⚡ High energy mode activated',
      '🎯 Focused on delivering value to you',
    ],
    announcement: [
      '📣 IMPORTANT: Major update coming soon!',
      '🎉 Exciting news! We\'ve reached a new milestone',
      '⚠️ Schedule change notice - Please read',
      '🆕 New features now available for everyone',
      '🙏 Thank you for your support and patience',
      '📅 Mark your calendars - Big event ahead',
    ],
    promo: [
      '🎁 Limited time offer! Don\'t miss out',
      '🔥 Hot deal alert! Exclusive for our members',
      '💰 Special discount just for you',
      '⏰ Last chance to grab this amazing offer',
      '🌟 Premium content now at special price',
      '📦 New arrivals you\'ll absolutely love',
    ],
  };

  const templates = captionTemplates[categoryId] || [
    '📢 Stay connected for more updates',
    '💡 Fresh content coming your way',
    '✨ Something special is brewing',
    '🚀 Exciting times ahead',
    '🔔 Don\'t miss our latest updates',
    '💎 Premium content for you',
  ];

  return templates.map((content) => ({
    id: generateUniqueId(),
    content,
    formattedContent: content,
    hashtags: ['telegram', 'tg', categoryId],
    characterCount: content.length,
  }));
}

/**
 * Telegram 分类详情页面组件
 */
export default async function TelegramCategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  // 分类不存在时返回 404
  if (!category) {
    notFound();
  }

  // 获取示例文案
  const captions = generateTelegramCaptions(category.id);

  return (
    <div className="flex flex-col">
      {/* 面包屑导航 */}
      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/tg-captions" className="hover:text-primary">
              TG Captions
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium">
              {category.displayName}
            </span>
          </nav>
        </div>
      </section>

      {/* Hero 区域 */}
      <section className="py-12 bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* 返回链接 */}
            <Link 
              href="/tg-captions"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to all TG categories
            </Link>
            
            {/* 分类图标和标题 */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-3xl">{category.icon}</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  TG {category.displayName} Captions
                </h1>
                <p className="text-muted-foreground mt-2">
                  {category.description}
                </p>
              </div>
            </div>
            
            {/* CTA 按钮 */}
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href={`/generator?platform=telegram&category=${category.id}`}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate {category.displayName} Captions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 文案列表 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Best TG {category.displayName} Captions
            </h2>
            
            <CaptionList
              captions={captions}
              platform={PlatformId.TELEGRAM}
              showHashtags={false}
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* 情绪/风格筛选区域 */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Browse by Style</h2>
            <div className="flex flex-wrap gap-3">
              {MOODS_CONFIG.map((mood) => (
                <Link
                  key={mood.id}
                  href={`/generator?platform=telegram&mood=${mood.id}`}
                >
                  <Badge
                    variant="secondary"
                    className="text-base py-2 px-4 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    <span className="mr-2">{mood.icon}</span>
                    {mood.displayName}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 相关分类 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related TG Categories</h2>
            <div className="flex flex-wrap gap-3">
              {TG_CATEGORIES
                .filter((cat) => cat.id !== category.id)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/tg-captions/${cat.slug}`}
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
      <section className="py-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need More {category.displayName} Captions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let AI generate unique captions tailored for your Telegram {category.displayName.toLowerCase()}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href={`/generator?platform=telegram&category=${category.id}`}>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate More Captions
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
