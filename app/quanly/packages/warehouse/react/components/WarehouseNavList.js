'use strict'

import React  from 'react'
import PropTypes from 'prop-types'
import { intlShape, defineMessages } from 'react-intl'
import { Link } from 'react-router'

const messages = defineMessages({
  noWarehouseYet: {
    id: 'WarehouseConfigurationPage.no_warehouse_yet',
    defaultMessage: 'No warehouse yet'
  }
})

const WarehouseNavList = function ({ loading, baseUrl, warehouses, selected, onSelect, intl }) {
  if (loading) {
    return (
      <div className='text-center'><i className='fa fa-spinner fa-2x fa-spin text-info'></i></div>
    )
  }

  if (warehouses.isEmpty()) {
    return (
      <ul className="nav nav-pills nav-stacked">
        <div className='well text-muted'>{intl.formatMessage(messages.noWarehouseYet)}</div>
      </ul>
    )
  }

  var warehousesItems = warehouses.valueSeq().map(function (item) {
    return (
      <li key={item.id}
          onClick={() => { onSelect(item.id) }}
          className={selected && item.id === selected.id ? 'active' : ''}>
        <Link to={baseUrl + item.id}>{item.name}</Link>
      </li>
    )
  })
  return (
    <ul className="nav nav-pills nav-stacked">
      {warehousesItems}
    </ul>
  )
}

WarehouseNavList.propTypes = {
  intl: intlShape,
  selected: PropTypes.any,
  warehouses: PropTypes.any.isRequired,
  loading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  baseUrl: PropTypes.string.isRequired
}

WarehouseNavList.defaultProps = {
  loading: true
}

export default WarehouseNavList