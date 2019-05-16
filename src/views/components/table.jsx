import React, { Component } from 'react'

export default class Table extends Component {
    
    renderColumns() {
        return this.props.columns.map((column, index) => {
            return <th key={`col-header-${index}`}>{column.name}</th>
        })
    }

    renderRows() {
        return this.props.rows.map((row, rowIndex) => {
            return <tr key={`row-${rowIndex}`}>
                {this.props.columns.map((col, colIndex) => {
                    return <td key={`cell-${rowIndex}-${colIndex}`}>{row[col.key]}</td>;
                })}
            </tr>
        })
    }

    render() {
        return (
            <table className="fl-table">
                <thead>
                    <tr>
                        {this.renderColumns()}
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }
}
