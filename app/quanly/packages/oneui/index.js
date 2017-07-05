'use strict'

import { reduxForm } from 'redux-form'
import * as Constants from './lib/constants'
import reducer from './react/reducer'
export { reducer }
export const OneUIReducer = {
  [Constants.STORE_NAME]: reducer
}

import * as actionTypes from './lib/actionTypes'
export { actionTypes }

export * from './react/actions'
export * from './lib/constants'

export AdminLayout from './react/components/AdminLayout'

export Block from './react/components/Block'
export EmptyBlock from './react/components/EmptyBlock'
export FormBlock from './react/components/FormBlock'
export BlockAction from './react/components/BlockAction'
export BlockActionEdit from './react/components/BlockActionEdit'
export BlockActionDelete from './react/components/BlockActionDelete'

export Form from './react/components/Form'
export Field from './react/components/Field'
export FormButtonsGroup from './react/components/FormButtonsGroup'
export FormButton from './react/components/FormButton'
export FormControlHidden from './react/components/FormControlHidden'
export FormControlTextBox from './react/components/FormControlTextBox'
export FormControlCheckbox from './react/components/FormControlCheckBox'
export FormControlSelect from './react/components/FormControlSelect'

export TableRowStatus from './react/components/TableRowStatus'

export Gravatar from './react/components/Gravatar'