'use strict'

import React from 'react'
import { defineMessages } from 'react-intl'
import BlockAction from './BlockAction'

const messages = defineMessages({
  edit: {
    id: 'BlockAction.edit-tooltip',
    defaultMessage: 'Edit'
  }
})

export default function BlockActionEdit (props) {
  return (
    <BlockAction icon='si si-pencil'
                 tooltip={messages.edit}
                 {...props} />
  )
}
