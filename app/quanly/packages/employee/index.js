/* Copyright (c) 2016 timugz (timugz@gmail.com) */
'use strict'

import * as Constants from './lib/constants'
import reducer from './react/reducer'
export { reducer }
export const EmployeeReducer = {
  [Constants.STORE_NAME]: reducer
}

import * as actionTypes from './lib/actionTypes'
export { actionTypes }

export * from './react/actions'
export * from './lib/constants'

export EmployeeDeleteLogRow from './react/components/EmployeeDeleteLogRow'
export EmployeeDeleteFlashLog from './react/components/EmployeeDeleteFlashLog'
export EmployeeTable from './react/components/EmployeeTable'
export EmployeeCreateForm from './react/components/EmployeeCreateForm'
export EmployeeUpdateForm from './react/components/EmployeeUpdateForm'
export EmployeeUpdateModal from './react/components/EmployeeUpdateModal'
