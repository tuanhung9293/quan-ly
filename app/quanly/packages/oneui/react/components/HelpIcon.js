'use strict'

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Classnames from 'classnames'
import Lodash from 'lodash'
import { Overlay, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap'

export default class HelpIcon extends PureComponent {
  static defaultProps = {
    icon: 'fa fa-info-circle',
    className: '',
    component: Tooltip
  }

  static propTypes = {
    icon: PropTypes.string,
    className: PropTypes.string,
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired
  }

  target = null

  constructor (props, context) {
    super(props, context);

    this.state = {
      hovering: false,
      clicked: false
    };
  };

  onIconClick () {
    this.setState(Lodash.assign({}, this.state, { clicked: !this.state.clicked }))
  }

  onIconEnter () {
    this.setState(Lodash.assign({}, this.state, { hovering: true }))
  }

  onIconLeave () {
    this.setState(Lodash.assign({}, this.state, { hovering: false }))
  }

  onOverlayHide () {
    if (this.state.hovering && this.state.clicked === true) {
      return;
    }
    this.setState({ hovering: false, clicked: false })
  }

  render () {
    if (typeof this.props.children === 'undefined') {
      return null
    }

    const { icon, className, component: Component } = this.props
    var id = typeof this.props.id !== 'undefined' ? this.props.id : 'HelpIcon-' + Math.floor(Math.random() * 1E10)
    return (
      <a className={Classnames('help-icon', className)}
         href='javascript:void(0)'
         onClick={() => this.onIconClick()}
         onFocus={() => this.onIconEnter()}
         onBlur={() => this.onIconLeave()}
         onMouseEnter={() => this.onIconEnter()}
         onMouseLeave={() => this.onIconLeave()}
      >
        <i ref={(i) => this.target = i} className={icon}></i>
        <Overlay show={this.state.hovering || this.state.clicked}
                 target={this.target}
                 placement='top'
                 rootClose={true}
                 onHide={() => this.onOverlayHide()}
        >
          <Component id={id}>{this.props.children}</Component>
        </Overlay>
      </a>
    )
  }
}