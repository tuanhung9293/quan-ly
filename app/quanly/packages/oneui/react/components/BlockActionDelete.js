'use strict'

import React from 'react'
import { defineMessages } from 'react-intl'
import BlockAction from './BlockAction'

const messages = defineMessages({
  'delete': {
    id: 'BlockAction.delete-tooltip',
    defaultMessage: 'Delete'
  }
})

export default function BlockActionDelete (props) {
  return (
    <BlockAction className='text-danger'
                 icon='si si-trash'
                 tooltip={messages[ 'delete' ]}
                 {...props} />
  )
}
