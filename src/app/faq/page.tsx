/**
 * 常见问题页面
 * @description FAQ 页面，回答用户常见问题，包含 FAQ 结构化数据
 * @module app/faq/page
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SITE_CONFIG } from '@/config/constants';
import { GLOBAL_SEO_CONFIG, FAQ_PAGE_SEO } from '@/config/seo';
import { 
  FAQJsonLd, 
  Breadcrumb, 
  BreadcrumbContainer,
  type BreadcrumbItem,
  type FAQItem
} from '@/components/seo';

/**
 * 页面元数据 - SEO 优化
 * @description FAQ 页面完整的 SEO 元数据配置
 */
export const metadata: Metadata = {
  title: FAQ_PAGE_SEO.title,
  description: FAQ_PAGE_SEO.description,
  keywords: FAQ_PAGE_SEO.keywords,
  alternates: {
    canonical: `${SITE_CONFIG.url}/faq`,
  },
  openGraph: {
    title: FAQ_PAGE_SEO.openGraph?.title || FAQ_PAGE_SEO.title,
    description: FAQ_PAGE_SEO.openGraph?.description || FAQ_PAGE_SEO.description,
    url: `${SITE_CONFIG.url}/faq`,
    type: 'website',
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: GLOBAL_SEO_CONFIG.defaultOgImage,
        width: GLOBAL_SEO_CONFIG.ogImageWidth,
        height: GLOBAL_SEO_CONFIG.ogImageHeight,
        alt: 'Caption Generator FAQ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: FAQ_PAGE_SEO.title,
    description: FAQ_PAGE_SEO.description,
    images: [GLOBAL_SEO_CONFIG.defaultOgImage],
  },
};

/**
 * FAQ 数据
 */
const faqs = [
  {
    id: '1',
    question: 'What is Caption Generator?',
    answer: `${SITE_CONFIG.name} is an AI-powered tool that helps you create engaging captions for social media platforms including Telegram, Instagram, and X (Twitter). Our AI generates unique, platform-optimized captions based on your topics, keywords, and preferred style.`,
  },
  {
    id: '2',
    question: 'Is Caption Generator free to use?',
    answer: 'Yes! Our basic caption generation features are completely free to use. You can generate captions, browse our template library, and copy them to your clipboard without any cost.',
  },
  {
    id: '3',
    question: 'How does the AI caption generation work?',
    answer: 'Our AI uses advanced language models to understand your input (topic, keywords, mood) and generates relevant, engaging captions. The AI considers platform-specific requirements like character limits and hashtag conventions to ensure optimal results.',
  },
  {
    id: '4',
    question: 'Which platforms are supported?',
    answer: 'Currently, we support three major platforms: Telegram (channels and groups), Instagram (posts, Reels, Stories), and X/Twitter (tweets and threads). Each platform has specific optimizations for character limits, hashtag usage, and formatting.',
  },
  {
    id: '5',
    question: 'Can I use the generated captions commercially?',
    answer: 'Absolutely! All captions generated through our service are yours to use freely for personal or commercial purposes. You can modify, share, and post them on any platform without attribution.',
  },
  {
    id: '6',
    question: 'How many captions can I generate at once?',
    answer: 'Each generation request produces 5-10 unique captions. You can generate as many times as you need to find the perfect caption for your content.',
  },
  {
    id: '7',
    question: 'Are the generated captions unique?',
    answer: 'Our AI creates captions based on your specific inputs, making each generation unique. However, since AI models learn from existing content, we recommend reviewing and personalizing captions before posting to ensure they perfectly match your voice.',
  },
  {
    id: '8',
    question: 'What are the category pages (e.g., Travel, Food)?',
    answer: 'Category pages are curated collections of captions organized by theme. They include pre-generated captions, relevant hashtags, and an embedded generator for quick access. These pages are great for finding inspiration and copying ready-to-use captions.',
  },
  {
    id: '9',
    question: 'How do hashtags work?',
    answer: 'Our AI suggests relevant hashtags based on your topic and platform. For Instagram, we recommend up to 30 hashtags for maximum reach. For X/Twitter, we suggest 1-2 hashtags to maintain readability. Telegram typically uses fewer hashtags.',
  },
  {
    id: '10',
    question: 'Can I generate captions in different languages?',
    answer: 'Yes! We support multiple languages including English, Spanish, French, German, Portuguese, Italian, Chinese, Japanese, Korean, and Arabic. Select your preferred language in the generator settings.',
  },
  {
    id: '11',
    question: 'What if I don\'t like the generated captions?',
    answer: 'Simply click "Regenerate" to get a fresh batch of captions. You can also adjust your inputs (keywords, mood, length) to guide the AI toward different styles. Try being more specific with your keywords for better results.',
  },
  {
    id: '12',
    question: 'Do you store my generated captions?',
    answer: 'We may temporarily store generation data for service improvement purposes, but we do not permanently store or share your specific captions. Your creative content remains yours. Please review our Privacy Policy for more details.',
  },
];

/**
 * 面包屑配置
 */
const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'FAQ', isCurrent: true },
];

/**
 * 将 FAQ 数据转换为 JSON-LD 格式
 */
const faqJsonLdItems: FAQItem[] = faqs.map((faq) => ({
  question: faq.question,
  answer: faq.answer,
}));

/**
 * FAQ 页面组件
 * @description 常见问题页面，包含 FAQ 结构化数据和面包屑导航
 * @returns FAQ 页面 JSX
 */
export default function FAQPage() {
  return (
    <div className="flex flex-col">
      {/* FAQ Schema 结构化数据 */}
      <FAQJsonLd items={faqJsonLdItems} />

      {/* 面包屑导航 */}
      <BreadcrumbContainer>
        <Breadcrumb items={breadcrumbItems} />
      </BreadcrumbContainer>

      {/* 标题区域 */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about using {SITE_CONFIG.name}
          </p>
        </div>
      </section>

      {/* FAQ 列表 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-8">
            Try our AI Caption Generator and see the magic for yourself!
          </p>
          <Button size="lg" asChild>
            <Link href="/generator">
              <Sparkles className="h-5 w-5 mr-2" />
              Try Generator Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
