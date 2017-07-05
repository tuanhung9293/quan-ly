'use strict'

import Lodash from 'lodash'
import React, { Component } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Page from './Page'
import { EmptyBlock, Block } from '../../packages/oneui'
import { initialize as formInitialize, submit as formSubmit } from 'redux-form'
import {
  SUPPLIER_STORE,
  SupplierGroupNavList,
  SupplierGroupCreateForm,
  SupplierUpdateModal,
  SuppliersTabs,
  SupplierGroupSettingsTab,
  SupplierMembersTab,
  SupplierActions
} from '../../packages/supplier'
import { browserHistory } from 'react-router'

const messages = defineMessages({
  pageTitle: {
    id: 'SupplierPage.page-title',
    defaultMessage: 'Supplier'
  },
  supplierGroupListHeader: {
    id: 'SupplierPage.supplierGroupListHeader',
    defaultMessage: 'Supplier Group'
  }
})

class SupplierPage extends Component {
  static PATH = '/supplier(/:tab/:id)'
  static BASE_URL = '/supplier/'
  static propTypes = {
    intl: intlShape
  }

  componentWillMount () {
    const { dispatch, actions, params, location } = this.props

    actions.joinRoom()
    actions.getGroups()
      .then((respond) => {
        if (typeof params.id !== 'undefined' && params.tab !== 'undefined') {
          const supplier_group = respond.supplier_groups.find((item) => (item.id === params.id))
          if (!supplier_group) {
            return Page.error404(location.pathname)
          }
          dispatch(actions.selectGroupById(supplier_group.id))
          dispatch(actions.selectTab(params.tab))
        } else if (respond.supplier_groups.length > 0) {
          dispatch(actions.selectGroupById(respond.supplier_groups[ 0 ].id))
        }

      })
    actions.getSuppliers()
  }

  componentDidUpdate () {
    const { data, params, location } = this.props
    if ((data.selected_group !== null && typeof data.selected_group !== 'undefined' && data.selected_group.id !== params.id) &&
      (data.tab && data.tab !== params.tab)) {
      return Page.replace(SupplierPage.BASE_URL + data.tab + '/' + data.selected_group.id)
    }
  }

  componentWillUnmount () {
    this.props.actions.leaveRoom()
  }

  selectGroup (id) {
    const { actions } = this.props
    actions.selectGroupById(id)
    actions.getSuppliers(id)
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { data, actions, dispatch, intl } = this.props

    return (
      <Page title={formatMessage(messages.pageTitle)}
            name={messages.pageTitle}
            {...this.props}
      >
        <div ref={(div) => {this.supplierUpdateModalContainer = div}}
             className='modal-container'>
          <SupplierUpdateModal container={this.supplierUpdateModalContainer}
                               supplierData={data.updating_supplier}
                               onHide={actions.closeUpdateSupplierModal}
                               onEnter={actions.formInitialize}
                               onSubmit={actions.updateSupplier}
                               formSubmit={actions.formSubmit}
                               intl={intl}
          />
          <div className='row'>
            <div className='col-xs-12 col-sm-3'>
              <EmptyBlock intl={intl}
                          title={messages.supplierGroupListHeader}
              >
                <SupplierGroupNavList supplier_groups={data.supplier_groups}
                                      selected_group={data.selected_group}
                                      currentTab={data.tab}
                                      loading={data.group_loading}
                                      onSelect={(id) => this.selectGroup(id)}
                                      baseUrl={SupplierPage.BASE_URL}
                                      intl={intl}
                />
                <br />
                <SupplierGroupCreateForm intl={intl}/>
              </EmptyBlock>
            </div>

            {data.selected_group &&
            <div className='col-xs-12 col-sm-9'>
              <Block>
                <SuppliersTabs supplierGroup={data.selected_group}
                               tab={data.tab}
                               onSelectTab={actions.selectTab}
                               intl={intl}
                />
                <div className="tab-content">
                  {
                    data.tab === 'settings' &&
                    <SupplierGroupSettingsTab supplierGroup={data.selected_group}
                                              loading={data.group_loading}
                                              editMode={data.show_update_group_form}
                                              actionToggleEditGroup={actions.ToggleEditGroupMode}
                                              onDeleteClick={() => actions.deleteGroup({ id: data.selected_group.id })}
                                              intl={intl}
                    />
                  }
                  {
                    data.tab === 'members' &&
                    <SupplierMembersTab loading={data.supplier_loading}
                                        suppliers={data.suppliers}
                                        supplierGroupId={data.selected_group.id}
                                        enableClick={actions.enableSupplier}
                                        disableClick={actions.disableSupplier}
                                        editClick={actions.openUpdateSupplierModal}
                                        deleteClick={actions.deleteSupplier}
                                        unAssignClick={actions.unassignSupplier}
                                        intl={intl}
                    />
                  }
                </div>
              </Block>
            </div>
            }
          </div>
        </div>
      </Page>
    )
  }
}

export default injectIntl(connect(
  (state, ownProps) => ({
    data: state[ SUPPLIER_STORE ]
  }),
  (dispatch) => ({
    dispatch: dispatch,
    actions: bindActionCreators(Lodash.assign({}, SupplierActions, { formInitialize, formSubmit }), dispatch)
  })
)(SupplierPage))
