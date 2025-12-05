/**
 * 日志工具函数
 * 在生产环境中禁用所有日志输出，只在开发环境中打印
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * 日志输出函数
 */
export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

/**
 * 客户端日志工具（用于浏览器环境）
 * 通过检查 window 对象来判断环境
 */
export const clientLogger = {
  log: (...args: any[]) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.info(...args);
    }
  },
  debug: (...args: any[]) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.debug(...args);
    }
  },
};

