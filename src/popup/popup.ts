import { getUserNameFromURL } from '../scripts/common.js'

type Tab = browser.tabs.Tab

export async function toggleOneClickBlockMode(enabled: boolean) {
  const tab = await getCurrentTab()
  const tabId = tab && tab.id
  if (typeof tabId !== 'number') {
    throw new Error()
  }
  return browser.tabs.sendMessage<RBMessageToContent.ToggleOneClickBlockMode>(tabId, {
    messageType: 'ToggleOneClickBlockMode',
    messageTo: 'content',
    enabled,
  })
}

export async function getCurrentTab(): Promise<Tab> {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  })
  const currentTab = tabs[0]!
  return currentTab
}

export function getUserNameFromTab(tab: Tab): string | null {
  if (!tab.url) {
    return null
  }
  const url = new URL(tab.url)
  return getUserNameFromURL(url)
}

export function getCurrentSearchQueryFromTab(tab: Tab): string | null {
  if (!tab.url) {
    return null
  }
  const url = new URL(tab.url)
  if (!['twitter.com', 'mobile.twitter.com'].includes(url.hostname)) {
    return null
  }
  if (url.pathname !== '/search') {
    return null
  }
  if (url.searchParams.get('f') !== 'user') {
    return null
  }
  return url.searchParams.get('q') || null
}

// 트윗 신고화면에선 사용자 이름 대신 ID가 나타난다.
export function getUserIdFromTab(tab: Tab): string | null {
  if (!tab.url) {
    return null
  }
  const url = new URL(tab.url)
  if (!['twitter.com', 'mobile.twitter.com'].includes(url.host)) {
    return null
  }
  const match1 = /^\/i\/report\/user\/(\d+)/.exec(url.pathname)
  if (match1) {
    return match1[1]
  }
  const reportedUserId = url.pathname.startsWith('/i/safety/report')
    ? url.searchParams.get('reported_user_id')
    : null
  if (reportedUserId) {
    return reportedUserId
  }
  return null
}

export function getTweetIdFromTab(tab: Tab): string | null {
  if (!tab.url) {
    return null
  }
  const url = new URL(tab.url)
  if (!['twitter.com', 'mobile.twitter.com'].includes(url.host)) {
    return null
  }
  const match1 = /\/status\/(\d+)/.exec(url.pathname)
  if (match1) {
    return match1[1]
  }
  // 신고화면에서
  const reportedTweetId = url.pathname.startsWith('/i/safety/report')
    ? url.searchParams.get('reported_tweet_id')
    : null
  if (reportedTweetId) {
    return reportedTweetId
  }
  return null
}

export function determineInitialPurpose(
  myself: TwitterUser | null,
  givenUser: TwitterUser | null
): Purpose {
  if (!(myself && givenUser)) {
    return 'chainblock'
  }
  if (myself.id_str === givenUser.id_str) {
    return 'lockpicker'
  }
  if (givenUser.following) {
    return 'unchainblock'
  }
  return 'chainblock'
}
