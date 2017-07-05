'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, InputGroup, Col, FormControl } from 'react-bootstrap'
import { Field } from 'redux-form'

export default class OneFieldForm extends React.Component {
  static defaultProps = {
    submittingIcon: 'fa fa-spinner fa-spin',
    icon: 'fa fa-plus'
  }

  static propTypes = {
    onSubmit: PropTypes.func
  }

  render () {
    const { submitting, name, placeholder, icon, submittingIcon, handleSubmit } = this.props
    return (
      <Form horizontal={true} onSubmit={handleSubmit}>
        <FormGroup>
          <Col xs={12}>
            <InputGroup>
              <Field name={name} type='text' component='input' className='form-control' placeholder={placeholder}/>
              <InputGroup.Button>
                <button type="submit"
                        className="btn btn-effect-ripple btn-primary"
                        style={{ overflow: 'hidden', position: 'relative' }}>
                  {
                    submitting ?
                      (<i className={submittingIcon}></i>) :
                      (<i className={icon}></i>)
                  }
                </button>
              </InputGroup.Button>
            </InputGroup>
          </Col>
        </FormGroup>
      </Form>
    )
  }
}