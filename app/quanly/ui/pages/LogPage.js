'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { bindActionCreators } from 'redux'
import Page from './Page'
import { STORE_NAME, getLogs, joinRoom, leaveRoom, LogByDate } from '../../packages/log'

class LogPage extends Component {
  componentWillMount () {
    this.props.actions.getLogs()
    this.props.actions.joinRoom()
  }

  componentWillUnmount () {
    this.props.actions.leaveRoom()
  }

  render () {
    const { Log } = this.props

    var logByDate = null;
    if (Log.logs) {
      logByDate = Log.logs.keySeq().map(function (dateString) {
        return (
          <LogByDate key={dateString}
                     date={dateString}
                     logs={Log.logs.get(dateString)}
          />
        )
      })
    }

    return (
      <Page {...this.props}
            title='Log'
            name='Log'
      >
        {logByDate}
      </Page>
    )
  }
}

export default injectIntl(connect(
  (state, ownProps) => ({ Log: state[ STORE_NAME ] }),
  (dispatch) => ({ actions: bindActionCreators({ getLogs, joinRoom, leaveRoom }, dispatch) })
)(LogPage))
