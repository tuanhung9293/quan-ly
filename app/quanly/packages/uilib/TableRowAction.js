'use strict'

import React, { Component } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import Lodash from 'lodash'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import TableRowActionEdit from './TableRowActionEdit'
import TableRowActionDelete from './TableRowActionDelete'

class TableRowAction extends Component {
  static propTypes = {
    intl: intlShape
  }
  static defaultProps = {
    tooltipId: false,
    rowId: false,
    text: false,
    tooltip: false,
    icon: 'fa fa-flash',
    textStyle: ''
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { tooltipId, rowId, text, textStyle, tooltip, icon, intl, ...props } = this.props

    var Text = null
    if (text !== false) {
      Text = Lodash.isPlainObject(text) ? formatMessage(text) : text
    }

    if (tooltip !== false) {
      var id = tooltipId !== false ? tooltipId : 'TableRowStatus-' + ((rowId !== false) ? rowId : (Math.random() * 100000000));
      const tooltipOverlay = (
        <Tooltip id={id}>{Lodash.isPlainObject(tooltip) ? formatMessage(tooltip) : tooltip}</Tooltip>
      )
      return (
        <OverlayTrigger placement="top" overlay={tooltipOverlay}>
          <a className={textStyle + ' margin-left-5 margin-right-5'} {...props}>
            <i className={icon}></i>
            {Text}
          </a>
        </OverlayTrigger>
      )
    }

    return (
      <a className={textStyle + ' margin-left-5 margin-right-5'} {...props}>
        <i className={icon}></i>
        {Text}
      </a>
    )
  }
}


const TableRowActionInjected = injectIntl(TableRowAction)

TableRowActionInjected.Edit = TableRowActionEdit
TableRowActionInjected.Delete = TableRowActionDelete

export default TableRowActionInjected

