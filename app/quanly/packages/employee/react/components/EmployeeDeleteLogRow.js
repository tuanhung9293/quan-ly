'use strict'

import React, { Component } from 'react'
import { intlShape, injectIntl, defineMessages, FormattedTime, FormattedHTMLMessage } from 'react-intl'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ComponentRegistry from 'packages/api/ComponentRegistry'
import * as Constants from '../../lib/constants'
// import { restoreEmployee } from '../actions'

const messages = defineMessages({
  restore: {
    id: 'Form.restore',
    defaultMessage: 'Restore'
  }
})

class EmployeeDeleteLogRow extends Component {
  static propTypes = {
    intl: intlShape
  }

  componentDidMount () {
    this.refs.restore.focus()
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
          <FormattedHTMLMessage id='EmployeeDeleteLogRow.text'
                                defaultMessage='Delete employee <i>{email}</i>.'
                                values={{ email: log.metadata.email }}
          />
        </td>
        <td className='width-200px'>
          <a ref='restore'
             href='javascript:void(0)'
             className='btn btn-xs btn-default pull-right'
          >
            <i className='fa fa-recycle margin-right-5'></i>
            {formatMessage(messages.restore)}
          </a>
        </td>
      </tr>
    )
  }
}

const EmployeeDeleteLogRowClass = injectIntl(
  connect(
    (state) => ({}),
    (dispatch) => ({ actions: bindActionCreators({ }, dispatch) })
  )(EmployeeDeleteLogRow)
)

ComponentRegistry.add('LogRow', function (log) {
  if (log.item_type !== Constants.LOG_ITEM_TYPE || log.action !== Constants.LOG_ACTION_DELETE) {
    return false
  }
  return (
    <EmployeeDeleteLogRowClass key={log.id} log={log}/>
  )
}, '"packages/employee"')

export default EmployeeDeleteLogRowClass
