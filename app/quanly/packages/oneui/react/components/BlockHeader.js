'use strict'

import React, { PureComponent } from 'react'

export default function BlockHeader (props) {
  return (
    <div className='block-header'>
      {props.children}
    </div>
  )
}
