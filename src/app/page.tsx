/**
 * 首页组件
 * @description 网站首页，包含 AI 文案生成器入口和平台导航
 */

import Link from 'next/link';
import { 
  Sparkles, 
  MessageCircle, 
  Instagram, 
  Twitter, 
  ArrowRight,
  Zap,
  Copy,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PLATFORMS_CONFIG, CATEGORIES_CONFIG, SITE_CONFIG } from '@/config/constants';
import { PlatformId } from '@/types';
import { HeroGenerator } from '@/components/generator/hero-generator';

/**
 * 平台卡片图标映射
 */
const platformIcons: Record<PlatformId, React.ComponentType<{ className?: string }>> = {
  [PlatformId.TELEGRAM]: MessageCircle,
  [PlatformId.INSTAGRAM]: Instagram,
  [PlatformId.X]: Twitter,
};

/**
 * 特性列表
 */
const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Generate unique, engaging captions with advanced AI technology',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get multiple caption options in seconds, not minutes',
  },
  {
    icon: Copy,
    title: 'One-Click Copy',
    description: 'Copy perfectly formatted captions ready for posting',
  },
  {
    icon: Globe,
    title: 'Multi-Platform',
    description: 'Optimized for Telegram, Instagram, and X (Twitter)',
  },
];

/**
 * 首页组件
 * @returns 首页 JSX
 */
export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero 区域 */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* 标签 */}
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Caption Generator
            </Badge>
            
            {/* 标题 */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Create Perfect{' '}
              <span className="text-primary">Social Media Captions</span>{' '}
              in Seconds
            </h1>
            
            {/* 描述 */}
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {SITE_CONFIG.description}
            </p>
            
            {/* CTA 按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/generator">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Start Generating
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/captions-for-instagram">
                  Browse Captions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 平台选择区域 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Platform</h2>
            <p className="text-muted-foreground">
              Get captions optimized for each social media platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Object.values(PlatformId).map((platformId) => {
              const config = PLATFORMS_CONFIG[platformId];
              const Icon = platformIcons[platformId];
              
              return (
                <Link key={platformId} href={`/${config.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{config.displayName}</CardTitle>
                      <CardDescription>{config.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button variant="ghost" className="group-hover:text-primary">
                        Explore Captions
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 特性展示区域 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground">
              The fastest way to create engaging social media content
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 热门分类区域 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Categories</h2>
            <p className="text-muted-foreground">
              Find captions for any occasion
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {CATEGORIES_CONFIG.map((category) => (
              <Link
                key={category.id}
                href={`/captions-for-instagram/${category.slug}`}
              >
                <Badge
                  variant="secondary"
                  className="text-base py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.displayName}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Amazing Captions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start generating engaging content for your social media today
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/generator">
              <Sparkles className="h-5 w-5 mr-2" />
              Try the Generator Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
