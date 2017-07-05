'use strict'

import React, { Component } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import ContentNav from './ContentNav'
import ContentNavItem from './ContentNavItem'

const messages = defineMessages({
  title: {
    id: 'ConfigurationContentNav.title',
    defaultMessage: 'Configuration'
  },
  company: {
    id: 'ConfigurationContentNav.company',
    defaultMessage: 'Company'
  },
  warehouse: {
    id: 'ConfigurationContentNav.warehouse',
    defaultMessage: 'Warehouse'
  },
  retail: {
    id: 'ConfigurationContentNav.retail',
    defaultMessage: 'Retail'
  },
  employee: {
    id: 'ConfigurationContentNav.employee',
    defaultMessage: 'Employee'
  },
  reminder: {
    id: 'ConfigurationContentNav.reminder',
    defaultMessage: 'Reminder'
  },
  calendar: {
    id: 'ConfigurationContentNav.calendar',
    defaultMessage: 'Calendar'
  },
  accessRights: {
    id: 'ConfigurationContentNav.accessRights',
    defaultMessage: 'Access rights'
  },
})

class ConfigurationContentNav extends Component {
  static propTypes = {
    intl: intlShape
  }

  render() {
    const formatMessage = this.props.intl.formatMessage
    const { location } = this.props

    return (
      <ContentNav text="Configuration">
        <ContentNavItem url='/configuration/company'
                        active={location.pathname.indexOf('/configuration/company') === 0}
                        text={formatMessage(messages.company)} />

        <ContentNavItem url='/configuration/warehouse'
                        active={location.pathname.indexOf('/configuration/warehouse') === 0}
                        text={formatMessage(messages.warehouse)} />

        <ContentNavItem url='/configuration/retail'
                        active={location.pathname.indexOf('/configuration/retail') === 0}
                        text={formatMessage(messages.retail)} />

        <ContentNavItem url='/configuration/employee'
                        active={location.pathname.indexOf('/configuration/employee') === 0}
                        text={formatMessage(messages.employee)} />

        <ContentNavItem url='/configuration/reminder'
                        active={location.pathname.indexOf('/configuration/reminder') === 0}
                        text={formatMessage(messages.reminder)} />

        <ContentNavItem url='/configuration/calendar'
                        active={location.pathname.indexOf('/configuration/calendar') === 0}
                        text={formatMessage(messages.calendar)} />

        <ContentNavItem url='/configuration/access-rights/'
                        active={location.pathname.indexOf('/configuration/access-rights') === 0}
                        text={formatMessage(messages.accessRights)} />
      </ContentNav>
    );
  }
}

export default injectIntl(ConfigurationContentNav)