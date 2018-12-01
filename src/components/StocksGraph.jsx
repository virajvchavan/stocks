import React from 'react'

class StocksGraph extends React.Component {

  render() {
    return (
      <div className={'card column'} >
        <div className='card-header'>
          <div className='card-header-title'>
            Graph
          </div>
        </div>
        <div className='card-content'>
          <p>Actual Graph here</p>
        </div> 
      </div>
    );
  }
}

export default StocksGraph;