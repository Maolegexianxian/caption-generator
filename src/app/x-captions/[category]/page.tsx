/**
 * X (Twitter) 分类详情页面
 * @description 特定分类的 X 文案页面，用于 SEO 和用户浏览
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, ArrowLeft, ChevronRight, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CaptionList } from '@/components/caption/caption-list';
import { MOODS_CONFIG } from '@/config/constants';
import { PlatformId, GeneratedCaption } from '@/types';
import { generateUniqueId } from '@/lib/utils';

/**
 * X 特定分类配置
 * @description 定义 X 平台的特有分类（帖子类型和话题类型）
 */
const X_CATEGORIES = [
  // 帖子类型
  {
    id: 'post',
    slug: 'post',
    displayName: 'Single Posts',
    description: 'Standard tweets under 280 characters that capture attention',
    icon: '💬',
    type: 'format',
  },
  {
    id: 'thread',
    slug: 'thread',
    displayName: 'Thread Starters',
    description: 'Compelling first tweets to start engaging threads',
    icon: '🧵',
    type: 'format',
  },
  {
    id: 'quote',
    slug: 'quote',
    displayName: 'Quote Reposts',
    description: 'Smart captions for quote tweeting other posts',
    icon: '💭',
    type: 'format',
  },
  {
    id: 'reply',
    slug: 'reply',
    displayName: 'Replies',
    description: 'Engaging reply templates that get noticed',
    icon: '↩️',
    type: 'format',
  },
  // 话题类型
  {
    id: 'tech',
    slug: 'tech',
    displayName: 'Tech',
    description: 'Technology and software related tweets',
    icon: '💻',
    type: 'topic',
  },
  {
    id: 'crypto',
    slug: 'crypto',
    displayName: 'Crypto',
    description: 'Cryptocurrency and Web3 related content',
    icon: '₿',
    type: 'topic',
  },
  {
    id: 'ai',
    slug: 'ai',
    displayName: 'AI',
    description: 'Artificial intelligence and machine learning topics',
    icon: '🤖',
    type: 'topic',
  },
  {
    id: 'startup',
    slug: 'startup',
    displayName: 'Startup',
    description: 'Entrepreneurship and business building content',
    icon: '🚀',
    type: 'topic',
  },
  {
    id: 'life',
    slug: 'life',
    displayName: 'Daily Life',
    description: 'Everyday moments and personal updates',
    icon: '☕',
    type: 'topic',
  },
  {
    id: 'humor',
    slug: 'humor',
    displayName: 'Humor',
    description: 'Funny tweets and witty observations',
    icon: '😂',
    type: 'topic',
  },
  {
    id: 'motivation',
    slug: 'motivation',
    displayName: 'Motivation',
    description: 'Inspirational and motivational content',
    icon: '💪',
    type: 'topic',
  },
  {
    id: 'opinion',
    slug: 'opinion',
    displayName: 'Hot Takes',
    description: 'Bold opinions and controversial takes',
    icon: '🔥',
    type: 'topic',
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
  return X_CATEGORIES.find((cat) => cat.slug === slug);
}

/**
 * 生成静态参数（用于静态生成）
 */
export async function generateStaticParams() {
  return X_CATEGORIES.map((category) => ({
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

  const title = `X ${category.displayName} Captions - Best Twitter ${category.displayName} Ideas`;
  const description = `Find the perfect ${category.displayName.toLowerCase()} captions for X (Twitter). Browse our curated collection of tweet ideas. All under 280 characters!`;

  return {
    title,
    description,
    keywords: [
      `x ${category.displayName.toLowerCase()} captions`,
      `twitter ${category.displayName.toLowerCase()} tweets`,
      `${category.slug} tweet ideas`,
      `x captions ${category.slug}`,
      'x captions',
      'twitter captions',
    ],
    openGraph: {
      title,
      description,
    },
  };
}

/**
 * 生成 X 特定分类的示例文案
 * @param categoryId - 分类 ID
 * @returns 示例文案列表
 */
function generateXCaptions(categoryId: string): GeneratedCaption[] {
  /** 各分类对应的示例文案模板 */
  const captionTemplates: Record<string, string[]> = {
    // 帖子类型
    post: [
      'Unpopular opinion: The best ideas come at 3 AM. 🌙',
      'Plot twist: The algorithm favors consistency, not perfection.',
      'Hot take: Your network is not your net worth. Your skills are.',
      'Real talk: Burnout isn\'t a badge of honor.',
      'The secret to success? Show up. Every. Single. Day. 💯',
      'Reminder: Your comfort zone is not where growth happens.',
    ],
    thread: [
      '🧵 Thread: 10 things I wish I knew when I started my career',
      '🧵 Here\'s everything you need to know about building in public (1/)',
      '🧵 Let me break down the most important lesson I learned this year',
      '🧵 The complete guide to growing your audience from 0 (1/10)',
      '🧵 5 mistakes I made so you don\'t have to (1/)',
      '🧵 Story time: How I went from 0 to 10K followers (1/)',
    ],
    quote: [
      'This. 100% this. 👆',
      'Couldn\'t agree more. Adding this to my daily reminders.',
      'Finally someone said it. 🙌',
      'Saving this for when I need motivation.',
      'This hit different. Needed to hear this today.',
      'The truth that nobody wants to admit 👆',
    ],
    reply: [
      'Great point! I\'d also add that...',
      'This is underrated. More people need to see this.',
      'Adding to this thread because it\'s important 👇',
      'Jumping in here because I have experience with this.',
      'Hot take: I disagree, and here\'s why...',
      'This deserves way more engagement. Sharing.',
    ],
    // 话题类型
    tech: [
      'Just shipped a new feature. The feeling never gets old. 🚀',
      'Debugging for 3 hours to find a missing semicolon. Classic.',
      'The best code is no code. The second best is simple code.',
      'TIL: Sometimes the "stupid" solution is the right solution.',
      'Hot take: Most "best practices" are just opinions.',
      'Every senior dev was once a junior who didn\'t give up.',
    ],
    crypto: [
      'Bull market: Everyone\'s a genius. Bear market: Real builders build.',
      'Not financial advice, but definitely life advice: DYOR.',
      'The next 100x isn\'t about price. It\'s about utility.',
      'Remember: We\'re still early. Really early.',
      'Building through the bear. This is the way. 🐻',
      'WAGMI isn\'t just a phrase. It\'s a mindset.',
    ],
    ai: [
      'AI won\'t replace you. Someone using AI will.',
      'The best AI tool is the one you actually use consistently.',
      'Hot take: Prompt engineering is just clear communication.',
      'We\'re living through the most exciting time in tech history.',
      'AI is a tool. Your creativity is irreplaceable.',
      'The future of work isn\'t human vs AI. It\'s human + AI.',
    ],
    startup: [
      'Idea: 1%. Execution: 99%. The math checks out.',
      'Building in public isn\'t about flexing. It\'s about learning.',
      'The best time to start was yesterday. The second best is now.',
      'Startup lesson #1: Talk to your customers. Then talk more.',
      'Revenue solves most startup problems. Focus there first.',
      'Your first 1000 users matter more than the next 100K.',
    ],
    life: [
      'Reminder: You\'re doing better than you think.',
      'Today\'s agenda: Coffee, hustle, repeat. ☕',
      'Life hack: Small consistent actions beat big sporadic efforts.',
      'Weekend mode: ON. Productivity mode: Also ON. 😅',
      'Plot twist: Rest is actually productive.',
      'Note to self: Progress isn\'t always visible. Keep going.',
    ],
    humor: [
      'My work-life balance is currently more "life" and less "balance".',
      'Meeting that could have been an email: Episode 847',
      'POV: You said "just one more scroll" 2 hours ago.',
      'My code works and I don\'t know why. Don\'t touch it.',
      'Imposter syndrome and confidence taking turns in my brain.',
      'Calendar invite for a meeting about the meeting. Love it.',
    ],
    motivation: [
      'The secret to getting ahead is getting started.',
      'Your future self will thank you for the work you put in today.',
      'Discipline is choosing between what you want now vs. what you want most.',
      'Consistency compounds. Keep showing up.',
      'Dream big. Start small. Act now.',
      'The only person you should compare yourself to is who you were yesterday.',
    ],
    opinion: [
      'Controversial but true: Most meetings should be emails.',
      'Unpopular opinion: Hustle culture is overrated.',
      'Hot take: The 9-5 isn\'t dead. Bad 9-5s are.',
      'Spicy take: Your follower count doesn\'t equal your value.',
      'Bold claim: AI hype > AI reality (for now).',
      'Truth bomb: Nobody has it all figured out. We\'re all learning.',
    ],
  };

  const templates = captionTemplates[categoryId] || [
    'Sharing some thoughts on this beautiful day.',
    'What do you think about this? 👇',
    'Working on something exciting. Stay tuned!',
    'Grateful for another productive day.',
    'Learning something new every day.',
    'The journey continues. Onward! 🚀',
  ];

  return templates.map((content) => ({
    id: generateUniqueId(),
    content,
    formattedContent: content,
    hashtags: ['x', 'twitter', categoryId],
    characterCount: content.length,
  }));
}

/**
 * X 分类详情页面组件
 */
export default async function XCategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  // 分类不存在时返回 404
  if (!category) {
    notFound();
  }

  // 获取示例文案
  const captions = generateXCaptions(category.id);
  
  // 获取同类型的其他分类
  const relatedCategories = X_CATEGORIES.filter(
    (cat) => cat.id !== category.id && cat.type === category.type
  );

  return (
    <div className="flex flex-col">
      {/* 面包屑导航 */}
      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/x-captions" className="hover:text-primary">
              X Captions
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium">
              {category.displayName}
            </span>
          </nav>
        </div>
      </section>

      {/* Hero 区域 */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-background dark:from-gray-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* 返回链接 */}
            <Link 
              href="/x-captions"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to all X categories
            </Link>
            
            {/* 分类图标和标题 */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-black dark:bg-white flex items-center justify-center">
                <span className="text-3xl">{category.icon}</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  X {category.displayName} Captions
                </h1>
                <p className="text-muted-foreground mt-2">
                  {category.description}
                </p>
              </div>
            </div>
            
            {/* CTA 按钮 */}
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href={`/generator?platform=x&category=${category.id}`}>
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
              Best X {category.displayName} Captions
            </h2>
            
            <CaptionList
              captions={captions}
              platform={PlatformId.X}
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
            <h2 className="text-2xl font-bold mb-6">Browse by Tone</h2>
            <div className="flex flex-wrap gap-3">
              {MOODS_CONFIG.map((mood) => (
                <Link
                  key={mood.id}
                  href={`/generator?platform=x&mood=${mood.id}`}
                >
                  <Badge
                    variant="secondary"
                    className="text-base py-2 px-4 cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
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
            <h2 className="text-2xl font-bold mb-6">
              Related {category.type === 'format' ? 'Post Types' : 'Topics'}
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/x-captions/${cat.slug}`}
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
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need More {category.displayName} Content?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let AI generate unique tweets tailored for your {category.displayName.toLowerCase()} style
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href={`/generator?platform=x&category=${category.id}`}>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate More Tweets
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
