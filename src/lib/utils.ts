/**
 * 工具函数库
 * @description 提供项目中通用的工具函数
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 CSS 类名
 * @description 使用 clsx 和 tailwind-merge 智能合并类名
 * @param inputs - 类名参数列表
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 生成唯一 ID
 * @description 生成一个基于时间戳和随机数的唯一标识符
 * @returns 唯一 ID 字符串
 */
export function generateUniqueId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * 复制文本到剪贴板
 * @description 异步复制文本内容到系统剪贴板
 * @param text - 要复制的文本
 * @returns 是否复制成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * 格式化数字
 * @description 将数字格式化为易读的字符串（如 1.2K, 3.5M）
 * @param num - 要格式化的数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * 截断文本
 * @description 如果文本超过指定长度，则截断并添加省略号
 * @param text - 原始文本
 * @param maxLength - 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * 延迟执行
 * @description 返回一个在指定毫秒后 resolve 的 Promise
 * @param ms - 延迟毫秒数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 防抖函数
 * @description 创建一个防抖函数，在指定时间内多次调用只执行最后一次
 * @param fn - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, wait)
  }
}

/**
 * 格式化 Hashtag 数组
 * @description 将 hashtag 数组格式化为带 # 符号的字符串
 * @param hashtags - hashtag 数组（不含 # 符号）
 * @param separator - 分隔符（默认为空格）
 * @returns 格式化后的 hashtag 字符串
 */
export function formatHashtags(hashtags: string[], separator: string = ' '): string {
  return hashtags.map(tag => `#${tag}`).join(separator)
}

/**
 * 验证 URL 是否有效
 * @param url - 要验证的 URL 字符串
 * @returns 是否为有效 URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 获取随机元素
 * @description 从数组中随机获取一个元素
 * @param array - 源数组
 * @returns 随机元素
 */
export function getRandomElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 打乱数组顺序
 * @description 使用 Fisher-Yates 算法打乱数组
 * @param array - 源数组
 * @returns 打乱后的新数组
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
