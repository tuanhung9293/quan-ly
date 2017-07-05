import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import Classnames from 'classnames'
import { TableRowStatus } from 'packages/oneui'
import { STATUS_ACTIVE, STATUS_INACTIVE } from '../../lib/constants'
import { TableRowAction } from '../../../uilib'
const messages = defineMessages({
  nameColumnHeader: {
    id: 'SupplierTable.nameColumnHeader',
    defaultMessage: 'Name'
  },
  emailColumnHeader: {
    id: 'SupplierTable.emailColumnHeader',
    defaultMessage: 'Email'
  },
  phoneColumnHeader: {
    id: 'SupplierTable.phoneColumnHeader',
    defaultMessage: 'Phone'
  },
  addressColumnHeader: {
    id: 'SupplierTable.addressColumnHeader',
    defaultMessage: 'Address'
  },
  noSupplierYet: {
    id: 'SupplierTable.noSupplierYet',
    defaultMessage: 'There is no supplier yet, please create new one'
  }
})

const SupplierTable = function ({ unAssignClick, supplierGroupId, loading, suppliers, intl, enableClick, disableClick, editClick, deleteClick }) {
  if (loading) {
    return (
      <div className="text-center"><i className="fa fa-spinner fa-2x fa-spin text-info"></i></div>
    )
  }

  if (suppliers === null || suppliers.isEmpty()) {
    return (
      <div className="well text-muted">{intl.formatMessage(messages.noSupplierYet)}</div>
    )
  }

  const supplierRows = suppliers.valueSeq().map(function (supplier) {
    var assignBtn
    if (typeof supplierGroupId !== 'undefined' && supplierGroupId !== 'all') {
      assignBtn = (
        <TableRowAction.Unassign rowId={supplier.id}
                                 href="javascript:void(0)"
                                 onClick={() => unAssignClick({ supplier_group_id: supplierGroupId, supplier_id: supplier.id })}
        />
      )
    }
    return (
      <tr key={supplier.id}
          className={Classnames({ 'text-line-through text-muted': supplier.status === STATUS_INACTIVE })}>
        <td>
          <TableRowStatus rowId={supplier.id}
                          isEnabled={supplier.status === STATUS_ACTIVE}
                          onDisabledClick={() => enableClick({ id: supplier.id })}
                          onEnabledClick={() => disableClick({ id: supplier.id })}
          />
        </td>
        <td>{supplier.name}</td>
        <td>{supplier.email}</td>
        <td>{supplier.phone}</td>
        <td>{supplier.address}</td>
        <td className="text-center">
          <div className="btn-group">
            <TableRowAction.Edit rowId={supplier.id}
                                 href="javascript:void(0)"
                                 onClick={() => editClick({ id: supplier.id })}
            />
            <TableRowAction.Delete rowId={supplier.id}
                                   href="javascript:void(0)"
                                   onClick={() => deleteClick({ id: supplier.id })}
            />
            {assignBtn}
          </div>
        </td>
      </tr>
    )
  })
  return (
    <table className='table table-striped table-borderless table-vcenter'>
      <thead>
      <tr>
        <th className="width-20px"></th>
        <th className="width-20">{intl.formatMessage(messages.nameColumnHeader)}</th>
        <th className="width-15">{intl.formatMessage(messages.emailColumnHeader)}</th>
        <th className="width-15">{intl.formatMessage(messages.phoneColumnHeader)}</th>
        <th className="width-15">{intl.formatMessage(messages.addressColumnHeader)}</th>
        <th className="text-center"><i className="fa fa-flash"></i></th>
      </tr>
      </thead>
      <tbody>
      {supplierRows}
      </tbody>
    </table>
  )
}

SupplierTable.propTypes = {
  intl: intlShape,
  suppliers: PropTypes.any.isRequired,
  loading: PropTypes.bool.isRequired,
  supplierGroupId: PropTypes.any.isRequired,
}

SupplierTable.defaultProps = {
  loading: true
}

export default SupplierTable