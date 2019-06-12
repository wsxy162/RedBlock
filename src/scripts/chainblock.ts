interface ChainBlockProgress {
  total: number
  alreadyBlocked: number
  skipped: number
  blockSuccess: number
  blockFail: number
}

interface ChainBlockProgressUpdate {
  reason: 'alreadyBlocked' | 'skipped' | 'blockSuccess' | 'blockFail'
  user: TwitterUser
}

const enum ChainBlockUIState {
  Initial,
  Running,
  RateLimited,
  Completed,
  Stopped,
  Closed,
  Error,
}

const blocker = new ChainBlocker()

async function doChainBlock(targetUserName: string) {
  try {
    const targetUser = await TwitterAPI.getSingleUserByName(targetUserName)
    // TODO: check protect&non-following
    // if (targetUser.protected && !following) {
    //   window.alert(i18n`script_alert_unable_to_protected_user`)
    // }
    if (targetUser.followers_count <= 0) {
      window.alert('차단할 팔로워가 없습니다.')
      return
    }
    const confirmMessage = `정말로 ${targetUserName}에게 체인블락을 실행하시겠습니까?`
    if (window.confirm(confirmMessage)) {
      blocker.add(targetUser)
      blocker.show()
      await sleep(3000)
      blocker.start()
    }
  } catch (err) {
    if (err instanceof TwitterAPI.RateLimitError) {
      window.alert('리밋입니다. 나중에 다시 시도해주세요.')
    } else {
      throw err
    }
  }
}

browser.runtime.onMessage.addListener((msgobj: object) => {
  const message = msgobj as RBMessage
  switch (message.action) {
    case Action.StartChainBlock:
      {
        if (document.querySelector('.mobcb-bg') != null) {
          window.alert('Mirror Block 작동중엔 사용할 수 없습니다.')
          return
        }
        void doChainBlock(message.userName)
      }
      break
  }
})
