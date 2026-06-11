type PageInstance = {
  data: any
  setData(data: Record<string, any>): void
}

interface IAppOption {
  globalData: {
    statusBarHeight: number
    windowWidth: number
    windowHeight: number
  }
}

declare function App(options: Record<string, any> & ThisType<any>): void

declare function Page(options: Record<string, any> & ThisType<PageInstance & Record<string, any>>): void

declare function setTimeout(handler: () => void, timeout?: number): number

declare const wx: {
  getWindowInfo(): {
    statusBarHeight: number
    windowWidth: number
    windowHeight: number
  }
  getSystemInfoSync(): {
    statusBarHeight: number
    windowWidth: number
    windowHeight: number
  }
  getStorageSync(key: string): any
  navigateTo(options: { url: string }): void
  navigateBack(options?: { fail?: () => void }): void
  redirectTo(options: { url: string }): void
  setStorageSync(key: string, data: any): void
  removeStorageSync(key: string): void
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
}
