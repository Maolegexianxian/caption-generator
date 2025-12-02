/**
 * 数据库连接配置
 * @description 使用 Drizzle ORM 与 better-sqlite3 建立数据库连接
 */

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

/**
 * 数据库文件路径
 * @description 在项目根目录下创建 data 文件夹存储 SQLite 数据库文件
 */
const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'caption-generator.db');

/**
 * SQLite 数据库实例
 * @description 使用 better-sqlite3 创建同步数据库连接
 */
let sqlite: Database.Database | null = null;

/**
 * 获取 SQLite 数据库实例
 * @returns {Database.Database} SQLite 数据库实例
 */
function getSqlite(): Database.Database {
  if (!sqlite) {
    // 确保数据库目录存在
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    sqlite = new Database(DB_PATH);
    // 启用外键约束
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('foreign_keys = ON');
  }
  return sqlite;
}

/**
 * Drizzle ORM 数据库客户端
 * @description 提供类型安全的数据库操作接口
 */
export const db = drizzle(getSqlite(), { schema });

/**
 * 导出所有 Schema 定义
 */
export * from './schema';

/**
 * 数据库类型定义
 */
export type Database = typeof db;
