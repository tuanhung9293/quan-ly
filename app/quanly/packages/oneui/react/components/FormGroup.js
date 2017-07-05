'use strict'

import React, { PureComponent } from 'react'
import FormGroupDefault from './FormGroupDefault'
import FormGroupHorizontal from './FormGroupHorizontal'

export default class FormGroup extends PureComponent {
  render () {
    const { formControl: FormControl, displayControl: DisplayControl, ...formControlProps } = this.props
    const {
      formDecoration,
      meta,
      meta: { touched, error },
      id,
      label,
      input,
      help,
      helpIcon,
      labelCol,
      controlCol,
      groupCol,
      display
    } = formControlProps
    const validationState = (touched && error) ? 'error' : undefined
    const controlId = id || meta.form + '_' + input.name

    var formControlRendered = (formDecoration.mode === 'input') ?
      (<FormControl {...formControlProps} id={controlId}/>) :
      (<DisplayControl className='form-control-static'>{display}</DisplayControl>)

    if (formDecoration.horizontal) {
      return (
        <FormGroupHorizontal formControl={formControlRendered}
                             controlId={controlId}
                             groupCol={groupCol || formDecoration.groupCol}
                             labelCol={labelCol || formDecoration.labelCol}
                             controlCol={controlCol || formDecoration.controlCol}
                             formDecoration={formDecoration}
                             label={label}
                             help={help}
                             helpIcon={helpIcon}
                             meta={meta}
                             validationState={validationState}
        />
      )
    }

    return (
      <FormGroupDefault formControl={formControlRendered}
                        controlId={controlId}
                        groupCol={groupCol || formDecoration.groupCol}
                        formDecoration={formDecoration}
                        label={label}
                        help={help}
                        helpIcon={helpIcon}
                        meta={meta}
                        validationState={validationState}
      />
    )
  }
}

