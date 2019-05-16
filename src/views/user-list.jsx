import React, { Component } from 'react'
import Panel from './layouts/panel';
import Table from './components/table';

const columns = [
  {
    name: 'col 1',
    key: 'col1'
  },
  {
    name: 'col 2',
    key: 'col2'
  },
]


const rows = [
  {
    col1: 'asd',
    col2: 'asd2'
  },
  {
    col1: 'salam',
    col2: 'chetory'
  },
]

export default class Index extends Component {
  render() {
    return (
      <Panel page={this.props.page} sidebar={this.props.sidebar}>
        <div className="mdc-layout-grid">
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell">
              <div className="mdc-elevation--z6">
                <Table rows={this.props.rows} columns={this.props.columns} />
              </div>
            </div>
          </div>
        </div>
      </Panel>
    )
  }
}
