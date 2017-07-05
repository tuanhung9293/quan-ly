'use strict'

import React, { Component } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { Link } from 'react-router'

const messages = defineMessages({
  title: {
    id: 'ConfigurationNavList.title',
    defaultMessage: 'Configuration'
  },
  company: {
    id: 'ConfigurationNavList.company',
    defaultMessage: 'Company'
  },
  warehouse: {
    id: 'ConfigurationNavList.warehouse',
    defaultMessage: 'Warehouse'
  },
  retail: {
    id: 'ConfigurationNavList.retail',
    defaultMessage: 'Retail'
  },
  employee: {
    id: 'ConfigurationNavList.employee',
    defaultMessage: 'Employee'
  },
  reminder: {
    id: 'ConfigurationNavList.reminder',
    defaultMessage: 'Reminder'
  },
  calendar: {
    id: 'ConfigurationNavList.calendar',
    defaultMessage: 'Calendar'
  },
  accessRights: {
    id: 'ConfigurationNavList.accessRights',
    defaultMessage: 'Access rights'
  },
})

class ConfigurationNavList extends Component {
  static propTypes = {
    intl: intlShape
  }

  render() {
    const formatMessage = this.props.intl.formatMessage
    const { location } = this.props

    return (
      <DropdownButton id='ConfigurationNavList' bsStyle='default' title={(<i className='fa fa-gears'></i>)}>
        <li>
          <Link to='/configuration/company'>{formatMessage(messages.company)}</Link>
        </li>
        <li>
          <Link to='/configuration/warehouse'>{formatMessage(messages.warehouse)}</Link>
        </li>
        <li>
          <Link to='/configuration/retail'>{formatMessage(messages.retail)}</Link>
        </li>
        <li>
          <Link to='/configuration/employee'>{formatMessage(messages.employee)}</Link>
        </li>
        <li>
          <Link to='/configuration/reminder'>{formatMessage(messages.reminder)}</Link>
        </li>
        <li>
          <Link to='/configuration/calendar'>{formatMessage(messages.calendar)}</Link>
        </li>
        <li>
          <Link to='/configuration/access-rights'>{formatMessage(messages.accessRights)}</Link>
        </li>
      </DropdownButton>
    );
  }
}

export default injectIntl(ConfigurationNavList)