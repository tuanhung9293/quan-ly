'use strict'

import { assign } from 'lodash'
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'
import { OneUIReducer } from '../packages/oneui'
import { AccessRightsConfigurationReducer } from '../packages/access-rights'
import { EmployeeReducer } from '../packages/employee'
import { WarehouseConfigurationReducer } from '../packages/warehouse'
import { LogReducer } from '../packages/log'
import { SupplierReducer } from '../packages/supplier'

export default combineReducers(assign(
  {
    form: formReducer,
    routing: routerReducer
  },
  LogReducer,
  OneUIReducer,
  AccessRightsConfigurationReducer,
  EmployeeReducer,
  SupplierReducer,
  WarehouseConfigurationReducer
))
