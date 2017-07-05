'use strict'

import React, { Component } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Page from '../Page'
import { Block, EmptyBlock, FormBlock } from '../../../packages/oneui'
import {
  ACCESS_RIGHTS_CONFIGURATION_STORE,
  AccessRightsConfigurationTabs,
  RoleCreateForm,
  RoleNavList,
  RoleSettingsTab,
  AccessRightsActions
} from '../../../packages/access-rights'

const messages = defineMessages({
  pageTitle: {
    id: 'AccessRightsConfiguration.page_title',
    defaultMessage: 'Access Rights Configuration'
  },
  noRoleYet: {
    id: 'AccessRightsConfiguration.no_role_yet',
    defaultMessage: 'No role yet'
  },
  rolesBlockTitle: {
    id: 'AccessRightsConfiguration.role_block_title',
    defaultMessage: 'Roles'
  }
})

class AccessRightsRoleConfigurationPage extends Component {
  static PATH = '/configuration/access-rights(/:tab/:id)'
  static BASE_URL = '/configuration/access-rights/'

  static propTypes = {
    intl: intlShape
  }

  componentWillMount () {
    const { dispatch, actions, params, location } = this.props

    dispatch(actions.setLoading(true))
    actions.joinRoom()
    actions.getRoles()
      .then((respond) => {
        if (typeof params.id !== 'undefined' && params.tab !== 'undefined') {
          const role = respond.roles.find((item) => (item.id === params.id))
          if (!role) {
            return Page.error404(location.pathname)
          }
          dispatch(actions.selectRoleById(role.id))
          dispatch(actions.selectTab(params.tab))
        } else if (respond.roles.length > 0) {
          dispatch(actions.selectRoleById(respond.roles[ 0 ].id))
        }

        dispatch(actions.setLoading(false))
      })
  }

  componentDidUpdate () {
    const { data, params, location } = this.props
    if ((data.selected !== null && data.selected !== undefined && data.selected.id !== params.id) &&
      (data.tab && data.tab !== params.tab)) {
      return Page.replace(AccessRightsRoleConfigurationPage.BASE_URL + data.tab + '/' + data.selected.id)
    }
  }

  componentWillUnmount () {
    this.props.actions.leaveRoom()
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { data, actions, intl, ...rest } = this.props

    const NotFinishYet = function () {
      return (
        <EmptyBlock border={false}>
          <div className='well'>Not finish yet</div>
        </EmptyBlock>
      )
    }

    return (
      <Page title={messages.pageTitle}
            name={messages.pageTitle}
            {...this.props}
      >
        <div className='row'>
          <div className='col-xs-12 col-sm-4'>
            <EmptyBlock title={messages.rolesBlockTitle}
                        intl={intl}>
              <RoleNavList roles={data.roles}
                           selected={data.selected}
                           loading={data.loading}
                           currentTab={data.tab}
                           onSelect={actions.selectRole}
              />
              <br />
              <RoleCreateForm intl={intl}/>
            </EmptyBlock>
          </div>
          <div className='col-xs-12 col-sm-8'>
            <Block>
              <AccessRightsConfigurationTabs role={data.selected}
                                             tab={data.tab}
                                             onSelectTab={actions.selectTab}
                                             intl={intl}
              />
              <div className='tab-content'>
                {
                  data.tab === 'settings' &&
                  <RoleSettingsTab loading={data.loading}
                                   role={data.selected}
                                   editMode={data.show_role_update_form}
                                   actionToggleEditRole={actions.toggleRoleUpdateFormEditMode}
                                   onDeleteClick={() => actions.deleteRole({ id: data.selected.id })}
                                   intl={intl}
                  />
                }

                {data.tab === 'members' && <NotFinishYet />}
                {data.tab === 'access-table' && <NotFinishYet />}
                {data.tab === 'calendar-rights' && <NotFinishYet />}
              </div>
            </Block>
          </div>
        </div>
      </Page>
    )
  }
}

export default injectIntl(connect(
  (state, ownProps) => ({
    data: state[ ACCESS_RIGHTS_CONFIGURATION_STORE ]
  }),
  (dispatch) => ({
    dispatch: dispatch,
    actions: bindActionCreators(AccessRightsActions, dispatch)
  })
)(AccessRightsRoleConfigurationPage))
