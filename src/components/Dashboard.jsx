import React from 'react'
import Websocket from 'react-websocket';
import * as bulma from "reactbulma";
import StocksList from "./StocksList.jsx";
import StocksGraph from "./StocksGraph.jsx";

const stocksUrl = 'ws://stocks.mnet.website/';

class Dashboard extends React.Component {

  state = {
  // stocks = {name: {current_value: 12, history: [{time: '2131', value: 45}, ...], is_selected: false}, ...}
   stocks: {},
   market_trend: undefined
  }

  saveNewStockValues = (data) => {
    let result = JSON.parse(data);
    let [up_values_count, down_values_count] = [0, 0]

    // time stored in histories should be consisitent across stocks(better for graphs)
    let current_time = Date.now();
    let new_stocks = this.state.stocks
    result.map((stock) =>
    {
      // stock = ['name', 'value']
      if(this.state.stocks[stock[0]])
      {
        if(new_stocks[stock[0]].current_value > Number(stock[1]))
        {
          up_values_count++;
        }
        else
        {
          down_values_count++;
        }

        new_stocks[stock[0]].current_value = Number(stock[1])
        new_stocks[stock[0]].history.push({time: current_time, value: Number(stock[1])})
      }
      else
      {
        new_stocks[stock[0]] = { current_value: stock[1], history: [{time: Date.now(), value: Number(stock[1])}], is_selected: false }
      }
    });
    this.setState({stocks: new_stocks, market_trend: up_values_count > down_values_count ? 'up' : 'down'})
  }

  toggleStockSelection = (stock_name) => {
    let new_stocks = this.state.stocks;
    new_stocks[stock_name].is_selected = !new_stocks[stock_name].is_selected
    this.setState({ stocks: new_stocks })
  }

  resetData = () => {
    let new_stocks = this.state.stocks;
    Object.keys(this.state.stocks).map((stock_name, index) =>
    {
      new_stocks[stock_name].history = [new_stocks[stock_name].history.pop()];
    });
    this.setState({ stocks: new_stocks });
  }

  render() {
    return (
      <div className='container'>
        <Websocket url={stocksUrl} onMessage={this.saveNewStockValues} />
        <div className='columns'>
          <StocksList
            stocks={this.state.stocks}
            toggleStockSelection={this.toggleStockSelection}
            resetData={this.resetData}
            market_trend={this.state.market_trend}
          />
          <StocksGraph stocks={this.state.stocks} />
        </div>
      </div>
    );
  }
}

export default Dashboard;