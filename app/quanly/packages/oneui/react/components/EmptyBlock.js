'use strict'

import React, { PureComponent } from 'react'
import { intlShape, injectIntl } from 'react-intl'
import Lodash from 'lodash'
import Block from './Block'
import BlockContent from './BlockContent'
import BlockHeader from './BlockHeader'
import BlockTitle from './BlockTitle'

class EmptyBlock extends PureComponent {
  static defaultProps = {
    border: true
  }

  static propTypes = {
    intl: intlShape
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    var { title, border } = this.props

    title = Lodash.isPlainObject(title) ? formatMessage(title) : title
    if (title) {
      return (
        <Block border={border}>
          <BlockHeader>
            <BlockTitle>{title}</BlockTitle>
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

export default injectIntl(EmptyBlock)
