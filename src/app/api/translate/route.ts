/**
 * 文案翻译 API 路由
 * @description 处理 AI 文案翻译请求
 */

import { NextRequest, NextResponse } from 'next/server';
import { translateCaption, TranslateRequest } from '@/services/ai-service';

/** 支持的语言列表 */
const SUPPORTED_LANGUAGES = ['en', 'zh', 'es', 'pt', 'fr', 'de', 'ja', 'ko', 'ar', 'ru'];

/**
 * POST /api/translate
 * @description 翻译文案内容
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必需字段
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!body.targetLanguage) {
      return NextResponse.json(
        { success: false, error: 'Target language is required' },
        { status: 400 }
      );
    }

    // 验证语言
    const sourceLanguage = body.sourceLanguage || 'en';
    const targetLanguage = body.targetLanguage;

    if (!SUPPORTED_LANGUAGES.includes(targetLanguage)) {
      return NextResponse.json(
        { success: false, error: `Unsupported target language: ${targetLanguage}` },
        { status: 400 }
      );
    }

    // 构建请求
    const translateRequest: TranslateRequest = {
      content: body.content,
      sourceLanguage,
      targetLanguage,
      preserveTone: body.preserveTone !== false,
    };

    // 调用翻译服务
    const result = await translateCaption(translateRequest);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        translatedContent: result.translatedContent,
        sourceLanguage,
        targetLanguage,
      },
    });
  } catch (error) {
    console.error('Translate API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to translate caption',
      },
      { status: 500 }
    );
  }
}
