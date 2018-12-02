import React from 'react'
import { Sparklines, SparklinesLine } from 'react-sparklines';

class StockRow extends React.Component {

  // make this better
  lastUpdatedAt = (stock) => {
    let time_diff = Date.now() - Number(stock.history.slice(-1)[0].time);
    if(time_diff <= 4000){
      // stays 'just now' until this function is called again: WRONG
      return 'just now'
    }
    else if(time_diff > 4000 && time_diff <60000){
      return '< 1m'
    }
    else{
      return '> 1m'
    }
  }

  getStockValueColor = (stock) =>{
    if(stock.current_value < stock.history.slice(-2)[0].value){
      return 'red';
    }
    else if(stock.current_value > stock.history.slice(-2)[0].value){
      return 'green';
    }
    else{
      return null;
    }
  }

  render() {
    return (
      <tr id={this.props.stock_name} >
        <td>{this.props.stock_name.toUpperCase()}</td>
        <td className={this.getStockValueColor(this.props.stock_data)}>
          {this.props.stock_data.current_value.toFixed(2)}
        </td>
        <td>
          <Sparklines data={this.props.stock_data.history.map((history) => { return history.value})}>
            <SparklinesLine color="blue" />
          </Sparklines>
        </td>
        <td>{this.lastUpdatedAt(this.props.stock_data)}</td>
      </tr>
    );
  }
}

export default StockRow;