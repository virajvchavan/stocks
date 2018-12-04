import React from 'react'
import { Sparklines, SparklinesLine } from 'react-sparklines';
import TimeAgo from 'react-timeago'

class StockRow extends React.Component {

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
    let history = this.props.stock_data.history;
    return (
      <tr className={ this.props.stock_data.is_selected ? 'selected' : null } id={this.props.stock_name} onClick={this.props.toggleStockSelection.bind(this, this.props.stock_name)} >
        <td>{this.props.stock_name.toUpperCase()}</td>
        <td className={this.getStockValueColor(this.props.stock_data)}>
          {this.props.stock_data.current_value.toFixed(2)}
        </td>
        <td>
          <Sparklines data={history.map((history) => { return history.value})}>
            <SparklinesLine color="blue" />
          </Sparklines>
        </td>
        <td className='updated_at'>
          <TimeAgo date={ history.slice(-1)[0].time } />
        </td>
      </tr>
    );
  }
}

export default StockRow;