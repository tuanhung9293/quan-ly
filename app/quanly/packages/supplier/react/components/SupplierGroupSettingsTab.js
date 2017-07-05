'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, defineMessages } from 'react-intl'
import { FormBlock } from 'packages/oneui'
import SupplierGroupUpdateForm from './SupplierGroupUpdateForm'

const SupplierGroupSettingsTab = function (props) {
  const { loading, editMode, actionToggleEditGroup, onDeleteClick, supplierGroup } = props

  if (loading || !supplierGroup) {
    return (
      <div className='text-center'><i className='fa fa-spinner fa-2x fa-spin text-info'></i></div>
    )
  }

  return (
    <FormBlock title={supplierGroup.name}
               border={false}
               edit={supplierGroup.id === 'all' ? undefined : () => actionToggleEditGroup()}
               delete={supplierGroup.id === 'all' ? undefined : () =>onDeleteClick()}
    >
      <SupplierGroupUpdateForm supplierGroup={supplierGroup}
                               editMode={editMode}
                               onCancel={() => actionToggleEditGroup()}
      />
    </FormBlock>
  )
}
SupplierGroupSettingsTab.propTypes = {
  intl: intlShape,
  supplierGroup: PropTypes.object,
  actionToggleEditGroup: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
}
export default SupplierGroupSettingsTab