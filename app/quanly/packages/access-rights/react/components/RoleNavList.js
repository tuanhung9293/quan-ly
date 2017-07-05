'use strict'

import React  from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { CONFIGURATION_BASE_URL } from '../../lib/constants'

const RoleNavList = function ({ loading, roles, selected, currentTab, onSelect }) {
  if (loading) {
    return (
      <div className='text-center'><i className='fa fa-spinner fa-2x fa-spin text-info'></i></div>
    )
  }

  var roleItems = roles.valueSeq().map(function (item) {
    return (
      <li key={item.id}
          onClick={() => { onSelect(item.id) }}
          className={selected && item.id === selected.id ? 'active' : ''}>
        <Link to={CONFIGURATION_BASE_URL + currentTab + '/' + item.id }>
          {item.name}
        </Link>
      </li>
    )
  })
  return (
    <ul className="nav nav-pills nav-stacked">
      {roleItems}
    </ul>
  )
}

RoleNavList.propTypes = {
  roles: PropTypes.any.isRequired,
  loading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
}

RoleNavList.defaultProps = {
  loading: true
}

export default RoleNavList