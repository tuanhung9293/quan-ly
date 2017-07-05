'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { intlShape, injectIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  settings: {
    id: 'AccessRightsConfigurationTabs.settings',
    defaultMessage: 'Settings'
  },
  members: {
    id: 'AccessRightsConfigurationTabs.members',
    defaultMessage: 'Members'
  },
  accessRights: {
    id: 'AccessRightsConfigurationTabs.access-rights',
    defaultMessage: 'Access Rights'
  },
  calendarRights: {
    id: 'AccessRightsConfigurationTabs.calendar-rights',
    defaultMessage: 'Calendar Rights'
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

const AccessRightsConfigurationTabs = function ({ role, tab, onSelectTab, intl }) {
  if (typeof role === 'undefined' || role === null) {
    return (<div></div>)
  }

  return (
    <Nav bsStyle='tabs' activeHref='/configuration/role'>
      <Link url={'/configuration/access-rights/settings/' + role.id}
            active={tab === 'settings'}
            onClick={() => onSelectTab('settings')}
            icon='fa fa-gear'
            text={intl.formatMessage(messages.settings)}
      />
      <Link url={'/configuration/access-rights/members/' + role.id}
            active={tab === 'members'}
            onClick={() => onSelectTab('members')}
            icon='fa fa-users'
            text={intl.formatMessage(messages.members)}
      />
      <Link url={'/configuration/access-rights/access-table/' + role.id}
            active={tab === 'access-table'}
            onClick={() => onSelectTab('access-table')}
            icon='fa fa-check'
            text={intl.formatMessage(messages.accessRights)}
      />
      <Link url={'/configuration/access-rights/calendar-rights/' + role.id}
            active={tab === 'calendar-rights'}
            onClick={() => onSelectTab('calendar-rights')}
            icon='fa fa-calendar'
            text={intl.formatMessage(messages.calendarRights)}
      />
    </Nav>
  )
}

AccessRightsConfigurationTabs.propTypes = {
  intl: intlShape,
  onSelectTab: PropTypes.func.isRequired
}

export default AccessRightsConfigurationTabs
