'use strict'

import React, { Component } from 'react'
import { Link } from 'react-router'

export default class SidebarNavItem extends Component {
  render() {
    var {url, active, icon, text, tooltip} = this.props

    if (typeof tooltip === 'undefined') {
      tooltip = text
    }

    return (
      <li>
        <Link to={url} title={tooltip} activeClassName={active ? 'active' : ''}>
          <i className={icon + " sidebar-nav-icon"}></i>
          <span className="sidebar-mini-hide">{text}</span>
        </Link>
      </li>
    )
  }
}