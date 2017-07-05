'use strict'

import React, { Component } from 'react'
import { Popover } from 'react-bootstrap'


export default class FlashLogPopover extends Component {
  render () {
    return (
      <Popover id="popover-flash-log-popover"
               placement='bottom'
               positionTop={50}
               positionLeft={-400}
               arrowOffsetLeft={422}
               style={{ opacity: 0.75, maxWidth: 500, width: 500 }}>
        {this.props.children}
      </Popover>
    )
  }
}
