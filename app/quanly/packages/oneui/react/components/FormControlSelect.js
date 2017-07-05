'use strict'

import React, { PureComponent } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import Select from 'react-select'
import Lodash from 'lodash'
import Field from './Field'

const messages = defineMessages({
  yes: {
    id: 'FormControlSelect.yes',
    defaultMessage: 'Yes'
  },
  no: {
    id: 'FormControlSelect.no',
    defaultMessage: 'No'
  }
})

class FormControlSelect extends PureComponent {
  static propTypes = {
    intl: intlShape
  }

  static defaultProps = {
    multi: false,
    searchable: true,
    openOnFocus: true,
    emptyValue: ''
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const {
      formControl,
      emptyValue,
      multi,
      ...rest
    } = this.props

    const defaultControl = function (props) {
      const {
        id,
        input, meta,
        controlCol, groupCol, labelCol,
        formDecoration,
        help, helpIcon,
        label,
        reduxForm,
        intl,
        options,
        placeholder,
        ...rest
      } = props

      var isChanged = false
      const filterValueByOptions = function (value, options) {
        if (Lodash.isArray(value)) {
          return value.filter(function (val) {
            var hasValue = options.filter(function (option) { return option.value === val }).length !== 0
            if (!hasValue) {
              isChanged = true
            }
            return hasValue
          })
        }

        const hasValue = options.filter(function (option) { return option.value === value }).length !== 0
        if (!hasValue) {
          isChanged = true
          return emptyValue
        }
        return value
      }

      const onChange = function (val) {
        if (multi && Lodash.isArray(val)) {
          return input.onChange(val.map(function (item) {
            return item.value
          }))
        }

        if (val === null) {
          return input.onChange(emptyValue)
        }
        input.onChange(val.value)
      }

      var value = filterValueByOptions(input.value, options)
      if (isChanged) {
        reduxForm.change(input.name, value)
      }

      return (
        <Select name={input.name}
                value={value}
                multi={multi}
                placeholder={placeholder || 'Please select...'}
                onChange={onChange}
                searchable={true}
                openOnFocus={true}
                options={options}
                {...rest}
        />
      )
    }

    return (
      <Field formControl={defaultControl}
             {...rest} />
    )
  }
}

const FormControlSelectClass = injectIntl(FormControlSelect)

import ComponentRegistry from '../../../api/ComponentRegistry'
ComponentRegistry.groupTo('Form', 'Select', FormControlSelectClass, 'packages/oneui/FormControlSelectClass')
export default FormControlSelectClass
