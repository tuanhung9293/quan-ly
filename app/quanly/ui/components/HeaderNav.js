'use strict'

import React from 'react'
import { Gravatar } from 'packages/oneui'
import ConfigurationNavList from './ConfigurationNavList'

export default class HeaderNav extends React.Component {
  static defaultProps = {}

  render () {
    return (
      <ul className='nav-header pull-right'>
        <li>
          <ConfigurationNavList location={this.props.location}/>
        </li>
        <li>
          <button className='btn btn-default' type='button'>
            <i className='si si-bell'></i>
          </button>
        </li>
        <li>
          <button className='btn btn-default' type='button'>
            <i className='fa fa-tasks'></i>
          </button>
        </li>
        <li>
          <button className='btn btn-default' type='button'>
            <i className='si si-envelope'></i>
          </button>
        </li>
        <li>
          <button className='btn btn-default btn-image' type='button'>
            <Gravatar email='timugz@gmail.com'/>
            <i className='fa fa-navicon'></i>
          </button>
        </li>
      </ul>
    )
  }
}