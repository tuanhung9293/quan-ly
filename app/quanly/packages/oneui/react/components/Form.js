'use strict'

import React, { Component } from 'react'
import { Form as ReduxForm } from 'redux-form'
import Classnames from 'classnames'

function warning_do_nothing_submit () {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('You did not handle submit action for form')
  }
}

class Form extends Component {
  static defaultProps = {
    onSubmit: warning_do_nothing_submit,
    mode: 'input',
    horizontal: true,
    multipleColumns: false,
    labelCol: { xs: 12, sm: 3 },
    controlCol: { xs: 12, sm: 6 },
    groupCol: false,
    columns: 1
  }

  shouldComponentUpdate (nextProps) {
    if (typeof nextProps.data === 'undefined') {
      return nextProps !== this.props
    }

    if (!nextProps.initialized) {
      this.props.initialize(nextProps.data)
    }
    if (nextProps.data.id !== this.props.data.id) {
      this.props.destroy()
    }
    return nextProps !== this.props
  }

  render () {
    const {
      onSubmit,
      mode,
      labelCol, controlCol, groupCol,
      multipleColumns,
      horizontal,
      columns,
      data,
      ...reduxForm
    } = this.props
    var formDecoration = {
      mode: mode,
      multipleColumns: multipleColumns || groupCol !== false,
      horizontal: horizontal,
      labelCol: labelCol,
      controlCol: controlCol,
      groupCol: groupCol,
      columns: columns,
    }

    var className = Classnames({
      'form-horizontal': true
    })

    const cloneAndPassProps = (child) => {
      var childProps = {
        formDecoration,
        reduxForm: reduxForm
      }

      if (typeof child.props.display === 'undefined'
        && typeof data !== 'undefined'
        && typeof child.props.name !== 'undefined'
        && typeof data[ child.props.name ] !== 'undefined'
      ) {
        childProps.display = data[ child.props.name ]
      }
      return React.cloneElement(child, childProps)
    }

    if (formDecoration.multipleColumns) {
      if (columns <= 1) {
        return (
          <ReduxForm onSubmit={reduxForm.handleSubmit(onSubmit)} className={className}>
            <div className='row'>
              {React.Children.map(this.props.children, cloneAndPassProps)}
            </div>
          </ReduxForm>
        )
      }

      var children = []
      var childrenArray = React.Children.toArray(
        React.Children.map(this.props.children, cloneAndPassProps)
      )
      for (var i = 0, l = childrenArray.length; i < l; i += columns) {
        children.push(
          <div key={i + '-'} className='row'>
            {Array.prototype.slice.apply(childrenArray, [ i, i + columns ])}
          </div>
        )
      }
      return (
        <ReduxForm onSubmit={reduxForm.handleSubmit(onSubmit)} className={className}>
          {children}
        </ReduxForm>
      )
    }

    return (
      <ReduxForm onSubmit={reduxForm.handleSubmit(onSubmit)} className={className}>
        {React.Children.map(this.props.children, cloneAndPassProps)}
      </ReduxForm>
    )
  }
}

import ComponentRegistry from '../../../api/ComponentRegistry'
ComponentRegistry.defineGroup('Form', Form, 'packages/oneui')

export default Form