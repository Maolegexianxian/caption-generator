/**
 * Telegram Captions 专题页面
 * @description 专为 Telegram 优化的文案专题页，用于 SEO 和用户浏览
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Sparkles, Users, Radio, Bot, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CaptionList } from '@/components/caption/caption-list';
import { SimplifiedGenerator } from '@/components/generator/simplified-generator';
import { MOODS_CONFIG, PLATFORMS_CONFIG } from '@/config/constants';
import { PlatformId, GeneratedCaption } from '@/types';
import { generateUniqueId } from '@/lib/utils';

/**
 * 页面元数据 - SEO 优化
 */
export const metadata: Metadata = {
  title: 'TG Captions - Best Telegram Channel & Group Captions 2024',
  description: 'Find the perfect TG captions for your Telegram channels and groups. Browse our collection of Telegram captions for channels, announcements, and posts. Copy and paste ready!',
  keywords: [
    'tg captions',
    'telegram captions',
    'telegram channel captions',
    'telegram group captions',
    'telegram bio',
    'telegram quotes',
    'telegram status',
  ],
  openGraph: {
    title: 'TG Captions - Best Telegram Caption Ideas',
    description: 'Find the perfect TG captions for your Telegram channels and groups. Browse our collection of Telegram captions.',
  },
};

/**
 * 平台配置
 */
const platformConfig = PLATFORMS_CONFIG[PlatformId.TELEGRAM];

/**
 * Telegram 特定分类
 */
const telegramCategories = [
  {
    id: 'channel',
    name: 'Channel Posts',
    description: 'Captions for Telegram channel announcements',
    icon: Radio,
  },
  {
    id: 'group',
    name: 'Group Messages',
    description: 'Captions for Telegram group chats',
    icon: Users,
  },
  {
    id: 'bot',
    name: 'Bot Descriptions',
    description: 'Descriptions for Telegram bots',
    icon: Bot,
  },
  {
    id: 'status',
    name: 'Status Updates',
    description: 'Short status messages and updates',
    icon: Bell,
  },
];

/**
 * 生成 Telegram 示例文案
 */
function generateTelegramCaptions(): GeneratedCaption[] {
  const captions = [
    "📢 New update just dropped! Check it out 👆",
    "🔥 Hot content coming your way. Stay tuned!",
    "💡 Daily dose of inspiration for you",
    "🚀 Big announcement loading...",
    "📌 Important: Don't miss this one!",
    "✨ Fresh content, just for you",
    "🎯 Quick update for my subscribers",
    "💎 Premium content unlocked",
    "🌟 Something special is brewing",
    "📣 Attention! News incoming...",
    "🔔 Turn on notifications to never miss an update",
    "💪 Motivation Monday hits different",
  ];

  return captions.map((content) => ({
    id: generateUniqueId(),
    content,
    formattedContent: content,
    hashtags: ['telegram', 'channel', 'subscribe'],
    characterCount: content.length,
  }));
}

/**
 * Telegram Captions 专题页面组件
 */
export default function TelegramCaptionsPage() {
  const captions = generateTelegramCaptions();

  return (
    <div className="flex flex-col">
      {/* Hero 区域 */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            {/* 平台图标 */}
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            
            {/* 标题 - H1 */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              TG Captions
            </h1>
            
            {/* 描述 */}
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {platformConfig.description}. Find engaging captions for your Telegram channels, 
              groups, and bot descriptions. All captions are optimized for Telegram&apos;s format.
            </p>
          </div>

          {/* 内嵌简化版生成器 */}
          <div className="max-w-2xl mx-auto">
            <SimplifiedGenerator
              platform={PlatformId.TELEGRAM}
              title="Quick TG Caption Generator"
              description="Enter your topic and get AI-generated Telegram captions instantly"
              themeClass="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border shadow-lg"
              buttonClass="bg-[#229ED9] hover:bg-[#1a8bc7] text-white"
            />
          </div>
        </div>
      </section>

      {/* Telegram 特定分类 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Caption Types for Telegram</h2>
            <p className="text-muted-foreground">
              Different caption styles for different Telegram use cases
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {telegramCategories.map((cat) => {
              const Icon = cat.icon;
              
              return (
                <Link key={cat.id} href={`/tg-captions/${cat.id}`}>
                  <Card className="text-center hover:shadow-md transition-shadow cursor-pointer group h-full">
                    <CardHeader>
                      <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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

      {/* 情绪/风格筛选区域 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Style</h2>
            <p className="text-muted-foreground">
              Choose captions that match your channel&apos;s vibe
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
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
      </section>

      {/* 示例文案列表 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Popular TG Captions</h2>
            
            <CaptionList
              captions={captions}
              platform={PlatformId.TELEGRAM}
              showHashtags={false}
            />
          </div>
        </div>
      </section>

      {/* SEO 内容区域 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <h2>Tips for Writing Great Telegram Captions</h2>
            
            <h3>1. Keep It Concise</h3>
            <p>
              Telegram users appreciate quick, scannable content. Your first line should 
              immediately convey the main message and hook readers to continue.
            </p>
            
            <h3>2. Use Emojis Wisely</h3>
            <p>
              Emojis help break up text and add visual interest. Use them at the beginning 
              of posts to catch attention, but don&apos;t overdo it.
            </p>
            
            <h3>3. Add a Clear Call-to-Action</h3>
            <p>
              Whether it&apos;s asking users to share, comment, or click a link, always 
              include a clear next step for your audience.
            </p>
            
            <h3>4. Match Your Channel&apos;s Tone</h3>
            <p>
              Whether your channel is professional, casual, or humorous, maintain 
              consistency in your caption style to build brand recognition.
            </p>
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Level Up Your Telegram Content?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let AI help you write engaging captions that grow your channel
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/generator?platform=telegram">
              <Sparkles className="h-5 w-5 mr-2" />
              Try the AI Generator
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
