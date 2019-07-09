type HTTPMethods = 'get' | 'delete' | 'post' | 'put'
type URLParamsObj = { [key: string]: string | number | boolean }

interface TwitterUser {
  id_str: string
  screen_name: string
  name: string
  blocked_by: boolean
  blocking: boolean
  muting: boolean
  followed_by: boolean
  friends_count: number
  followers_count: number
  protected: boolean
  verified: boolean
  created_at: string // datetime example: 'Sun Jun 29 05:52:09 +0000 2014'
  description: string
  profile_image_url_https: string
}

interface TwitterUserWithDeprecatedProps extends TwitterUser {
  following: boolean
  follow_request_sent: boolean
}

interface TwitterUserEntities {
  [userId: string]: TwitterUser
}

interface FollowsListResponse {
  next_cursor_str: string
  users: TwitterUser[]
}

interface UserIdsResponse {
  next_cursor_str: string
  ids: string[]
}

type FollowKind = 'followers' | 'friends'

type ConnectionType =
  | 'following'
  | 'following_requested'
  | 'followed_by'
  | 'blocking'
  | 'blocked_by'
  | 'muting'
  | 'none'

interface Friendship {
  name: string
  screen_name: string
  id_str: string
  connections: ConnectionType[]
}

type FriendshipResponse = Friendship[]

interface Relationship {
  source: {
    id_str: string
    screen_name: string
    following: boolean
    followed_by: boolean
    live_following: boolean
    following_received: boolean
    following_requested: boolean
    notifications_enabled: boolean
    can_dm: boolean
    can_media_tag: boolean
    blocking: boolean
    blocked_by: boolean
    muting: boolean
    want_retweets: boolean
    all_replies: boolean
    marked_spam: boolean
  }
  target: {
    id_str: string
    screen_name: string
    following: boolean
    followed_by: boolean
    following_received: boolean
    following_requested: boolean
  }
}

interface Limit {
  limit: number
  remaining: number
  reset: number
}

interface LimitStatus {
  application: {
    '/application/rate_limit_status': Limit
  }
  blocks: {
    // note: POST API (create, destroy) not exists.
    '/blocks/list': Limit
    '/blocks/ids': Limit
  }
  followers: {
    '/followers/ids': Limit
    '/followers/list': Limit
  }
  friends: {
    '/friends/list': Limit
    '/friends/ids': Limit
  }
}

interface EventStore {
  [eventName: string]: Function[]
}

interface EitherRight<T> {
  ok: true
  value: T
}

interface EitherLeft<E> {
  ok: false
  error: E
}

type Either<E, T> = EitherLeft<E> | EitherRight<T>

interface RBStartMessage {
  action: Action.StartChainBlock
  userName: string
  options: ChainBlockSessionOptions
}

interface RBStopMessage {
  action: Action.StopChainBlock
  sessionId: string
}

interface RBRequestProgressMessage {
  action: Action.RequestProgress
}

type RBMessage = RBStartMessage | RBStopMessage | RBRequestProgressMessage

declare namespace uuid {
  function v1(): string
}

interface ChainBlockSessionInfo {
  sessionId: string
  progress: ChainBlockSessionProgress
  status: ChainBlockSessionStatus
  target: {
    user: TwitterUser
    // totalCount: 맞팔로우 체인의 경우, 실행시작 시점에선 정확한 사용자 수를 알 수 없다.
    // 따라서, null을 통해 '아직 알 수 없음'을 표현한다.
    totalCount: number | null
  }
  options: ChainBlockSessionOptions
  // limits?: Limit
  limit: Limit | null
}

interface ChainBlockSessionProgress {
  alreadyBlocked: number
  skipped: number
  blockSuccess: number
  blockFail: number
  totalScraped: number
}

interface ChainBlockSessionInit {
  sessionId: string
  targetUser: TwitterUser
  options: ChainBlockSessionOptions
}

interface ChainBlockSessionOptions {
  targetList: 'followers' | 'friends' // | 'mutual-followers'
  myFollowers: 'skip' | 'block'
  myFollowings: 'skip' | 'block'
}

// ---- browser notification types ----

interface BrowserNotificationButton {
  title: string
  iconUrl?: string
}

interface BrowserNotificationItem {
  title: string
  message: string
}

interface BrowserNotification {
  type: 'basic' | 'image' | 'list' | 'progress'
  iconUrl: string
  title: string
  message: string
  contextMessage?: string
  priority: 0 | 1 | 2 // -2, -1 does not support on some platform
  eventTime?: number
  buttons?: BrowserNotificationButton[]
  items: BrowserNotificationItem[]
  imageUrl?: string
  progress?: number
}

type BNotificationOptions = browser.notifications.NotificationOptions

// ---- context menu ----

declare namespace browser {
  export import contextMenus = browser.menus
}
