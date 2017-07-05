'use strict'

import React, { Component } from 'react'
import { intlShape, defineMessages } from 'react-intl'
import Lodash from 'lodash'
import DefaultLayout from '../layouts/DefaultLayout'
import { browserHistory } from 'react-router'

const messages = defineMessages({
  defaultTitle: {
    id: 'Page.default-title',
    defaultMessage: 'Welcome'
  }
})

export default class Page extends Component {
  static error404 (path) {
    return browserHistory.push(Page.getErrorPageUrl(404, { path }))
  }

  static push (path) {
    browserHistory.push(path)
  }

  static replace (path) {
    browserHistory.replace(path)
  }

  static getErrorPageUrl (code, params) {
    return '/error/' + code + Page.buildQueryUrl(params)
  }

  static buildQueryUrl (queries) {
    var result = []
    for (var name in queries) {
      result.push(encodeURIComponent(name) + '=' + encodeURIComponent(queries[ name ]))
    }
    return (result.length > 0) ? '?' + result.join('&') : ''
  }

  static propTypes = {
    intl: intlShape
  }

  static defaultProps = {
    title: messages.defaultTitle
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    var { title, name, ...rest } = this.props

    title = Lodash.isPlainObject(title) ? formatMessage(title) : title
    name = Lodash.isPlainObject(name) ? formatMessage(name) : name
    return (
      <DefaultLayout {...rest}
                     pageTitle={title}
                     contentHeaderText={name}
      >
        {this.props.children}
      </DefaultLayout>
    )
  }
}
