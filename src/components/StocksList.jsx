import React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import TimeAgo from 'react-timeago'

// StockRow component is internal to StocksList, not exported
const StockRow = (props) => {
  
  const getStockValueColor = (stock) => {
    const cur_value = stock.current_value;
    const prev_value = stock.history.slice(-2)[0].value;
    return ((cur_value < prev_value)
             ? 'red'
             :
            (cur_value > prev_value)
             ? 'green'
             : null
           );
  }

  // render logic:
  const { stock_data, stock_name } = props;
  return (
      <tr className={stock_data.is_selected ? 'selected' : null} id={stock_name}
          onClick={props.toggleStockSelection.bind(this, stock_name)} >
        <td>
          {stock_name}
        </td>
        <td className={getStockValueColor(stock_data)}>
          {stock_data.current_value.toFixed(2)}
        </td>
        <td>
          <Sparklines data={stock_data.history.map((history) => { return history.value})}>
            <SparklinesLine color="blue" />
          </Sparklines>
        </td>
        <td className='updated_at'>
          <TimeAgo date={ stock_data.history.slice(-1)[0].time } />
        </td>
      </tr>
  );
}

// MarketTrendArrow component is internal to StocksList, not exported
const MarketTrendArrow = (props) => {
  return (
      <span title='Market trend'
            className={"icon market-trend"}>
        {(props.current_trend === 'up')
         ? <span className='up-arrow'>&#8679;</span>
         :
         (props.current_trend === 'down')
         ? <span className='down-arrow'>&#8681;</span>
         : '-'
        }
      </span>
    );
};

// StocksList component is exported, used by Dashboard
export const StocksList = (props) => (
    <div className='card column is-one-third' id='stocks_list'>
      <div className='card-header'>
        <div className='card-header-title'>
          <p className="stock-header-button">Stocks</p>
          &nbsp;
          <button className={(props.updatingPaused() ? "tag is-danger" : "tag is-success")+" stock-header-button"}
                  onClick={props.pauseOrResume}>
            {props.updatingPaused() ? "Paused" : "Online" }
          </button>
          &nbsp;
          <button className='button is-small stock-header-button'
                  onClick={props.resetData}>
            Clear history
          </button>
          &nbsp;
          <button className="button is-small stock-header-button"
                  onClick={props.pauseOrResume}>
            { props.updatingPaused() ? "Resume" : "Pause" }
          </button>
        </div>
      </div>
      <div className='card-content'>
        { props.areStocksLoaded() ? <p className='is-size-7 has-text-info'>Click on a stock to select/unselect</p> : null }
        <table className='table is-bordered'>
          <thead>
            <tr>
              <th>Name</th>
              <th>
                Value
                <MarketTrendArrow current_trend={props.market_trend} />
              </th>
              <th>History</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            { Object.keys(props.stocks)
                .map((stock_name, index) => (
                <StockRow
                    key={index} stock_name={stock_name}
                    stock_data={props.stocks[stock_name]}
                    toggleStockSelection={props.toggleStockSelection}
                />))
            }
            { props.areStocksLoaded() ? null : <tr><td colSpan='4'>No stocks loaded yet!</td></tr> }
          </tbody>
        </table>
       </div>
    </div>
  );
