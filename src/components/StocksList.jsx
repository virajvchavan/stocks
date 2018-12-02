import React from 'react'
import StockRow from './StockRow.jsx'

class StocksList extends React.Component {

  render() {
    return (
      <div className='card column is-one-third' id='stocks_list'>
        <div className='card-header'>
          <div className='card-header-title'>Stocks</div>
        </div>
        <div className='card-content'>
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
                      key={index} stock_name={stock_name} stock_data={current_stock}
                    />
                  )
                }
              )}
              { Object.keys(this.props.stocks).length > 0 ? null : <tr><td colSpan='4'>No stocks loaded yet!</td></tr> }
            </tbody>
          </table>
         </div>
      </div>
    );
  }
}

export default StocksList;