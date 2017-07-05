'use strict'

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Constants from '../../lib/constants'
import * as Actions from '../actions'
import PageHeader from './PageHeader'

class AdminLayout extends PureComponent {
  static defaultProps = {
    headerNavRight: 'span',
    appName: 'span',
    footer: 'span',
    navList: 'li',
  }

  render () {
    var {
      OneUI, actions,
      pageTitle, pageTitleTemplate, contentHeaderText, contentHeaderDescription,
      companyName,
      appName: AppName,
      headerNavRight: HeaderNav,
      footer: Footer,
      navList: NavList,
      ...props
    } = this.props

    var pageContainerClassName = 'sidebar-l sidebar-o side-scroll header-navbar-fixed sidebar-mini'
    if (OneUI.open_nav) {
      pageContainerClassName += ' sidebar-o-xs'
    }

    return (
      <div id='page-container' className={pageContainerClassName}>
        <nav id='sidebar'>
          <div className='sidebar-content'>
            <div className='side-header side-content bg-white-op'>
              <button className='btn btn-link text-gray pull-right hidden-md hidden-lg'
                      type='button'
                      onClick={actions.closeNav}
              >
                <i className='fa fa-times'></i>
              </button>
              <AppName />
            </div>
            <div className='side-content'>
              <NavList {...props} />
            </div>
          </div>
        </nav>
        <header id='header-navbar' className='content-mini content-mini-full'>
          <HeaderNav {...props} />
          <ul className='nav-header pull-left'>
            <li className='hidden-md hidden-lg'>
              <button className='btn btn-default' type='button'
                      onClick={actions.toggleNav}
              >
                <i className='fa fa-navicon'></i>
              </button>
            </li>
          </ul>
          <h1 className='hidden-sm hidden-xs'>{companyName}</h1>
        </header>
        <main id='main-container'>
          <PageHeader title={pageTitle}
                      titleTemplate={pageTitleTemplate || OneUI.page_title_template}
                      contentHeaderText={contentHeaderText}
                      contentHeaderDescription={contentHeaderDescription}
          />
          <div className='content'>
            {this.props.children}
          </div>
        </main>
        <footer id='page-footer' className='content-mini content-mini-full font-s12 bg-gray-lighter clearfix'>
          <Footer />
        </footer>
      </div>
    )
  }
}

export default connect(
  (state) => ({ OneUI: state[ Constants.STORE_NAME ] }),
  (dispatch) => ({ actions: bindActionCreators(Actions, dispatch) })
)(AdminLayout)
