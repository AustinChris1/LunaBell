// Mirrors nimiq/nimpay-website utils/deeplink.ts so launches match the official site.

export const APP_STORE_URL = 'https://apps.apple.com/app/nimiq-pay/id6471844738'
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.nimiq.pay'
export const APP_PACKAGE_NAME = 'com.nimiq.pay'
export const IOS_STORE_FALLBACK_MS = 5000

// The App Link host Nimiq Pay registers; the app handles it even for unlisted mini apps.
const APP_LINK_HOST = 'nimpay.app'

export type Platform = 'ios' | 'android' | null

export function detectMobilePlatform(): Platform {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  if (/Android/i.test(ua)) return 'android'
  if (/iPad|iPhone|iPod/i.test(ua)) return 'ios'
  if (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua)) return 'ios'
  return null
}

export function buildOpenPath(targetUrl: string): string {
  const u = new URL(targetUrl)
  const path = u.pathname === '/' ? '' : u.pathname
  return `/miniapps/open/${u.host}${path}${u.search}`
}

// Chrome's intent scheme bypasses the same origin block and carries a store fallback.
export function buildAndroidIntentUrl(targetUrl: string): string {
  const path = buildOpenPath(targetUrl).replace(/;/g, '%3B').replace(/#/g, '%23')
  return `intent://${APP_LINK_HOST}${path}#Intent;scheme=https;package=${APP_PACKAGE_NAME};S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`
}

export function buildIosCustomSchemeUrl(targetUrl: string): string {
  return `nimiqpay://miniapp?url=${encodeURIComponent(targetUrl)}`
}

// Opens the given LunaBell URL inside Nimiq Pay, or sends the user to the store.
export function openInNimiqPay(targetUrl: string): void {
  const platform = detectMobilePlatform()
  if (platform === 'android') {
    window.location.href = buildAndroidIntentUrl(targetUrl)
    return
  }
  if (platform === 'ios') {
    const started = Date.now()
    window.location.href = buildIosCustomSchemeUrl(targetUrl)
    window.setTimeout(() => {
      // still on this page after the grace period means the app was not installed
      if (document.visibilityState === 'visible' && Date.now() - started < IOS_STORE_FALLBACK_MS + 1500) {
        window.location.href = APP_STORE_URL
      }
    }, IOS_STORE_FALLBACK_MS)
    return
  }
  // desktop browsers have nowhere to hand off to; the scheme is the best effort
  window.location.href = buildIosCustomSchemeUrl(targetUrl)
}
