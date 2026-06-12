/**
 * 轻量类型声明 — 仅覆盖本项目用到的小程序 API。
 * 微信开发者工具的 TypeScript 编译插件按「仅转译」处理，类型仅用于编辑器提示。
 */

type PageInstance = {
  data: any
  setData(data: Record<string, any>, callback?: () => void): void
  getTabBar?(): { setData(data: Record<string, any>): void } | undefined
}

interface IAppOption {
  globalData: {
    statusBarHeight: number
    windowWidth: number
    windowHeight: number
    pixelRatio: number
    safeAreaBottom: number
    pendingMatchCode: string
  }
  [key: string]: any
}

declare function App<T extends Record<string, any>>(options: T & ThisType<T & IAppOption>): void

declare function Page(options: Record<string, any> & ThisType<PageInstance & Record<string, any>>): void

declare function Component(options: Record<string, any> & ThisType<Record<string, any>>): void

declare function getApp<T = IAppOption>(): T

declare function getCurrentPages(): Array<{ route: string;[key: string]: any }>

declare function setTimeout(handler: () => void, timeout?: number): number

interface WindowInfo {
  statusBarHeight: number
  windowWidth: number
  windowHeight: number
  screenHeight: number
  pixelRatio: number
  safeArea: { top: number; bottom: number; left: number; right: number; height: number; width: number }
}

declare const wx: {
  getWindowInfo(): WindowInfo
  getSystemInfoSync(): WindowInfo
  getStorageSync(key: string): any
  setStorageSync(key: string, data: any): void
  removeStorageSync(key: string): void
  navigateTo(options: { url: string; success?: () => void; fail?: () => void }): void
  navigateBack(options?: { delta?: number; fail?: () => void }): void
  redirectTo(options: { url: string; fail?: () => void }): void
  switchTab(options: { url: string; success?: () => void; fail?: () => void }): void
  showToast(options: { title: string; icon?: 'success' | 'error' | 'none' | 'loading'; duration?: number }): void
  showModal(options: {
    title?: string
    content?: string
    confirmText?: string
    cancelText?: string
    confirmColor?: string
    success?: (res: { confirm: boolean; cancel: boolean }) => void
  }): void
  showShareMenu(options: { withShareTicket?: boolean; menus?: string[] }): void
  setNavigationBarTitle(options: { title: string }): void
  createSelectorQuery(): {
    select(selector: string): {
      fields(opts: { node?: boolean; size?: boolean }, cb?: (res: any) => void): any
    }
    exec(cb?: (res: any[]) => void): void
  }
  createCanvasContext(canvasId: string): any
  canvasToTempFilePath(options: {
    canvas?: any
    x?: number
    y?: number
    width?: number
    height?: number
    destWidth?: number
    destHeight?: number
    success?: (res: { tempFilePath: string }) => void
    fail?: () => void
  }): void
  saveImageToPhotosAlbum(options: { filePath: string; success?: () => void; fail?: () => void }): void
}

declare namespace WechatMiniprogram {
  interface PageLoadOption {
    [key: string]: string | undefined
  }

  interface TouchEvent {
    currentTarget: {
      dataset: Record<string, unknown>
    }
  }

  type CanvasContext = any
}
