'use strict'

import React, { Component } from 'react'
import { STORE_NAME } from '../../lib/constants'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import ComponentRegistry from 'packages/api/ComponentRegistry'

class FlashLogIcon extends Component {
  static defaultProps = {
    link: '/log',
    type: 'success'
  }

  render () {
    const { type, link, Log } = this.props

    if (Log.display_flash_log) {
      var flashLogComponent = ComponentRegistry.get('FlashLog', Log.flash_log)
      return (
        <div id='app-flash-log' className={'fadeOut fadeIn alert alert-' + type}>
          <Link to={link} className={'btn btn-' + type}>
            <i className='fa fa-terminal'></i>
          </Link>
          <div className='animated slideInDown'>
            {flashLogComponent}
          </div>
        </div>
      )
    }

    return (
      <div id='app-flash-log' className='anumated fadeOut'>
        <Link to={link} className='btn btn-default'>
          <i className='fa fa-terminal'></i>
        </Link>
        <div className='animated slideOutDown'></div>
      </div>
    )
  }
}

export default connect(
  (state) => ({ Log: state[ STORE_NAME ] })
)(FlashLogIcon)