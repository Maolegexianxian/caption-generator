/**
 * Drizzle ORM 配置文件
 * @description 定义数据库迁移和推送配置
 */

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  /** Schema 文件路径 */
  schema: './src/db/schema.ts',
  /** 迁移输出目录 */
  out: './drizzle',
  /** 数据库方言 */
  dialect: 'sqlite',
  /** 数据库连接配置 */
  dbCredentials: {
    url: process.env.DATABASE_PATH || './data/caption-generator.db',
  },
  /** 详细输出 */
  verbose: true,
  /** 严格模式 */
  strict: true,
});
