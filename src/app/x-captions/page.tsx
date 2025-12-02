/**
 * X (Twitter) Captions 专题页面
 * @description 专为 X (Twitter) 优化的文案专题页，用于 SEO 和用户浏览
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Twitter, Sparkles, MessageSquare, Repeat2, Quote, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CaptionList } from '@/components/caption/caption-list';
import { MOODS_CONFIG, PLATFORMS_CONFIG } from '@/config/constants';
import { PlatformId, GeneratedCaption } from '@/types';
import { generateUniqueId } from '@/lib/utils';

/**
 * 页面元数据 - SEO 优化
 */
export const metadata: Metadata = {
  title: 'X Captions - Best Twitter Captions & Tweet Ideas 2024',
  description: 'Find the perfect captions for X (Twitter). Browse our collection of tweet ideas, thread starters, and viral post templates. All within 280 characters!',
  keywords: [
    'x captions',
    'twitter captions',
    'tweet ideas',
    'twitter quotes',
    'viral tweets',
    'twitter thread',
    'x post ideas',
  ],
  openGraph: {
    title: 'X Captions - Best Twitter Caption Ideas',
    description: 'Find the perfect captions for X (Twitter). Browse our collection of tweet ideas and viral post templates.',
  },
};

/**
 * 平台配置
 */
const platformConfig = PLATFORMS_CONFIG[PlatformId.X];

/**
 * X 特定分类
 */
const xCategories = [
  {
    id: 'post',
    name: 'Single Posts',
    description: 'Standard tweets under 280 characters',
    icon: MessageSquare,
  },
  {
    id: 'thread',
    name: 'Thread Starters',
    description: 'First tweet of engaging threads',
    icon: Repeat2,
  },
  {
    id: 'quote',
    name: 'Quote Reposts',
    description: 'Captions for quote tweeting',
    icon: Quote,
  },
  {
    id: 'reply',
    name: 'Replies',
    description: 'Engaging reply templates',
    icon: Reply,
  },
];

/**
 * 话题分类
 */
const topicCategories = [
  { id: 'tech', name: 'Tech', icon: '💻' },
  { id: 'crypto', name: 'Crypto', icon: '₿' },
  { id: 'ai', name: 'AI', icon: '🤖' },
  { id: 'startup', name: 'Startup', icon: '🚀' },
  { id: 'life', name: 'Daily Life', icon: '☕' },
  { id: 'humor', name: 'Humor', icon: '😂' },
  { id: 'motivation', name: 'Motivation', icon: '💪' },
  { id: 'opinion', name: 'Hot Takes', icon: '🔥' },
];

/**
 * 生成 X 示例文案
 */
function generateXCaptions(): GeneratedCaption[] {
  const captions = [
    "Unpopular opinion: The best ideas come at 3 AM. 🌙",
    "Hot take: Your network is not your net worth. Your skills are.",
    "Thread: 10 things I wish I knew when I started my career 🧵",
    "Plot twist: The algorithm favors consistency, not perfection.",
    "Controversial but true: Most meetings should be emails.",
    "Real talk: Burnout isn't a badge of honor. Take care of yourself.",
    "The secret to success? Show up. Every. Single. Day. 💯",
    "Reminder: Your comfort zone is not where growth happens.",
    "Spicy take: Slow progress is still progress. Keep going. 🔥",
    "Truth bomb: Nobody has it all figured out. We're all just trying.",
    "Plot twist: The weekend is not for \"catching up on work.\"",
    "Friendly reminder: You don't need permission to start. Just start.",
  ];

  return captions.map((content) => ({
    id: generateUniqueId(),
    content,
    formattedContent: content,
    hashtags: ['trending', 'viral'],
    characterCount: content.length,
  }));
}

/**
 * X Captions 专题页面组件
 */
export default function XCaptionsPage() {
  const captions = generateXCaptions();

  return (
    <div className="flex flex-col">
      {/* Hero 区域 */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-background dark:from-gray-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* 平台图标 */}
            <div className="mx-auto w-20 h-20 rounded-full bg-black flex items-center justify-center mb-6">
              <Twitter className="h-10 w-10 text-white" />
            </div>
            
            {/* 标题 - H1 */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              X Captions
            </h1>
            
            {/* 描述 */}
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {platformConfig.description}. Craft compelling tweets and threads that 
              resonate with your audience. All captions optimized for X&apos;s 280 character limit.
            </p>
            
            {/* CTA 按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/generator?platform=x">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate X Captions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* X 特定分类 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Post Types</h2>
            <p className="text-muted-foreground">
              Different caption styles for different X formats
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {xCategories.map((cat) => {
              const Icon = cat.icon;
              
              return (
                <Link key={cat.id} href={`/x-captions/${cat.id}`}>
                  <Card className="text-center hover:shadow-md transition-shadow cursor-pointer group h-full">
                    <CardHeader>
                      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{cat.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{cat.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* 话题分类 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Topic</h2>
            <p className="text-muted-foreground">
              Find captions for trending topics and niches
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {topicCategories.map((topic) => (
              <Link
                key={topic.id}
                href={`/x-captions/${topic.id}`}
              >
                <Badge
                  variant="secondary"
                  className="text-base py-2 px-4 cursor-pointer hover:bg-black hover:text-white transition-colors"
                >
                  <span className="mr-2">{topic.icon}</span>
                  {topic.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 情绪/风格筛选区域 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Tone</h2>
            <p className="text-muted-foreground">
              Choose the right vibe for your tweets
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {MOODS_CONFIG.map((mood) => (
              <Link
                key={mood.id}
                href={`/generator?platform=x&mood=${mood.id}`}
              >
                <Badge
                  variant="outline"
                  className="text-base py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <span className="mr-2">{mood.icon}</span>
                  {mood.displayName}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 示例文案列表 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Viral Tweet Templates</h2>
            
            <CaptionList
              captions={captions}
              platform={PlatformId.X}
              showHashtags={false}
            />
          </div>
        </div>
      </section>

      {/* SEO 内容区域 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <h2>How to Write Tweets That Get Engagement</h2>
            
            <h3>1. Hook Them in the First Line</h3>
            <p>
              The first few words determine whether someone stops scrolling. 
              Start with something unexpected, controversial, or intriguing.
            </p>
            
            <h3>2. Keep It Under 280 Characters</h3>
            <p>
              X has a strict character limit. Shorter tweets often perform better 
              anyway. Every word should earn its place.
            </p>
            
            <h3>3. Use the Power of Threads</h3>
            <p>
              For longer content, break it into a thread. Start with a compelling 
              hook and number your tweets (1/, 2/, etc.) for clarity.
            </p>
            
            <h3>4. Hashtags: Less is More</h3>
            <p>
              Unlike Instagram, X users prefer 1-2 relevant hashtags at most. 
              Too many hashtags can make your tweet look spammy.
            </p>
            
            <h3>5. Engage with Trending Topics</h3>
            <p>
              Jump on relevant trends while they&apos;re hot. Our AI generator can 
              help you craft timely, engaging responses to current events.
            </p>
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Go Viral?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let AI help you craft tweets that get likes, reposts, and replies
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/generator?platform=x">
              <Sparkles className="h-5 w-5 mr-2" />
              Try the AI Generator
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
