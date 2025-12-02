/**
 * 隐私政策页面
 * @description 网站隐私政策内容展示
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SITE_CONFIG } from '@/config/constants';

/**
 * 页面元数据
 */
export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${SITE_CONFIG.name}. Learn how we collect, use, and protect your personal information.`,
};

/**
 * 隐私政策页面组件
 */
export default function PrivacyPolicyPage() {
  /** 当前日期 */
  const lastUpdated = 'December 2, 2024';

  return (
    <div className="flex flex-col">
      {/* 面包屑导航 */}
      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium">Privacy Policy</span>
          </nav>
        </div>
      </section>

      {/* 主内容区域 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <h1>Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

            <h2>Introduction</h2>
            <p>
              Welcome to {SITE_CONFIG.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). 
              We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information 
              when you visit our website {SITE_CONFIG.url}.
            </p>

            <h2>Information We Collect</h2>
            <h3>Information You Provide</h3>
            <p>We may collect information you provide directly to us, including:</p>
            <ul>
              <li>Keywords and topics you enter when generating captions</li>
              <li>Platform preferences and settings</li>
              <li>Feedback and correspondence you send to us</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our website, we automatically collect certain information:</p>
            <ul>
              <li>Device information (browser type, operating system)</li>
              <li>IP address (anonymized)</li>
              <li>Usage data (pages visited, time spent on pages)</li>
              <li>Referral source (how you found our website)</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our AI caption generation service</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Respond to your inquiries and provide support</li>
              <li>Send you updates about our service (with your consent)</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>

            <h2>Data Storage and Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect 
              your personal data against unauthorized access, alteration, disclosure, 
              or destruction. However, no method of transmission over the Internet is 
              100% secure.
            </p>

            <h2>Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to improve your experience 
              on our website. Cookies are small text files stored on your device that help 
              us remember your preferences and understand how you use our site.
            </p>
            <p>You can manage cookie preferences through your browser settings.</p>

            <h2>Third-Party Services</h2>
            <p>We may use third-party services that collect, monitor, and analyze data:</p>
            <ul>
              <li><strong>OpenAI</strong> - For AI-powered caption generation</li>
              <li><strong>Analytics providers</strong> - For website usage analysis</li>
            </ul>

            <h2>Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>Access to your personal data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Data portability</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <h2>Children&apos;s Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. 
              We do not knowingly collect personal information from children under 13.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you 
              of any changes by posting the new policy on this page and updating the 
              &quot;Last updated&quot; date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@{SITE_CONFIG.domain}</li>
              <li>Website: {SITE_CONFIG.url}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
