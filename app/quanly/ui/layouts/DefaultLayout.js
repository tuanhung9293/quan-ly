'use strict'

import React, { Component } from 'react'
import { intlShape, defineMessages } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AdminLayout, STORE_NAME, setPageTitleTemplate } from '../../packages/oneui'
import SidebarNavList from '../components/SidebarNavList'
import HeaderNav from '../components/HeaderNav'
import { FlashLog } from '../../packages/log'

const messages = defineMessages({
  pageTitleTemplate: {
    id: 'DefaultLayout.page-title-template',
    defaultMessage: ':title | Quan-Ly.com'
  },
  copyrights: {
    id: 'DefaultLayout.copyrights',
    defaultMessage: '© 2017 quan-ly.com'
  }
})

class DefaultLayout extends Component {
  static propTypes = {
    intl: intlShape
  }

  static defaultProps = {}

  componentWillMount () {
    this.props.actions.setPageTitleTemplate(
      this.props.intl.formatMessage(messages.pageTitleTemplate)
    )
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { ...props } = this.props

    const appName = function () {
      return (
        <a className='h5 text-white' href='javascript:void(0)'>
          <i className='transition-default fa fa-circle-o-notch text-primary app-icon'></i>
          <span className='h4 sidebar-mini-hide'>uan-ly.com</span>
        </a>
      )
    }

    const Footer = function () {
      return (
        <div>
          <div className='pull-left'>
            <FlashLog />
          </div>
          <div id='copyrights' className='hidden-xs pull-right'>{formatMessage(messages.copyrights)}</div>
        </div>
      )
    }

    return (
      <AdminLayout appName={appName}
                   navList={SidebarNavList}
                   headerNavRight={HeaderNav}
                   footer={Footer}
                   companyName='Công ty TNHH Văn Hoá Đông Tây'
                   {...this.props}
      >
        {this.props.children}
      </AdminLayout>
    )
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => ({ actions: bindActionCreators({ setPageTitleTemplate }, dispatch) })
)(DefaultLayout)
