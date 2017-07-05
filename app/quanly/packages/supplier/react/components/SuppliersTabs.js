'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { intlShape, injectIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  settings: {
    id: 'SuppliersTabs.settings',
    defaultMessage: 'Settings'
  },
  members: {
    id: 'SuppliersTabs.members',
    defaultMessage: 'Members'
  }
})

const Link = function ({ url, active, icon, text, onClick }) {
  return (
    <LinkContainer to={url}
                   active={active}
                   onClick={onClick}
    >
      <NavItem eventKey='settings' active={true}>
        <i className={icon + ' margin-right-5'}></i>
        {text}
      </NavItem>
    </LinkContainer>
  )
}

const SuppliersTabs = function ({ supplierGroup, tab, onSelectTab, intl }) {
  if (typeof supplierGroup === 'undefined' || supplierGroup === null) {
    return (<div></div>)
  }
  return (
    <Nav bsStyle='tabs' activeHref='/supplier'>
      <Link url={'/supplier/settings/' + supplierGroup.id}
            active={tab === 'settings'}
            onClick={() => onSelectTab('settings')}
            icon='fa fa-gear'
            text={intl.formatMessage(messages.settings)}
      />
      <Link url={'/supplier/members/' + supplierGroup.id}
            active={tab === 'members'}
            onClick={() => onSelectTab('members')}
            icon='fa fa-users'
            text={intl.formatMessage(messages.members)}
      />
    </Nav>
  )
}

SuppliersTabs.propTypes = {
  intl: intlShape,
  onSelectTab: PropTypes.func.isRequired
}

export default SuppliersTabs
