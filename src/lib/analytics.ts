/**
 * GA4 埋点工具函数
 * 用于统一管理所有 GA4 事件追踪
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * 发送 GA4 事件
 * @param eventName 事件名称
 * @param eventParams 事件参数
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window === 'undefined') {
    return;
  }

  // 确保 dataLayer 存在
  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  // 确保 gtag 函数存在
  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, eventParams || {});
      console.log(`[GA4] 事件已发送: ${eventName}`, eventParams);
    } catch (error) {
      console.error(`[GA4] 发送事件失败: ${eventName}`, error);
      // 如果gtag调用失败，回退到dataLayer
      window.dataLayer.push({
        event: eventName,
        ...(eventParams || {}),
      });
      console.log(`[GA4] 事件已推入 dataLayer (fallback): ${eventName}`, eventParams);
    }
  } else {
    // 如果 gtag 还未加载，将事件推入 dataLayer（GA4标准格式）
    window.dataLayer.push({
      event: eventName,
      ...(eventParams || {}),
    });
    console.log(`[GA4] 事件已推入 dataLayer (gtag未就绪): ${eventName}`, eventParams);
  }
}

/**
 * 点击选择文件
 */
export function trackFileSelectClick() {
  trackEvent('dianji_wenjian_xuanze');
}

/**
 * 选择文件结果
 * @param result 结果：'success' | 'error'
 * @param errorMessage 错误信息（可选）
 */
export function trackFileSelectResult(result: 'success' | 'error', errorMessage?: string) {
  trackEvent('xuanze_wenjian_jieguo', {
    shijian_jieguo: result,
    ...(errorMessage && { error_message: errorMessage }),
  });
}

/**
 * 评分文件结果
 * @param score 评分分数 (0-100)
 * @param result 结果：'success' | 'error'
 * @param errorMessage 错误信息（可选）
 */
export function trackFileScoreResult(score: number, result: 'success' | 'error', errorMessage?: string) {
  trackEvent('pingfen_wenjian_jieguo', {
    shijian_jieguo: result,
    shijian_shuzhi: score,
    ...(errorMessage && { error_message: errorMessage }),
  });
}

/**
 * 点击开始转换
 */
export function trackConvertStart() {
  trackEvent('zhuanhuan_wenjian_kaishi');
}

/**
 * 文件转换结果
 * @param result 结果：'success' | 'error'
 * @param errorMessage 错误信息（可选）
 */
export function trackConvertResult(result: 'success' | 'error', errorMessage?: string) {
  trackEvent('zhuanhuan_wenjian_jieguo', {
    shijian_jieguo: result,
    ...(errorMessage && { error_message: errorMessage }),
  });
}

