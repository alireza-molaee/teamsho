import React, { Component } from 'react'
import Panel from './layouts/panel';

export default class Index extends Component {
  render() {
    return (
        <Panel page={this.props.page} sidebar={this.props.sidebar}>
            <h1>test</h1>
        </Panel>
    )
  }
}
