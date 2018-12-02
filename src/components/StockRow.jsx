import React from 'react'
import { Sparklines, SparklinesLine } from 'react-sparklines';

class StockRow extends React.Component {

  render() {
    return (
      <tr id={this.props.stock_name} >
        <td>{this.props.stock_name.toUpperCase()}</td>
        <td className={this.props.getStockValueColor(this.props.stock_data)}>
          {this.props.stock_data.current_value.toFixed(2)}
        </td>
        <td>
          <Sparklines data={this.props.stock_data.history.map((history) => { return history.value})}>
            <SparklinesLine color="blue" />
          </Sparklines>
        </td>
        <td>..</td>
      </tr>
    );
  }
}

export default StockRow;