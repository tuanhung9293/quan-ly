'use strict'

import React, { Component } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { EmptyBlock } from 'packages/oneui'
import Page from '../Page'
import { initialize as formInitialize, submit as formSubmit } from 'redux-form'
import {
  STORE_NAME,
  EmployeeTable,
  EmployeeCreateForm,
  EmployeeUpdateModal,
  getEmployees,
  joinRoom,
  leaveRoom,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  enableEmployee,
  disableEmployee,
  openUpdateEmployeeModal,
  closeUpdateEmployeeModal
} from '../../../packages/employee'

const messages = defineMessages({
  pageTitle: {
    id: 'EmployeeConfigurationPage.page-title',
    defaultMessage: 'Employee Configuration'
  },
  createFormHeaderTitle: {
    id: 'EmployeeConfigurationPage.create-form-header-title',
    defaultMessage: 'Create An Employee'
  },
  tableHeaderTitle: {
    id: 'EmployeeConfigurationPage.table-header-title',
    defaultMessage: 'Employees'
  }
})

class EmployeeConfigurationPage extends Component {
  static propTypes = {
    intl: intlShape
  }

  employeeUpdateModalContainer = null

  componentWillMount () {
    this.props.actions.joinRoom()
    this.props.actions.getEmployees()
  }

  componentWillUnmount () {
    this.props.actions.leaveRoom()
  }

  render () {
    const { data, actions, intl } = this.props

    return (
      <Page title={messages.pageTitle}
            name={messages.pageTitle}
            {...this.props}
      >
        <div ref={(div) => {this.employeeUpdateModalContainer = div}}
             className='modal-container'>
          <EmployeeUpdateModal container={this.employeeUpdateModalContainer}
                               employeeData={data.updating_employee}
                               onHide={actions.closeUpdateEmployeeModal}
                               onEnter={actions.formInitialize}
                               onSubmit={actions.updateEmployee}
                               formSubmit={actions.formSubmit}
          />

          <div className="row">
            <div className="col-xs-12 col-sm-12">
              <EmptyBlock title={messages.createFormHeaderTitle}
                          intl={intl}>
                <EmployeeCreateForm onSubmit={actions.createEmployee}/>
              </EmptyBlock>
            </div>
            <div className="col-xs-12 col-sm-12">
              <EmptyBlock title={messages.tableHeaderTitle}
                          intl={intl}>
                <EmployeeTable loading={data.loading}
                               employees={data.employees}
                               deleteClick={actions.deleteEmployee}
                               updateClick={actions.openUpdateEmployeeModal}
                               enableClick={actions.enableEmployee}
                               disableClick={actions.disableEmployee}
                />
              </EmptyBlock>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

export default injectIntl(connect(
  (state, ownProps) => ({
    form: state.form,
    data: state[ STORE_NAME ]
  }),
  (dispatch) => ({
    actions: bindActionCreators(
      {
        getEmployees,
        joinRoom,
        leaveRoom,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        enableEmployee,
        disableEmployee,
        openUpdateEmployeeModal,
        closeUpdateEmployeeModal,
        formInitialize,
        formSubmit
      },
      dispatch
    )
  })
)(EmployeeConfigurationPage))
