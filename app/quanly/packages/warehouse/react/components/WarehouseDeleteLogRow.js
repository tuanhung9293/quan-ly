'use strict'

import React, { PureComponent } from 'react'
import { intlShape, injectIntl, defineMessages, FormattedTime, FormattedHTMLMessage } from 'react-intl'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ComponentRegistry from 'packages/api/ComponentRegistry'
import { restoreWarehouse } from '../actions'
import * as Constants from '../../lib/constants'

const messages = defineMessages({
  restore: {
    id: 'Form.restore',
    defaultMessage: 'Restore'
  }
})

class WarehouseDeleteLogRow extends PureComponent {
  static propTypes = {
    intl: intlShape
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { log, actions } = this.props

    return (
      <tr>
        <td className='width-100px'>
          <FormattedTime value={new Date(log.created_at)}/>
        </td>
        <td>
          <FormattedHTMLMessage id='WarehouseDeleteLogRow.text'
                                defaultMessage='Delete warehouse <i>{name}</i>.'
                                values={{ name: log.metadata.name }}
          />
        </td>
        <td className='width-200px'>
          <a ref='restore'
             href='javascript:void(0)'
             className='btn btn-xs btn-default pull-right'
             onClick={() => actions.restoreWarehouse({ id: log.item_id })}
          >
            <i className='fa fa-recycle margin-right-5'></i>
            {formatMessage(messages.restore)}
          </a>
        </td>
      </tr>
    )
  }
}

const WarehouseDeleteLogRowClass = injectIntl(
  connect(
    (state) => ({}),
    (dispatch) => ({ actions: bindActionCreators({ restoreWarehouse }, dispatch) })
  )(WarehouseDeleteLogRow)
)

ComponentRegistry.add('LogRow', function (log) {
  if (log.item_type !== Constants.LOG_ITEM_TYPE || log.action !== Constants.LOG_ACTION_DELETE) {
    return false
  }
  return (
    <WarehouseDeleteLogRowClass key={log.id} log={log}/>
  )
}, '"packages/warehouse"')

export default WarehouseDeleteLogRowClass