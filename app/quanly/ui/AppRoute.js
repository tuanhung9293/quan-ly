'use strict'

import React, { Component } from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { getRouterHistory } from './configureStore'
import CompanyMiddleware from './middleware/CompanyMiddleware'
import LogPage from './pages/LogPage'
import SupplierPage from './pages/SupplierPage'
import WarehouseConfigurationPage from './pages/configuration/WarehouseConfigurationPage'
import EmployeeConfigurationPage from './pages/configuration/EmployeeConfigurationPage'
import AccessRightsRoleConfigurationPage from './pages/configuration/AccessRightsRoleConfigurationPage'

class AppRouter extends Component {
  componentWillMount () {

  }

  render () {
    return (
      <Router history={getRouterHistory()}>
        <Route path='/' component={CompanyMiddleware}>
          <Route path='log' component={LogPage}/>
          <Route path='supplier(/:tab/:id)' component={SupplierPage}/>
        </Route>
        <Route path='/configuration' component={CompanyMiddleware}>
          <IndexRoute component={WarehouseConfigurationPage}/>
          <Route path='warehouse(/:id)' component={WarehouseConfigurationPage}/>
          <Route path='employee' component={EmployeeConfigurationPage}/>
          <Route path='access-rights(/:tab/:id)' component={AccessRightsRoleConfigurationPage}/>
        </Route>
      </Router>
    )
  }
}

export default AppRouter
