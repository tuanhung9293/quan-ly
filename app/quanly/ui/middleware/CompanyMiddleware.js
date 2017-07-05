/* Copyright (c) 2016 timugz (timugz@gmail.com) */
'use strict'

import React, { Component, Children } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { STORE_NAME } from 'packages/oneui'
import * as companyMiddlewareActions from './companyMiddlewareActions'

class CompanyMiddleware extends Component {
  componentWillMount () {
    this.props.actions.start()
  }

  componentWillUnmount () {
    this.props.actions.stop()
  }

  render () {
    const { OneUI } = this.props
    if (!OneUI.ready) {
      return (
        <div></div>
      )
    }

    return Children.only(this.props.children)
  }
}

export default connect(
  (state, ownProps) => ({ OneUI: state[ STORE_NAME ] }),
  (dispatch) => ({
    actions: bindActionCreators(companyMiddlewareActions, dispatch)
  })
)(CompanyMiddleware)
