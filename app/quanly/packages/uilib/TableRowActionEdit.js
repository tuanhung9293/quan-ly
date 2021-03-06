'use strict'

import React, { Component } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import Lodash from 'lodash'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const messages = defineMessages({
  text: {
    id: 'Action.edit',
    defaultMessage: 'Edit'
  },
  tooltip: {
    id: 'Action.edit-tooltip',
    defaultMessage: 'Edit'
  }
})

class TableRowActionEdit extends Component {
  static propTypes = {
    intl: intlShape
  }
  static defaultProps = {
    tooltipId: false,
    rowId: false,
    text: false,
    tooltip: {
      id: 'Action.edit-tooltip',
      defaultMessage: 'Edit'
    }
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { tooltipId, rowId, text, tooltip, intl, ...props } = this.props

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
          <button className='btn btn-xs btn-default' {...props}>
            <i className='fa fa-pencil'></i>
            {Text}
          </button>
        </OverlayTrigger>
      )
    }

    return (
      <button className='btn btn-xs btn-default' {...props}>
        <i className='fa fa-pencil'></i>
        {Text}
      </button>
    )
  }
}

export default injectIntl(TableRowActionEdit)

