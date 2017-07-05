'use strict'

import React, { PureComponent } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import Lodash from 'lodash'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const messages = defineMessages({
  tooltipEnable: {
    id: 'TableRowAction.enable-tooltip',
    defaultMessage: 'Enable'
  },
  tooltipDisable: {
    id: 'TableRowAction.disable-tooltip',
    defaultMessage: 'Disable'
  }
})

class TableRowStatus extends PureComponent {
  static propTypes = {
    intl: intlShape
  }
  static defaultProps = {
    tooltipId: false,
    rowId: false,
    isEnabled: false,
    tooltipForEnabled: {
      id: 'TableRowAction.enable-tooltip',
      defaultMessage: 'Enable'
    },
    tooltipForDisabled: {
      id: 'TableRowAction.disable-tooltip',
      defaultMessage: 'Disable'
    },
    onEnabledClick: false,
    onDisabledClick: false
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const {
      tooltipId,
      rowId,
      isEnabled,
      tooltipForEnabled,
      tooltipForDisabled,
      onEnabledClick,
      onDisabledClick,
      intl,
      ...props
    } = this.props

    var id = tooltipId !== false ? tooltipId : 'TableRowStatus-' + ((rowId !== false) ? rowId : (Math.random() * 100000000));
    if (isEnabled) {
      const tooltipOverlay = (
        <Tooltip
          id={id}>{Lodash.isPlainObject(tooltipForDisabled) ? formatMessage(tooltipForDisabled) : tooltipForDisabled}</Tooltip>
      )
      return (
        <OverlayTrigger placement="top" overlay={tooltipOverlay}>
          <a className='text-success'
             href='javascript:void(0)'
             onClick={onEnabledClick}
             {...props}>
            <i className='fa fa-circle'></i>
          </a>
        </OverlayTrigger>
      )
    }

    const tooltipOverlay = (
      <Tooltip
        id={id}>{Lodash.isPlainObject(tooltipForEnabled) ? formatMessage(tooltipForEnabled) : tooltipForEnabled}</Tooltip>
    )
    return (
      <OverlayTrigger placement="top" overlay={tooltipOverlay}>
        <a className='text-danger'
           href='javascript:void(0)'
           onClick={onDisabledClick}
           {...props}>
          <i className='fa fa-circle'></i>
        </a>
      </OverlayTrigger>
    )
  }
}

export default injectIntl(TableRowStatus)

