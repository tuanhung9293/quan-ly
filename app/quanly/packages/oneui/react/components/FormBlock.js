'use strict'

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import Lodash from 'lodash'
import Block from './Block'
import BlockContent from './BlockContent'
import BlockHeader from './BlockHeader'
import BlockTitle from './BlockTitle'
import BlockAction from './BlockAction'

const SUPPORTED_BUTTONS = [
  'edit', 'onEdit',
  'delete', 'onDelete'
]


const messages = defineMessages({
  edit: { id: 'BlockAction.edit-tooltip', defaultMessage: 'Edit' },
  'delete': { id: 'BlockAction.delete-tooltip', defaultMessage: 'Delete' }
})

const icons = {
  edit: 'si si-pencil',
  'delete': 'si si-trash'
}

class FormBlock extends PureComponent {
  static defaultProps = {
    title: false,
    border: true
  }

  static propTypes = {
    intl: intlShape
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { title, border, ...blockProps } = this.props

    var Title = (title === false) ? null : Lodash.isPlainObject(title) ? formatMessage(title) : title
    var Actions = SUPPORTED_BUTTONS.map(function (name) {
      if (typeof blockProps[ name ] === 'undefined') {
        return null
      }
      if (name.startsWith('on')) {
        name = name.substr(2).toLowerCase()
      }

      var actionProps = {}
      if (blockProps[ name ] === true) {
        actionProps.text = messages[ name ]
      } else if (Lodash.isFunction(blockProps[ name ])) {
        actionProps.onClick = blockProps[ name ]
      } else if (Lodash.isString(blockProps[ name ])) {
        actionProps.text = blockProps[ name ]
      } else {
        actionProps = blockProps[ name ]
      }
      var props = Lodash.assign({}, {
        tooltip: messages[ name ],
        icon: icons[ name ]
      }, actionProps)

      return (
        <BlockAction key={name} {...props} />
      )
    }).filter(function (component) {
      return component !== null
    })

    if (Title !== null || Actions !== null) {
      return (
        <Block border={border}>
          <BlockHeader>
            <Block.Options>
              {Actions}
            </Block.Options>
            <BlockTitle>{Title}</BlockTitle>
          </BlockHeader>
          <BlockContent>
            {this.props.children}
          </BlockContent>
        </Block>
      )
    }

    return (
      <Block border={border}>
        <BlockContent>
          {this.props.children}
        </BlockContent>
      </Block>
    )
  }
}

const ButtonPropTypes = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.func,
  PropTypes.string,
  PropTypes.shape({
    text: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
    onClick: PropTypes.func
  })
])
var propTypes = {}
SUPPORTED_BUTTONS.forEach(function (name) {
  propTypes[ name ] = ButtonPropTypes
})
FormBlock.propTypes = propTypes

export default injectIntl(FormBlock)
