import React from 'react'
import { Detector } from "react-detect-offline";
import StockRow from './StockRow.jsx'
import MarketTrend from './MarketTrend.jsx'

class StocksList extends React.Component {

  areStocksLoaded = () => {
    return Object.keys(this.props.stocks).length > 0
  }

  marketTrendArrow = () => {
    switch(this.props.market_trend){
      case 'up':
        return '&#8679;'
      case 'down':
        return '>&#8681;'
      default:
        return null
    }
  }

  render() {
    return (
      <div className='card column is-one-third' id='stocks_list'>
        <div className='card-header'>
          <div className='card-header-title'>
            Stocks
            &nbsp;
            {/*currently not handling the case when the internet is working but server is not responsding/server error, should be done through the websocket's connection info */}
            <Detector
              render={({ online }) => (
                <span className={online ? "tag is-success" : "tag is-danger"}>
                  {online ? "Live" : "Offline"}
                </span>
              )}
            />
            &nbsp;
            <button className='button is-small' onClick={this.props.resetData}>Clear history</button>
          </div>
        </div>
        <div className='card-content'>
          { this.areStocksLoaded() ? <p className='is-size-7 has-text-info'>Click on a stock to select/unselect</p> : null }
          <table className='table is-bordered'>
            <thead>
              <tr>
                <th>Name</th>
                <th>
                  Value
                  <MarketTrend current_trend={this.props.market_trend} />
                </th>
                <th>History</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.props.stocks).map((stock_name, index) =>
                {
                  let current_stock = this.props.stocks[stock_name];
                  return (
                    <StockRow
                      key={index} stock_name={stock_name}
                      stock_data={current_stock}
                      toggleStockSelection={this.props.toggleStockSelection}
                    />
                  )
                }
              )}
              { this.areStocksLoaded() ? null : <tr><td colSpan='4'>No stocks loaded yet!</td></tr> }
            </tbody>
          </table>
         </div>
      </div>
    );
  }
}

export default StocksList;