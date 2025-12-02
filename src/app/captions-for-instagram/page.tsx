/**
 * Instagram Captions 专题页面
 * @description 专为 Instagram 优化的文案专题页，用于 SEO 和用户浏览
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Instagram, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SimplifiedGenerator } from '@/components/generator/simplified-generator';
import { CATEGORIES_CONFIG, MOODS_CONFIG, PLATFORMS_CONFIG } from '@/config/constants';
import { PlatformId } from '@/types';

/**
 * 页面元数据 - SEO 优化
 */
export const metadata: Metadata = {
  title: 'Captions for Instagram - Best Instagram Caption Ideas 2024',
  description: 'Find the perfect captions for Instagram. Browse our collection of Instagram captions for selfies, travel, food, couples, and more. Copy and paste ready!',
  keywords: [
    'captions for instagram',
    'instagram captions',
    'instagram caption ideas',
    'best instagram captions',
    'instagram quotes',
    'ig captions',
    'instagram bio',
  ],
  openGraph: {
    title: 'Captions for Instagram - Best Instagram Caption Ideas',
    description: 'Find the perfect captions for Instagram. Browse our collection of Instagram captions for selfies, travel, food, couples, and more.',
  },
};

/**
 * 平台配置
 */
const platformConfig = PLATFORMS_CONFIG[PlatformId.INSTAGRAM];

/**
 * Instagram Captions 专题页面组件
 */
export default function InstagramCaptionsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero 区域 */}
      <section className="py-16 bg-gradient-to-b from-pink-50 to-background dark:from-pink-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            {/* 平台图标 */}
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center mb-6">
              <Instagram className="h-10 w-10 text-white" />
            </div>
            
            {/* 标题 - H1 */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Captions for Instagram
            </h1>
            
            {/* 描述 */}
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {platformConfig.description}. Find the perfect caption for your Instagram posts, 
              Reels, and Stories. All captions are optimized with proper formatting and hashtags.
            </p>
          </div>

          {/* 内嵌简化版生成器 */}
          <div className="max-w-2xl mx-auto">
            <SimplifiedGenerator
              platform={PlatformId.INSTAGRAM}
              title="Quick Instagram Caption Generator"
              description="Enter your topic and get AI-generated Instagram captions instantly"
              themeClass="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border shadow-lg"
              buttonClass="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white"
            />
          </div>
        </div>
      </section>

      {/* 分类导航区域 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground">
              Find Instagram captions for every occasion and content type
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {CATEGORIES_CONFIG.map((category) => (
              <Link
                key={category.id}
                href={`/captions-for-instagram/${category.slug}`}
              >
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {category.displayName}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">
                      {category.description}
                    </CardDescription>
                    <div className="flex items-center text-sm text-primary">
                      View Captions
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* 情绪/风格筛选区域 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Mood</h2>
            <p className="text-muted-foreground">
              Choose captions that match your vibe
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {MOODS_CONFIG.map((mood) => (
              <Link
                key={mood.id}
                href={`/captions-for-instagram?mood=${mood.slug}`}
              >
                <Badge
                  variant="secondary"
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

      {/* SEO 内容区域 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <h2>How to Write the Perfect Instagram Caption</h2>
            <p>
              A great Instagram caption can make the difference between a post that gets 
              overlooked and one that goes viral. Here are some tips for crafting the 
              perfect Instagram caption:
            </p>
            
            <h3>1. Hook Your Audience in the First Line</h3>
            <p>
              Instagram only shows the first few words of your caption in the feed. 
              Make those words count by starting with something attention-grabbing.
            </p>
            
            <h3>2. Use Emojis Strategically</h3>
            <p>
              Emojis can make your captions more visually appealing and help break up 
              text. Use them to emphasize key points or add personality.
            </p>
            
            <h3>3. Include a Call-to-Action</h3>
            <p>
              Encourage engagement by asking questions, inviting comments, or directing 
              followers to take action.
            </p>
            
            <h3>4. Optimize Your Hashtags</h3>
            <p>
              Use a mix of popular and niche hashtags to maximize your reach. 
              Instagram allows up to 30 hashtags, but 10-15 well-chosen ones often 
              perform better.
            </p>
            
            <h3>5. Use Our AI Caption Generator</h3>
            <p>
              Save time and get creative inspiration with our AI-powered caption generator. 
              Simply choose your category, mood, and let AI create multiple caption options 
              for you to choose from.
            </p>
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Amazing Instagram Captions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let AI help you write engaging captions that get more likes and comments
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/generator?platform=instagram">
              <Sparkles className="h-5 w-5 mr-2" />
              Try the AI Generator
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
