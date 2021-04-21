import React, { Component } from "react";
import "./App.css";
import { StocksList } from "./StocksList";
import { StocksGraph } from "./StocksGraph";

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
  };  // end this.state definition

  static getDerivedStateFromError(error) { // Update state, render will show the fallback UI.
    console.log('some error has occured');
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
    // NOTE: Could also log to a reporting service
  }

  hideSpinner = () => {
    this.setState(
      { showSpinner: false }
    );
  };

  render = () => (
    (this.state.hasError)
    ? <UnsafeScriptsWarning />
    : <div className="App">
        <Dashboard hideSpinner={this.hideSpinner}
                   showSpinner={this.state.showSpinner} />
      </div>
  );

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

class Dashboard extends React.Component {

  state = {
  // stocks = { name: { current_value: 12,
  //                    history: [{time: '2131', value: 45}, ...],
  //                    is_selected: false},
  //            <more-stock-definitions-with-history>
  //          }
   stocks: {},
   marketTrend: undefined, // 'up' or 'down'
   connectionError: false,
   updatesArePaused: false
  }; // end this.state definition

  establishStockWebSocket = () => {
    const stocksUrl = 'ws://stocks.mnet.website/';
    this.connection = new WebSocket(stocksUrl);
    this.connection.onmessage = this.updateStockValues;
    this.connection.onclose = () => {
       this.setState(
         { connectionError: true}
       )
    };
  }; // end establishStockWebSocket()

  updateStockValues = (e) => {
    // triggered by stock update message from websocket, 'onmessage' event handler
    this.props.hideSpinner();
    const result = JSON.parse(e.data);
    let [ upStocks, downStocks ] = [0, 0];

    // result is simulated stock prices for some set of stocks
    // time stored in histories should be consisitent across stocks(better for graphs)
    const currentTime = Date.now();
    const stocks = this.state.stocks;
    result.map((stockUpdateReport) =>
      { // stockUpdateReport = ['name', 'value']
        const [ stockName, stockPrice ] = stockUpdateReport;
        const newValue = Number(stockPrice);
        if (stocks[stockName]) { // exists, has history
          const stock = stocks[stockName];          
          (stock.current_value < newValue) ? upStocks++ : downStocks++;
          stock.current_value = newValue;
          stock.history.push(
            { time: currentTime, value: newValue }
          );
        } else {
          stocks[stockName] =
            { current_value: stockPrice,
              history: [ { time: currentTime, value: newValue } ],
              is_selected: false
            };
        }
        return true; // needed because of map
      });
    // NOTE: up_stocks and down_stocks set during map processing above
    this.setState(
      { stocks: stocks,
        marketTrend: this.newMarketTrend(upStocks, downStocks)
      });
  }; // end updateStockValues()

  // characaterize values that just came in as up/down/nc, not all the stocks
  newMarketTrend = (upStocks, downStocks) => (
    (upStocks === downStocks)
    ? undefined
    :
    (upStocks > downStocks)
    ? 'up'
    : 'down'
  );

  toggleStockSelection = (stockName) => {
    const stocks = this.state.stocks;
    stocks[stockName].is_selected = !stocks[stockName].is_selected;
    this.setState(
      { stocks: stocks }
    );
  };

  resetData = () => {
    const stocks = this.state.stocks;
    Object.keys(this.state.stocks)
    .map((stockName) =>
      { // keep one history element, the most current, pop to get it
        const stock = stocks[stockName];
        stock.history = [ stock.history.pop() ];
        return true; // necessary because of map
      });
    this.setState(
      { stocks: stocks }
    );
  }; // end resetData()

  areStocksLoaded = () => Object.keys(this.state.stocks).length > 0;

  areUpdatesPaused = () => this.state.updatesArePaused;

  pauseOrResume = () => {
    const pausing = !this.state.updatesArePaused;
    if (pausing) {
      this.connection.close();
      this.connection = undefined;
    } else { // resuming, re-create connection to stock updates
      this.establishStockWebSocket();
    }
    this.setState(
      { updatesArePaused: pausing }
    );
    return undefined;
  }; // end pauseOrResume()

  componentDidMount (props, state) {
    this.establishStockWebSocket();
  }

  render = () => {
    // console.log(`Dashboard render: ${Date.now()}`);
    return (
      <div className='container'>
        <div className='columns'>
          <StocksList
            stocks={this.state.stocks}
            toggleStockSelection={this.toggleStockSelection}
            resetData={this.resetData}
            marketTrend={this.state.marketTrend}
            areStocksLoaded={this.areStocksLoaded}
            areUpdatesPaused={this.areUpdatesPaused}
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
    );
  }; // end render

}

// StocksLoaderStatus is internal to Dashboard
const StocksLoaderStatus = (props) => (
  (props.connectionError)
  ? <div className='is-medium'>
      <span className='has-text-danger'>
        No data received; the market may be closed.
      </span>
      <br />{"Come back later? :-)"}
    </div>
  : <div className='tag is-large is-success'>
        <span className='loader'> &nbsp;</span>
        &nbsp; &nbsp; Fetching stock information ...
    </div>
);
