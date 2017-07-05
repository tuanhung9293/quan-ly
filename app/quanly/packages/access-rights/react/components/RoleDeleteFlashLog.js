'use strict'

import React, { PureComponent } from 'react'
import { intlShape, injectIntl, defineMessages, FormattedHTMLMessage } from 'react-intl'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ComponentRegistry from 'packages/api/ComponentRegistry'
import { restoreRole } from '../actions'
import * as Constants from '../../lib/constants'

const messages = defineMessages({
  restore: {
    id: 'Form.restore',
    defaultMessage: 'Restore'
  }
})

class RoleDeleteFlashLog extends PureComponent {
  static propTypes = {
    intl: intlShape
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { log, actions } = this.props

    return (
      <div>
        <FormattedHTMLMessage id='RoleDeleteFlashLog.text'
                              defaultMessage='Role <code>{name}</code> is deleted successfully'
                              values={{ name: log.metadata.name }}
        />

        <a href='javascript:void(0)'
           className='margin-left-10'
           onClick={() => actions.restoreRole({ id: log.item_id })}
        >
          {formatMessage(messages.restore)}
        </a>
        <br />
      </div>
    )
  }
}

const RoleDeleteFlashLogClass = injectIntl(
  connect(
    (state) => ({}),
    (dispatch) => ({ actions: bindActionCreators({ restoreRole }, dispatch) })
  )(RoleDeleteFlashLog)
)

ComponentRegistry.add('FlashLog', function (log) {
  if (log.item_type !== Constants.LOG_ITEM_TYPE_ROLE || log.action !== Constants.LOG_ACTION_DELETE) {
    return false
  }
  return (
    <RoleDeleteFlashLogClass log={log}/>
  )
}, '"packages/access-rights"')

export default RoleDeleteFlashLogClass