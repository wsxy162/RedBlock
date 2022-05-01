import * as MaterialUI from '@mui/material'
import React from 'react'
import * as i18n from '../../scripts/i18n'

import { requestResetCounter } from '../../scripts/background/request-sender'
import { RBAccordion } from '../popup-ui/components'
import { BlockLimiterContext, TabInfoContext } from '../popup-ui/contexts'

const M = MaterialUI
const T = MaterialUI.Typography

export default function BlockLimiterUI() {
  const { current, max } = React.useContext(BlockLimiterContext)
  const { myself } = React.useContext(TabInfoContext)
  function handleResetButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    requestResetCounter(myself!.user.id_str)
  }
  const exceed = current >= max
  const warningIcon = exceed ? '\u26a0\ufe0f' : ''
  return (
    <RBAccordion
      summary={`${warningIcon} ${i18n.getMessage('block_counter')}: [${current} / ${max}]`}
      warning={exceed}
    >
      <M.Box display="flex" flexDirection="row">
        <M.Box flexGrow="1">
          <T component="div" variant="body2">
            {i18n.getMessage('wtf_twitter')}
          </T>
        </M.Box>
        <M.Button
          type="button"
          variant="outlined"
          onClick={handleResetButtonClick}
          disabled={current <= 0}
        >
          Reset
        </M.Button>
      </M.Box>
    </RBAccordion>
  )
}