/**
 * 单个文案 API 路由
 * @description 获取、更新单个文案
 */

export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getCaptionById, incrementCaptionCopyCount, incrementCaptionViewCount } from '@/services/caption-service';

/**
 * 路由参数类型
 */
interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/captions/[id]
 * @description 获取单个文案详情
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Caption ID is required' },
        { status: 400 }
      );
    }

    const caption = await getCaptionById(id);

    if (!caption) {
      return NextResponse.json(
        { success: false, error: 'Caption not found' },
        { status: 404 }
      );
    }

    // 增加查看次数
    await incrementCaptionViewCount(id);

    return NextResponse.json({
      success: true,
      data: caption,
    });
  } catch (error) {
    console.error('Get caption error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get caption',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/captions/[id]
 * @description 更新文案统计（复制次数等）
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Caption ID is required' },
        { status: 400 }
      );
    }

    // 根据 action 类型更新统计
    const { action } = body;

    switch (action) {
      case 'copy':
        await incrementCaptionCopyCount(id);
        break;
      case 'view':
        await incrementCaptionViewCount(id);
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Caption ${action} count updated`,
    });
  } catch (error) {
    console.error('Update caption error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update caption',
      },
      { status: 500 }
    );
  }
}
