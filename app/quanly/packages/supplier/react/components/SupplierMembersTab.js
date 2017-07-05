'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, defineMessages } from 'react-intl'
import { EmptyBlock } from 'packages/oneui'
import SupplierCreateForm from './SupplierCreateForm'
import SupplierTable from './SupplierTable'

const messages = defineMessages({
  createFormHeaderTitle: {
    id: 'SupplierPage.create-form-header-title',
    default_message: 'Create A Supplier'
  },
  tableSupplierHeaderTitle: {
    id: 'SupplierPage.table-supplier-header-title',
    default_message: 'Suppliers'
  }
})

const SupplierMembersTab = function (props) {
  const { intl, loading, suppliers, supplierGroupId, enableClick, disableClick, editClick, deleteClick, unAssignClick } = props

  return (
    <div>
      <EmptyBlock title={messages.createFormHeaderTitle} intl={intl}>
        <SupplierCreateForm intl={intl}/>
      </EmptyBlock>

      <EmptyBlock title={messages.tableSupplierHeaderTitle}>
        <SupplierTable loading={loading}
                       suppliers={suppliers}
                       supplierGroupId={supplierGroupId}
                       enableClick={enableClick}
                       disableClick={disableClick}
                       editClick={editClick}
                       deleteClick={deleteClick}
                       unAssignClick={unAssignClick}
                       intl={intl}/>
      </EmptyBlock>
    </div>
  )
}
SupplierMembersTab.propTypes = { intl: intlShape }
export default SupplierMembersTab