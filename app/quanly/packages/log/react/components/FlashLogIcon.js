'use strict'

import React, { Component } from 'react'
import { STORE_NAME } from '../../lib/constants'
import { connect } from 'react-redux'
import { Link } from 'react-router'


class FlashLogIcon extends Component {
  static defaultProps = {
    wrapperComponent: 'li',
    link: '/log',
    icon: 'fa fa-terminal',
    component: 'span'
  }

  render () {
    const {
      wrapperComponent: WrapperComponent,
      component: FlashLog,
      link,
      icon,
      actions,
      Log
    } = this.props

    if (Log.display_flash_log) {
      return (
        <WrapperComponent>
          <Link to={link}>
            <i className={icon}></i>
          </Link>
          <FlashLog log={Log.flash_log} />
        </WrapperComponent>
      )
    }

    return (
      <WrapperComponent>
        <Link to={link}>
          <i className={icon}></i>
        </Link>
      </WrapperComponent>
    )
  }
}

export default connect(
  (state) => ({ Log: state[ STORE_NAME ] }),
  (dispatch) => ({})
)(FlashLogIcon)