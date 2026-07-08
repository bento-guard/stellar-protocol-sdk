export const logger = {
  info: (message: string, ...meta: any[]) => {
    console.log(`[Bento SDK] INFO: ${message}`, ...meta);
  },
  warn: (message: string, ...meta: any[]) => {
    console.warn(`[Bento SDK] WARN: ${message}`, ...meta);
  },
  error: (message: string, ...meta: any[]) => {
    console.error(`[Bento SDK] ERROR: ${message}`, ...meta);
  },
};
