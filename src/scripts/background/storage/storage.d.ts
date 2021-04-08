type InactivePeriod = 'never' | '1y' | '2y' | '3y'
type NonLinkedMentionPattern = 'common' | 'aggressive'

interface RedBlockStorage {
  savedUsers: TwitterUser[]
  bookmarks: BookmarkItem[]
  options: {
    removeSessionAfterComplete: boolean
    skipInactiveUser: InactivePeriod
    revealBioBlockMode: boolean
    enableAntiBlock: boolean
    firstPartyIsolationCompatibleMode: boolean
    throttleBlockRequest: boolean
    muteEvenAlreadyBlocking: boolean
  }
  badWords: BadWordItem[]
}

type RedBlockOptions = RedBlockStorage['options']

type RedBlockStorageChanges = {
  [key in keyof RedBlockStorage]: {
    oldValue: RedBlockStorage[key]
    newValue: RedBlockStorage[key]
  }
}
