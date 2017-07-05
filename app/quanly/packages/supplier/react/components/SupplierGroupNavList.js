'use strict'

import React  from 'react'
import PropTypes from 'prop-types'
import { intlShape, defineMessages } from 'react-intl'
import { Link } from 'react-router'

const messages = defineMessages({
  noSupplierGroupYet: {
    id: 'SupplierGroupNavList.no_supplier_group_yet',
    defaultMessage: 'No supplier group yet'
  }
})

const SupplierGroupNavList = function ({ currentTab, loading, baseUrl, supplier_groups, selected_group, onSelect, intl }) {
  if (loading) {
    return (
      <div className='text-center'><i className='fa fa-spinner fa-2x fa-spin text-info'></i></div>
    )
  }

  if (supplier_groups.isEmpty()) {
    return (
      <ul className="nav nav-pills nav-stacked">
        <div className='well text-muted'>{intl.formatMessage(messages.noSupplierGroupYet)}</div>
      </ul>
    )
  }

  var supplierGroupsItems = supplier_groups.valueSeq().map(function (item) {
    return (
      <li key={item.id}
          onClick={() => { onSelect(item.id) }}
          className={selected_group && item.id === selected_group.id ? 'active' : ''}>
        <Link to={baseUrl + currentTab + '/' + item.id}>{item.name}</Link>
      </li>
    )
  })
  return (
    <ul className="nav nav-pills nav-stacked">
      {supplierGroupsItems}
    </ul>
  )
}

SupplierGroupNavList.propTypes = {
  intl: intlShape,
  selected_group: PropTypes.any,
  supplier_groups: PropTypes.any.isRequired,
  loading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  baseUrl: PropTypes.string.isRequired
}

SupplierGroupNavList.defaultProps = {
  group_loading: true
}

export default SupplierGroupNavList