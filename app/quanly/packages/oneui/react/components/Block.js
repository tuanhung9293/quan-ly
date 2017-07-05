'use strict'

import React, { PureComponent } from 'react'
import BlockHeader from './BlockHeader'
import BlockContent from './BlockContent'
import BlockTitle from './BlockTitle'
import BlockOptions from './BlockOptions'
import BlockActionDelete from './BlockActionDelete'
import BlockActionEdit from './BlockActionEdit'

class Block extends PureComponent {
  static defaultProps = {
    border: true
  }

  render () {
    return (
      <div className={'block ' + (this.props.border ? 'block-bordered' : '')}>
        {this.props.children}
      </div>
    )
  }
}

Block.Header = BlockHeader
Block.Content = BlockContent
Block.Options = BlockOptions
Block.Title = BlockTitle
Block.ActionDelete = BlockActionDelete
Block.ActionEdit = BlockActionEdit

export default Block
