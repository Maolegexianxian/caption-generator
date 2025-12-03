/**
 * SEO 组件模块索引
 * @description 导出所有 SEO 相关组件
 * @module components/seo
 */

// JSON-LD 结构化数据组件
export {
  JsonLd,
  OrganizationJsonLd,
  WebSiteJsonLd,
  SoftwareApplicationJsonLd,
  BreadcrumbJsonLd,
  FAQJsonLd,
  ArticleJsonLd,
  ItemListJsonLd,
  HowToJsonLd,
  CombinedJsonLd,
  HomePageJsonLd,
  PlatformPageJsonLd,
  CategoryPageJsonLd,
} from './json-ld';

// JSON-LD 类型
export type { BreadcrumbItem as JsonLdBreadcrumbItem, FAQItem } from './json-ld';

// 面包屑导航组件
export {
  Breadcrumb,
  BreadcrumbContainer,
  getHomeBreadcrumb,
  getPlatformBreadcrumbs,
  getCategoryBreadcrumbs,
  getGeneratorBreadcrumbs,
  getFAQBreadcrumbs,
  getPrivacyBreadcrumbs,
  getTermsBreadcrumbs,
} from './breadcrumb';

// 面包屑类型
export type { BreadcrumbItem } from './breadcrumb';
