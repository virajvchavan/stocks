import React, { Component } from 'react';
import './App.css';
import { StocksList } from "./StocksList.jsx";
import { StocksGraph } from "./StocksGraph.jsx";

// NOTE: The import from "reactbulma" to "bulma" below is required to
//       render the 'history' column properly.  The "bulma" name is
//       not explicitly referenced and would cause a compile warning.
//       Hence the eslint warning disabling below. ==>
// eslint-disable-next-line
import * as bulma from "reactbulma";

export class App extends Component {

  state = {
    hasError: false,
    showSpinner: true
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log('some error has occured');
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  hideSpinner = () => {
    this.setState({showSpinner: false});
  }

  render() {
    return (this.state.hasError)
      ? <UnsafeScriptsWarning />
      : <div className="App">
          <Dashboard hideSpinner={this.hideSpinner}
                     showSpinner={this.state.showSpinner} />
        </div>;
  }
}

// UnsafeScriptsWarning component is internal to App
const UnsafeScriptsWarning = (props) => (
  <div className='container stocks-loader'>
    <div className='card-header'>
      <div className='card-header-icon'>
        <span className='loader'></span>
      </div>
      <div className='card-header-title'>
        Loading...
      </div>
    </div>
    <div className='card'>
      <div className='card-content'>
        You need to click on &nbsp;<code>Load Unsafe Scripts</code>&nbsp; to proceed.
        <br/> Look for the &nbsp;<code>shield icon</code>&nbsp; on your browser's addreess bar.  &#8679;
        <br/><br/>(Trust me, it's just an app which shows some simulated share market data :p)
      </div>
    </div>
  </div>
);

const stocksUrl = 'ws://stocks.mnet.website/';

class Dashboard extends React.Component {

  state = {
  // stocks = {name: {current_value: 12, history: [{time: '2131', value: 45}, ...], is_selected: false}, ...}
   stocks: {},
   market_trend: undefined, // 'up' or 'down'
   connectionError: false,
   updatingPaused: false
  };

  componentDidMount = () => {
    this.establishStockWebSocket();
  };

  establishStockWebSocket = () => {
    this.connection = new WebSocket(stocksUrl);
    this.connection.onmessage = this.saveNewStockValues;
    this.connection.onclose = () => { this.setState({connectionError: true}) }
  };

  saveNewStockValues = (event) => {
    // triggered by stock update message from websocket
    this.props.hideSpinner();
    const result = JSON.parse(event.data);
    let [up_values_count, down_values_count] = [0, 0];

    // time stored in histories should be consisitent across stocks(better for graphs)
    const current_time = Date.now();
    const new_stocks = this.state.stocks
    result.map((stock) =>
      { // stock = ['name', 'value']
        if (this.state.stocks[stock[0]]) {
          new_stocks[stock[0]].current_value > Number(stock[1]) ? up_values_count++ : down_values_count++;
          new_stocks[stock[0]].current_value = Number(stock[1])
          new_stocks[stock[0]].history.push({time: current_time, value: Number(stock[1])})
        } else {
          new_stocks[stock[0]] = { current_value: stock[1], history: [{time: Date.now(), value: Number(stock[1])}], is_selected: false }
        }
        return true;
      });
    this.setState({stocks: new_stocks, market_trend: this.newMarketTrend(up_values_count, down_values_count)})
  };

  // characaterize values that just came in as up/down/nc, not all the stocks
  newMarketTrend = (up_count, down_count) => (
    (up_count === down_count)
    ? undefined
    :
    (up_count > down_count)
    ? 'up'
    : 'down'
  );

  toggleStockSelection = (stock_name) => {
    const new_stocks = this.state.stocks;
    new_stocks[stock_name].is_selected =
        !new_stocks[stock_name].is_selected
    this.setState({ stocks: new_stocks })
  };

  resetData = () => {
    const new_stocks = this.state.stocks;
    Object.keys(this.state.stocks)
    .map((stock_name) =>
      { new_stocks[stock_name].history =
            [new_stocks[stock_name].history.pop()];
        return true;
      });
    this.setState({ stocks: new_stocks });
  };

  areStocksLoaded = () => Object.keys(this.state.stocks).length > 0;

  isUpdatingPaused = () => this.state.updatingPaused;

  pauseOrResume = () => {
    const toggled_value = !this.state.updatingPaused;
    if (toggled_value) { // pausing
      this.connection.close();
    } else { // resuming, re-create connection to stock updates
      this.establishStockWebSocket();
    }
    this.setState({ updatingPaused: toggled_value });
    return undefined;
  };

  render = () => (
    <div className='container'>
      <div className='columns'>
        <StocksList
          stocks={this.state.stocks}
          toggleStockSelection={this.toggleStockSelection}
          resetData={this.resetData}
          market_trend={this.state.market_trend}
          areStocksLoaded={this.areStocksLoaded}
          updatingPaused={this.isUpdatingPaused}
          pauseOrResume={this.pauseOrResume}
        />
        <StocksGraph stocks={this.state.stocks} />
      </div>
      <div className={ this.props.showSpinner ? 'modal is-active' : 'modal' }>
        <div className="modal-background"></div>
        <div className="modal-content">
          <StocksLoaderStatus connectionError={this.state.connectionError} />
        </div>
      </div>
    </div>
  ); // end render

}

// StocksLoaderStatus is internal to Dashboard
const StocksLoaderStatus = (props) => (
  (props.connectionError)
  ? <div className='is-medium'>
        <span className='has-text-danger'>
          The server sent no data; the market may be closed.
        </span>
        <br />{"Come back later? :-)"}
    </div>
  : <div className='tag is-large is-success'>
        <span className='loader'> &nbsp;</span>
        &nbsp; &nbsp; Fetching some stocks...
    </div>
);
