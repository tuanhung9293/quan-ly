'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { Row, Col } from 'react-bootstrap'
import { FormattedDate } from 'react-intl'
import { EmptyBlock } from 'packages/oneui'
import ComponentRegistry from 'packages/api/ComponentRegistry'
import Moment from 'moment'

class LogByDate extends Component {
  static propTypes = {
    date: PropTypes.any.isRequired,
    logs: PropTypes.any.isRequired
  }

  render () {
    const formatDate = this.props.intl.formatDate
    const { component: Component, date, logs } = this.props

    const logComponents = logs.toJS().map(function (log) {
      return ComponentRegistry.get('LogRow', log)
    })

    const title = (
      formatDate(Moment(date).toDate())
    )
    return (
      <Row>
        <Col xs={12}>
          <EmptyBlock title={title}>
            <table className='table table-vcenter table-borderless table-striped table-hover'>
              <tbody>
              {logComponents}
              </tbody>
            </table>
          </EmptyBlock>
        </Col>
      </Row>
    );
  }
}

export default injectIntl(LogByDate)