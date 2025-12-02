/**
 * AI 文案生成 API 路由
 * @description 处理文案生成请求，调用 AI 服务生成文案
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateCaptions, validateGenerateRequest } from '@/services/ai-service';
import { GenerateRequest, ApiResponse, GenerateResponse } from '@/types';

/**
 * POST /api/generate
 * @description 接收生成参数，调用 AI 生成文案
 * @param request - Next.js 请求对象
 * @returns 生成响应
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<GenerateResponse>>> {
  try {
    // 解析请求体
    const body = await request.json() as GenerateRequest;
    
    // 验证请求参数
    const validation = validateGenerateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errors.join(', '),
          errorCode: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    // 调用 AI 服务生成文案
    const result = await generateCaptions(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Generation failed',
          errorCode: 'GENERATION_ERROR',
        },
        { status: 500 }
      );
    }

    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Generate API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        errorCode: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/generate
 * @description 处理 CORS 预检请求
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
