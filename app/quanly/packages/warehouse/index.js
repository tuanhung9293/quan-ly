/* Copyright (c) 2016 timugz (timugz@gmail.com) */
'use strict'

export WarehouseConfigurationReducer from './react/reducers/WarehouseConfigurationReducer'
export { WAREHOUSE_CONFIGURATION_STORE } from './react/reducers/WarehouseConfigurationReducer'

export * from './lib/constants'
export * from './react/actions'

import * as WarehouseActions from './react/actions'
import * as ActionTypes from './lib/actionTypes'
export { WarehouseActions, ActionTypes }

export WarehouseNavList from './react/components/WarehouseNavList'
export WarehouseDeleteFlashLog from './react/components/WarehouseDeleteFlashLog'
export WarehouseDeleteLogRow from './react/components/WarehouseDeleteLogRow'
export WarehouseCreateForm from './react/components/WarehouseCreateForm'
export WarehouseUpdateForm from './react/components/WarehouseUpdateForm'
export FormControlWarehouse from './react/components/FormControlWarehouse'
