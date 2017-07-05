'use strict'

import React, { Component } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import SidebarNavItem from './SidebarNavItem'

const messages = defineMessages({
  dashboard: {
    id: 'SidebarNavList.dashboard',
    defaultMessage: 'Dashboard'
  },
  product: {
    id: 'SidebarNavList.product',
    defaultMessage: 'Product'
  },
  stock: {
    id: 'SidebarNavList.stock',
    defaultMessage: 'Stock'
  },
  customer: {
    id: 'SidebarNavList.customer',
    defaultMessage: 'Customer'
  },
  supplier: {
    id: 'SidebarNavList.supplier',
    defaultMessage: 'Supplier'
  },
  accounting: {
    id: 'SidebarNavList.accounting',
    defaultMessage: 'Accounting'
  },
  retail: {
    id: 'SidebarNavList.retail',
    defaultMessage: 'Retail'
  },
  calendar: {
    id: 'SidebarNavList.calendar',
    defaultMessage: 'Calendar'
  },
  tool: {
    id: 'SidebarNavList.tool',
    defaultMessage: 'Tool'
  },
  report: {
    id: 'SidebarNavList.report',
    defaultMessage: 'Report'
  },
  import: {
    id: 'SidebarNavList.import',
    defaultMessage: 'Import'
  },
  export: {
    id: 'SidebarNavList.export',
    defaultMessage: 'Export'
  },
  configuration: {
    id: 'SidebarNavList.configuration',
    defaultMessage: 'Configuration'
  }
})

const propTypes = {
  intl: intlShape
}

const defaultProps = {}

class SidebarNavList extends Component {
  render () {
    const formatMessage = this.props.intl.formatMessage
    const { location } = this.props
    return (
      <ul className="nav-main">
        <SidebarNavItem url='/dashboard'
                        active={location.pathname.indexOf('/dashboard') === 0}
                        icon='si si-speedometer'
                        text={formatMessage(messages.dashboard)}
        />

        <SidebarNavItem url='/stock'
                        active={location.pathname.indexOf('/stock') === 0}
                        icon='si si-directions'
                        text={formatMessage(messages.stock)}
        />

        <SidebarNavItem url='/product'
                        active={location.pathname.indexOf('/product') === 0}
                        icon='fa fa-cubes'
                        text={formatMessage(messages.product)}
        />

        <SidebarNavItem url='/customer'
                        active={location.pathname.indexOf('/customer') === 0}
                        icon='fa fa-users'
                        text={formatMessage(messages.customer)}
        />

        <SidebarNavItem url='/supplier'
                        active={location.pathname.indexOf('/supplier') === 0}
                        icon='fa fa-user'
                        text={formatMessage(messages.supplier)}
        />

        <SidebarNavItem url='/accounting'
                        active={location.pathname.indexOf('/accounting') === 0}
                        icon='fa fa-usd'
                        text={formatMessage(messages.accounting)}
        />

        <SidebarNavItem url='/retail'
                        active={location.pathname.indexOf('/retail') === 0}
                        icon='fa fa-shopping-cart'
                        text={formatMessage(messages.retail)}
        />

        <SidebarNavItem url='/calendar'
                        active={location.pathname.indexOf('/calendar') === 0}
                        icon='fa fa-calendar'
                        text={formatMessage(messages.calendar)}
        />

        <SidebarNavItem url='/report'
                        active={location.pathname.indexOf('/report') === 0}
                        icon='si si-graph'
                        text={formatMessage(messages.report)}
        />

        <SidebarNavItem url='/tool'
                        active={location.pathname.indexOf('/tool') === 0}
                        icon='si si-wrench'
                        text={formatMessage(messages.tool)}
        />

        <SidebarNavItem url='/import'
                        active={location.pathname.indexOf('/import') === 0}
                        icon='glyphicon glyphicon-import'
                        text={formatMessage(messages.import)}
        />

        <SidebarNavItem url='/export'
                        active={location.pathname.indexOf('/export') === 0}
                        icon='glyphicon glyphicon-export'
                        text={formatMessage(messages.export)}
        />
      </ul>
    )
  }
}

SidebarNavList.defaultProps = defaultProps
SidebarNavList.propTypes = propTypes

export default injectIntl(SidebarNavList)
