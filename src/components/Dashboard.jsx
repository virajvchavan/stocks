import React from 'react'
import Websocket from 'react-websocket';
import * as bulma from "reactbulma";
import StocksList from "./StocksList.jsx";
import StocksGraph from "./StocksGraph.jsx";

class Dashboard extends React.Component {

  save_new_stock_values = (data) => {
    console.log(data)
  }

  render() {
    return (
      <div className='container'>
        <Websocket url='ws://stocks.mnet.website/' onMessage={this.save_new_stock_values} />
        <div className='columns'>
          <StocksList />
          <StocksGraph />
        </div>
      </div>
    );
  }
}

export default Dashboard;