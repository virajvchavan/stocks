import React from 'react'
import StockRow from './StockRow.jsx'
import { Detector } from "react-detect-offline";

class StocksList extends React.Component {

  are_stocks_loaded = () => {
    return Object.keys(this.props.stocks).length > 0
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
            <a className='button is-small' onClick={this.props.resetData}>Clear history</a>
          </div>
        </div>
        <div className='card-content'>
          { this.are_stocks_loaded() ? <p className='is-size-7 has-text-info'>Click on a stock to select/unselect</p> : null }
          <table className='table is-bordered'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>History</th>
                <th>Update At</th>
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
              { this.are_stocks_loaded() ? null : <tr><td colSpan='4'>No stocks loaded yet!</td></tr> }
            </tbody>
          </table>
         </div>
      </div>
    );
  }
}

export default StocksList;