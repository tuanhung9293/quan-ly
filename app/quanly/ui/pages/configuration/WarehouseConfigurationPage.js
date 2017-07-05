'use strict'

import React, { Component } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Page from '../Page'
import { EmptyBlock, FormBlock } from '../../../packages/oneui'
import {
  WAREHOUSE_CONFIGURATION_STORE,
  WarehouseNavList,
  WarehouseCreateForm,
  WarehouseUpdateForm,
  WarehouseActions
} from '../../../packages/warehouse'
import { browserHistory } from 'react-router'

const messages = defineMessages({
  pageTitle: {
    id: 'WarehouseConfigurationPage.page-title',
    defaultMessage: 'Warehouse Configuration'
  },
  warehouseListHeader: {
    id: 'WarehouseConfigurationPage.warehouseListHeader',
    defaultMessage: 'Warehouse'
  }
})

class WarehouseConfigurationPage extends Component {
  static PATH = '/configuration/warehouse(/:id)'
  static BASE_URL = '/configuration/warehouse/'
  static propTypes = {
    intl: intlShape
  }

  componentWillMount () {
    const { dispatch, actions, params, location } = this.props

    dispatch(actions.setLoading(true))
    actions.joinRoom()
    actions.getWarehouses()
      .then((respond) => {
        if (typeof params.id !== 'undefined') {
          const warehouse = respond.warehouses.find((item) => (item.id === params.id))
          if (!warehouse) {
            return Page.error404(location.pathname)
          }
          dispatch(actions.selectWarehouseById(warehouse.id))
        } else if (respond.warehouses.length > 0) {
          dispatch(actions.selectWarehouseById(respond.warehouses[ 0 ].id))
        }

        dispatch(actions.setLoading(false))
      })
  }

  componentDidUpdate () {
    const { data, params, location } = this.props
    if (data.warehouses.isEmpty() && location.pathname !== WarehouseConfigurationPage.BASE_URL) {
      return Page.replace(WarehouseConfigurationPage.BASE_URL)
    }
    if (data.selected !== null && data.selected !== undefined && data.selected.id !== params.id) {
      return Page.replace(WarehouseConfigurationPage.BASE_URL + data.selected.id)
    }
  }

  componentWillUnmount () {
    this.props.actions.leaveRoom()
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { data, actions, dispatch, intl } = this.props

    return (
      <Page title={formatMessage(messages.pageTitle)}
            name={messages.pageTitle}
            {...this.props}
      >
        <div className='row'>
          <div className='col-xs-12 col-sm-4'>
            <EmptyBlock intl={intl}
                        title={messages.warehouseListHeader}
            >
              <WarehouseNavList warehouses={data.warehouses}
                                selected={data.selected}
                                loading={data.loading}
                                onSelect={actions.selectWarehouseById}
                                baseUrl={WarehouseConfigurationPage.BASE_URL}
                                intl={intl}
              />
              <br />
              <WarehouseCreateForm intl={intl} />
            </EmptyBlock>
          </div>
          {data.selected &&
          <div className='col-xs-12 col-sm-8'>
            <FormBlock title={data.selected.name}
                       edit={() => {actions.toggleEditMode()}}
                       delete={() => {
                         actions.deleteWarehouse({ id: data.selected.id })
                       }}
            >
              <WarehouseUpdateForm warehouse={data.selected}
                                   editMode={this.props.data.show_update_form}
                                   onCancel={() => actions.toggleEditMode(false)}
                                   intl={this.props.intl}
              />
            </FormBlock>
          </div>
          }
        </div>
      </Page>
    )
  }
}

export default injectIntl(connect(
  (state, ownProps) => ({
    data: state[ WAREHOUSE_CONFIGURATION_STORE ]
  }),
  (dispatch) => ({
    dispatch: dispatch,
    actions: bindActionCreators(WarehouseActions, dispatch)
  })
)(WarehouseConfigurationPage))
