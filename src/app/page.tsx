/**
 * 首页组件
 * @description 网站首页，包含 AI 文案生成器入口、平台导航和 SEO 结构化数据
 * @module app/page
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
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PLATFORMS_CONFIG, CATEGORIES_CONFIG, SITE_CONFIG } from '@/config/constants';
import { PlatformId } from '@/types';
import { HeroGenerator } from '@/components/generator/hero-generator';
import { HomePageJsonLd } from '@/components/seo';

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
    title: 'AI-Powered Magic',
    description: 'Generate unique, engaging captions with advanced AI that understands context and nuance.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get multiple creative options in seconds. Say goodbye to writer\'s block forever.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    icon: Copy,
    title: 'One-Click Ready',
    description: 'Perfectly formatted captions with line breaks and emojis, ready to copy and paste.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    icon: Globe,
    title: 'Multi-Platform',
    description: 'Optimized formats for Telegram, Instagram, and X to maximize your engagement.',
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  },
];

/**
 * 首页组件
 * @returns 首页 JSX
 */
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SEO 结构化数据 */}
      <HomePageJsonLd
        siteName={SITE_CONFIG.name}
        siteUrl={SITE_CONFIG.url}
        description={SITE_CONFIG.description}
        logoUrl={`${SITE_CONFIG.url}/logo.png`}
        searchUrl={`${SITE_CONFIG.url}/search?q={search_term_string}`}
      />
      
      {/* Hero 区域 */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] opacity-30 dark:opacity-20 bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] opacity-20 dark:opacity-10 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] opacity-20 dark:opacity-10 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center mb-12">
            {/* 标签 */}
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Caption Generator
            </div>
            
            {/* 标题 */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Create Perfect{' '}
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Social Media Captions
              </span>{' '}
              in Seconds
            </h1>
            
            {/* 描述 */}
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              {SITE_CONFIG.description}
            </p>
            
            {/* Hero Generator 组件 */}
            <div className="mt-8 w-full animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
              <HeroGenerator />
            </div>
          </div>
        </div>
      </section>

      {/* 统计数据区域 */}
      <section className="py-16 border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: '1,000+', label: 'Caption Templates', icon: '📝' },
              { value: '50K+', label: 'Captions Generated', icon: '✨' },
              { value: '3', label: 'Platforms Supported', icon: '🌐' },
              { value: '12', label: 'Content Categories', icon: '📂' },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 平台选择区域 */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1">
              Multi-Platform Support
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Platform</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get captions optimized specifically for each social media platform&apos;s algorithm and audience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.values(PlatformId).map((platformId) => {
              const config = PLATFORMS_CONFIG[platformId];
              const Icon = platformIcons[platformId];
              
              return (
                <Link key={platformId} href={`/${config.slug}`} className="block h-full">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm group cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="text-center relative pb-2">
                      <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300 shadow-sm">
                        <Icon className="h-10 w-10 text-primary transition-transform duration-300" />
                      </div>
                      <CardTitle className="text-2xl mb-2">{config.displayName}</CardTitle>
                      <CardDescription className="text-base">{config.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center relative">
                      <div className="pt-4 flex items-center justify-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Generate Captions
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 特性展示区域 */}
      <section className="py-24 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1">
              Powerful Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The smartest way to create engaging social media content that converts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <Card key={index} className="border-none shadow-none bg-transparent text-center group hover:bg-muted/30 transition-colors duration-300 rounded-2xl">
                  <CardContent className="pt-8 pb-8">
                    <div className={`mx-auto w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
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
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1">
              Browse Categories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Categories</h2>
            <p className="text-lg text-muted-foreground">
              Find the perfect caption for any occasion
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {CATEGORIES_CONFIG.map((category) => (
              <Link
                key={category.id}
                href={`/captions-for-instagram/${category.slug}`}
              >
                <Badge
                  variant="secondary"
                  className="text-base py-3 px-6 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 rounded-full border border-transparent hover:border-primary/20 shadow-sm hover:shadow-md"
                >
                  <span className="mr-2 text-lg">{category.icon}</span>
                  {category.displayName}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary -z-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        </div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary-foreground">
            Ready to Go Viral?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of creators using AI to level up their social media game.
          </p>
          <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold shadow-xl hover:scale-105 transition-transform" asChild>
            <Link href="/generator">
              <Sparkles className="h-5 w-5 mr-2" />
              Start Generating for Free
            </Link>
          </Button>
          
          <div className="mt-10 flex items-center justify-center space-x-8 text-primary-foreground/80">
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              <span>Free forever plan</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

