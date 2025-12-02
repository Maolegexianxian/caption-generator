/**
 * 服务条款页面
 * @description 网站服务条款内容展示
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SITE_CONFIG } from '@/config/constants';

/**
 * 页面元数据
 */
export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${SITE_CONFIG.name}. Read our terms and conditions for using our AI caption generation service.`,
};

/**
 * 服务条款页面组件
 */
export default function TermsOfServicePage() {
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
            <span className="text-foreground font-medium">Terms of Service</span>
          </nav>
        </div>
      </section>

      {/* 主内容区域 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <h1>Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using {SITE_CONFIG.name} (&quot;Service&quot;), you accept 
              and agree to be bound by these Terms of Service. If you do not agree to 
              these terms, please do not use our Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              {SITE_CONFIG.name} is an AI-powered caption generation tool that helps users 
              create social media captions for platforms including Telegram, Instagram, 
              and X (Twitter). The Service includes:
            </p>
            <ul>
              <li>AI caption generation based on user inputs</li>
              <li>Pre-generated caption templates</li>
              <li>Hashtag recommendations</li>
              <li>Copy and formatting tools</li>
            </ul>

            <h2>3. User Responsibilities</h2>
            <h3>3.1 Acceptable Use</h3>
            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
            <ul>
              <li>Use the Service to generate harmful, offensive, or illegal content</li>
              <li>Attempt to bypass or circumvent any security measures</li>
              <li>Use automated tools to access the Service without permission</li>
              <li>Impersonate any person or entity</li>
              <li>Use generated content for spam or harassment</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>

            <h3>3.2 Content Responsibility</h3>
            <p>
              You are solely responsible for the content you generate and share using our Service. 
              We do not endorse or guarantee the accuracy, quality, or appropriateness of 
              AI-generated content.
            </p>

            <h2>4. Intellectual Property</h2>
            <h3>4.1 Our Content</h3>
            <p>
              The Service, including its design, features, and functionality, is owned by 
              {SITE_CONFIG.name} and is protected by copyright, trademark, and other intellectual 
              property laws.
            </p>

            <h3>4.2 Generated Content</h3>
            <p>
              Captions generated through our Service are provided for your personal or 
              commercial use. You may use, modify, and share the generated content freely. 
              However, we cannot guarantee the uniqueness of generated content.
            </p>

            <h2>5. AI-Generated Content Disclaimer</h2>
            <p>
              Our Service uses artificial intelligence to generate captions. Please note:
            </p>
            <ul>
              <li>AI-generated content may not always be accurate or appropriate</li>
              <li>We do not guarantee the uniqueness of generated captions</li>
              <li>You should review all content before posting to social media</li>
              <li>AI may occasionally produce unexpected or unsuitable results</li>
            </ul>

            <h2>6. Service Availability</h2>
            <p>
              We strive to maintain Service availability but do not guarantee uninterrupted 
              access. We reserve the right to:
            </p>
            <ul>
              <li>Modify or discontinue any feature without notice</li>
              <li>Perform maintenance that may temporarily affect availability</li>
              <li>Limit access to certain features or users</li>
            </ul>

            <h2>7. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, {SITE_CONFIG.name.toUpperCase()} 
              SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
              OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </p>
            <p>
              Our total liability shall not exceed the amount you paid us (if any) in the 
              twelve (12) months preceding the claim.
            </p>

            <h2>8. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless {SITE_CONFIG.name} and its affiliates 
              from any claims, damages, losses, or expenses arising from your use of the 
              Service or violation of these Terms.
            </p>

            <h2>9. Privacy</h2>
            <p>
              Your use of the Service is also governed by our{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>

            <h2>10. Third-Party Services</h2>
            <p>
              Our Service integrates with third-party platforms (Telegram, Instagram, X). 
              Your use of those platforms is subject to their respective terms of service. 
              We are not responsible for third-party platforms&apos; policies or actions.
            </p>

            <h2>11. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users 
              of significant changes by posting a notice on our website. Continued use of 
              the Service after changes constitutes acceptance of the new Terms.
            </p>

            <h2>12. Termination</h2>
            <p>
              We may terminate or suspend your access to the Service immediately, without 
              prior notice, for any reason, including breach of these Terms.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable 
              laws, without regard to conflict of law principles.
            </p>

            <h2>14. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining 
              provisions will continue in full force and effect.
            </p>

            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul>
              <li>Email: legal@{SITE_CONFIG.domain}</li>
              <li>Website: {SITE_CONFIG.url}</li>
            </ul>

            <h2>16. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement 
              between you and {SITE_CONFIG.name} regarding the use of our Service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
