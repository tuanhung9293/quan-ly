'use strict'

import React, { PureComponent } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import Lodash from 'lodash'
import Field from './Field'

const messages = defineMessages({
  yes: {
    id: 'FormControlCheckBox.yes',
    defaultMessage: 'Yes'
  },
  no: {
    id: 'FormControlCheckBox.no',
    defaultMessage: 'No'
  }
})

class FormControlCheckBox extends PureComponent {
  static propTypes = {
    intl: intlShape
  }

  static defaultProps = {
    color: true,
    checkedColor: 'text-success',
    uncheckedColor: 'text-muted',
    checkedValue: true,
    uncheckedValue: false,
    text: '',
    switch: false,
    switchClassName: 'switch switch-sm switch-primary',
    checkboxClassName: 'css-checkbox css-checkbox-primary',
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const {
      formControl,
      color,
      text,
      checkedColor,
      uncheckedColor,
      display,
      checked,
      checkedValue,
      uncheckedValue,
      displayChecked,
      displayUnchecked,
      switchClassName,
      checkboxClassName,
      ...rest
    } = this.props
    const useSwitchButton = this.props.switch

    const defaultControl = function (props) {
      const { input } = props
      var isChecked = (input.value == checkedValue || input.value === true)
      var checkbox = (isChecked) ?
        (
          <input type="checkbox"
                 name={input.name}
                 checked
                 onChange={() => input.onChange(uncheckedValue)}
          />
        ) :
        (
          <input type="checkbox"
                 name={input.name}
                 onChange={() => input.onChange(checkedValue)}
          />
        )

      var Text = Lodash.isPlainObject(text) ? formatMessage(text) : text
      return (
        <label className={'css-input ' + (useSwitchButton ? switchClassName : checkboxClassName)}>
          <input type="hidden" name={input.name} value={uncheckedValue}/>
          {checkbox}
          <span></span>
          {Text}
        </label>
      )
    }

    const defaultDisplayControl = function (props) {
      var isChecked = checked || display
      if (isChecked) {
        if (displayChecked) {
          return (
            <div className='form-control-static'>{displayChecked}</div>
          )
        }
        return (
          <div className={'form-control-static ' + (color ? checkedColor : '')}>
            <i className='fa fa-check margin-right-5'/>
            {formatMessage(messages.yes)}
          </div>
        )
      }

      if (displayUnchecked) {
        return (
          <div className='form-control-static'>{displayUnchecked}</div>
        )
      }
      return (
        <div className={'form-control-static ' + (color ? uncheckedColor : '')}>
          <i className='fa fa-remove margin-right-5'/>
          {formatMessage(messages.no)}
        </div>
      )
    }

    return (
      <Field formControl={defaultControl}
             displayControl={defaultDisplayControl}
             {...rest} />
    )
  }
}

const FormControlCheckBoxClass = injectIntl(FormControlCheckBox)

import ComponentRegistry from '../../../api/ComponentRegistry'
ComponentRegistry.groupTo('Form', 'Checkbox', FormControlCheckBoxClass, 'packages/oneui/FormControlCheckBox')
ComponentRegistry.groupTo('Form', 'CheckBox', FormControlCheckBoxClass, 'packages/oneui/FormControlCheckBox')
export default FormControlCheckBoxClass
