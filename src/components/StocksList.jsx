import React from 'react'

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
              {/*add rows in a loop here*/}
            </tbody>
          </table>
         </div>
      </div>
    );
  }
}

export default StocksList;