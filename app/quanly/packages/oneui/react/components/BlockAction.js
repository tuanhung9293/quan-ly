'use strict'

import React, { PureComponent } from 'react'
import { intlShape, injectIntl } from 'react-intl'
import Lodash from 'lodash'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

class BlockAction extends PureComponent {
  static propTypes = {
    intl: intlShape
  }

  static defaultProps = {
    tooltipId: false,
    itemId: false,
    text: false,
    tooltip: false,
    href: 'javascript:void(0)',
    icon: 'si si-trash',
    className: ''
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { tooltipId, itemId, text, tooltip, intl, icon, ...props } = this.props

    var Text = null
    if (text !== false) {
      Text = Lodash.isPlainObject(text) ? formatMessage(text) : text
    }

    if (tooltip !== false) {
      var id = tooltipId !== false ? tooltipId : 'BlockAction-' + ((itemId !== false) ? itemId : (Math.random() * 100000000));
      const tooltipOverlay = (
        <Tooltip id={id}>{Lodash.isPlainObject(tooltip) ? formatMessage(tooltip) : tooltip}</Tooltip>
      )
      return (
        <li>
          <OverlayTrigger placement="top" overlay={tooltipOverlay}>
            <a {...props}>
              <i className={icon}></i>
              {Text}
            </a>
          </OverlayTrigger>
        </li>
      )
    }

    return (
      <li>
        <a {...props}>
          <i className='si si-trash'></i>
          {Text}
        </a>
      </li>
    )
  }
}

export default injectIntl(BlockAction)