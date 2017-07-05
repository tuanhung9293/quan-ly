'use strict'

import React, { PureComponent } from 'react'
import { defineMessages } from 'react-intl'
import PropTypes from 'prop-types'
import Lodash from 'lodash'
import FormGroupDefault from './FormGroupDefault'
import FormGroupHorizontal from './FormGroupHorizontal'
import FormButton from './FormButton'

const SUPPORTED_BUTTONS = [
  'save', 'onSave',
  'create', 'onCreate', 'add', 'onAdd',
  'update', 'onUpdate',
  'delete', 'onDelete',
  'submit', 'onSubmit',
  'cancel', 'onCancel', 'close', 'onClose'
]

const messages = defineMessages({
  save: { id: 'FormAction.save', defaultMessage: 'Save' },
  create: { id: 'FormAction.create', defaultMessage: 'Create' },
  add: { id: 'FormAction.add', defaultMessage: 'Add' },
  update: { id: 'FormAction.update', defaultMessage: 'Update' },
  'delete': { id: 'FormAction.delete', defaultMessage: 'Delete' },
  submit: { id: 'FormAction.submit', defaultMessage: 'Submit' },
  cancel: { id: 'FormAction.cancel', defaultMessage: 'Cancel' },
  close: { id: 'FormAction.close', defaultMessage: 'Close' },
})

class FormButtonsGroup extends PureComponent {
  render () {
    const { formControl: FormControl, displayControl: DisplayControl, ...formControlProps } = this.props
    const {
      formDecoration,
      labelCol,
      controlCol,
      groupCol,
      ...rest
    } = formControlProps

    if (formDecoration.mode !== 'input') {
      return null
    }

    var children
    if (React.Children.count(this.props.children) > 0) {
      children = React.Children.map(this.props.children, (child, index) => {
        if (index === 0) {
          return React.cloneElement(child, { formDecoration, reduxForm: this.props.reduxForm })
        }
        return React.cloneElement(child, {
          formDecoration,
          reduxForm: this.props.reduxForm,
          className: 'margin-left-10'
        })
      })
    } else {
      children = SUPPORTED_BUTTONS.map(function (name) {
        if (typeof formControlProps[ name ] === 'undefined') {
          return null
        }
        if (name.startsWith('on')) {
          name = name.substr(2).toLowerCase()
        }

        var actionProps = {}
        if (formControlProps[ name ] === true) {
          actionProps.text = messages[ name ]
        } else if (Lodash.isFunction(formControlProps[ name ])) {
          actionProps.onClick = formControlProps[ name ]
        } else if (Lodash.isString(formControlProps[ name ])) {
          actionProps.text = formControlProps[ name ]
        } else {
          actionProps = formControlProps[ name ]
        }
        var props = Lodash.assign({}, {
          text: messages[ name ],
          type: (name === 'close' || name === 'cancel') ? 'button' : 'submit'
        }, actionProps)

        return (
          <FormButton key={formControlProps.reduxForm.form + '_' + name}
                      formDecoration={formDecoration}
                      reduxForm={formControlProps.reduxForm}
                      className={'margin-right-10'}
                      {...props}
          />
        )
      }).filter(function (component) {
        return component !== null
      })
    }

    SUPPORTED_BUTTONS.forEach(function (name) {
      if (typeof rest[name] !== 'undefined') {
        delete rest[name]
      }
    })

    if (formDecoration.horizontal) {
      return (
        <FormGroupHorizontal formControl={children}
                             groupCol={groupCol || formDecoration.groupCol}
                             labelCol={labelCol || formDecoration.labelCol}
                             controlCol={controlCol || formDecoration.controlCol}
                             formDecoration={formDecoration}
                             {...rest}
        />
      )
    }

    return (
      <FormGroupDefault formControl={children}
                        groupCol={groupCol || formDecoration.groupCol}
                        formDecoration={formDecoration}
                        {...rest}
      />
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
FormButtonsGroup.propTypes = propTypes

import ComponentRegistry from '../../../api/ComponentRegistry'
ComponentRegistry.groupTo('Form', 'Buttons', FormButtonsGroup, 'packages/oneui/FormButtonsGroup')
ComponentRegistry.groupTo('Form', 'ButtonsGroup', FormButtonsGroup, 'packages/oneui/FormButtonsGroup')
ComponentRegistry.groupTo('Form', 'Actions', FormButtonsGroup, 'packages/oneui/FormButtonsGroup')
ComponentRegistry.groupTo('Form', 'ActionsGroup', FormButtonsGroup, 'packages/oneui/FormButtonsGroup')

export default FormButtonsGroup