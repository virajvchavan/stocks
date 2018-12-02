import React from 'react'

class StockRow extends React.Component {

  render() {
    return (
      <tr id={this.props.stock_name} >
        <td>{this.props.stock_name.toUpperCase()}</td>
        <td>
          {this.props.stock_data.current_value.toFixed(2)}
        </td>
        <td>
          Sparkline
        </td>
        <td>..</td>
      </tr>
    );
  }
}

export default StockRow;