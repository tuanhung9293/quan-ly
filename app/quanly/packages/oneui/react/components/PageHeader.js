'use strict'

import React, { PureComponent } from 'react'
import { isObject } from 'lodash'
import { intlShape, injectIntl } from 'react-intl'

class PageHeader extends PureComponent {
  static propTypes = {
    intl: intlShape
  }
  static defaultProps = {
    title: 'Welcome',
    titleTemplate: ':title',
    contentHeaderText: false,
    contentHeaderDescription: false
  }

  componentDidMount () {

  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { title, titleTemplate, contentHeaderText, contentHeaderDescription } = this.props

    var output = title
    if (isObject(output)) {
      output = this.props.intl.formatMessage(output)
    }
    document.title = titleTemplate.replace(':title', output)

    if (contentHeaderText !== false) {
      var text = isObject(contentHeaderText) ? formatMessage(contentHeaderText) : contentHeaderText

      if (contentHeaderDescription !== false) {
        var desc = isObject(contentHeaderText) ? formatMessage(contentHeaderText) : contentHeaderText

        return (
          <div className='content bg-gray-lighter page-heading-wrapper'>
            <h2 className='page-heading push'>
              {text}
              <small className='margin-left-10'>{desc}</small>
            </h2>
          </div>
        )
      }

      return (
        <div className='content bg-gray-lighter page-heading-wrapper'>
          <h2 className='page-heading push'>
            {text}
          </h2>
        </div>
      )
    }

    return (
      <div></div>
    )
  }
}

export default injectIntl(PageHeader)
