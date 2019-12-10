import React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

// StocksList component exported, used by App
export const StocksList = (props) => {
  console.log(`StocksList render: ${Date.now()}`);
  return (
    <div className="card column is-one-third" id="stocks_list">
      <div className="card-header">
        <div className="card-header-title">
          <p className="stock-header-button">Stocks</p>
          &nbsp;
          <button className={(props.areUpdatesPaused() ? "tag is-danger" : "tag is-success")+" stock-header-button"}
                  onClick={props.pauseOrResume}>
            {props.areUpdatesPaused() ? "Paused" : "Online" }
          </button>
          &nbsp;
          <button className="button is-small stock-header-button"
                  onClick={props.resetData}>
            Clear history
          </button>
          &nbsp;
          <button className="button is-small stock-header-button"
                  onClick={props.pauseOrResume}>
            { props.areUpdatesPaused()
              ? "Resume"
              : "Pause"
            }
          </button>
        </div>
      </div>
      <div className="card-content">
        { props.areStocksLoaded()
          ? <p className="is-size-7 has-text-info">
              Click on a stock to select/unselect
            </p>
          : null
        }
        <table className="table is-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>
                Value
                <MarketTrendArrow current_trend={props.marketTrend} />
              </th>
              <th>History</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            { Object.keys(props.stocks)
              .map((stockName, idx) => (
                <StockRow
                    key={idx}
                    stockName={stockName}
                    stockData={props.stocks[stockName]}
                    toggleStockSelection={props.toggleStockSelection}
                />))
            }
            { props.areStocksLoaded()
              ? null
              : <tr>
                  <td colSpan="4">
                    No stocks loaded yet!
                  </td>
                </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}; // end StocksList component

// Determine 'time ago' without jQuery updating as the timeAgo npm module performs
// This allows the 'pause' function to actually pause without constant updating 'time ago'.
const timeAgoString = (d1, d2) => {

  const timediff = Math.abs(d2 - d1); //milliseconds
  const seconds = Math.floor(timediff * .001);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  const timeElements = [ seconds, minutes, hours, days, years ];
  const idx = (years > 0) ? 4
    : (days > 0) ? 3
    : (hours > 0) ? 2
    : (minutes > 0) ? 1
    : 0;
  const diff = timeElements[idx];

  if (idx === 0 && seconds === 0) return ['right now', 'right now'];
  const timeUnitString = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
  let timeUnit = timeUnitString[idx];
  if (diff > 1) timeUnit += 's';
  return [`${diff} ${timeUnit} ago`, `in ${diff} ${timeUnit}`];
};

// StockRow component: internal to StocksList, not exported
const StockRow = ({ stockData, stockName, toggleStockSelection }) => (
  <tr id={stockName}
      className={stockData.is_selected ? "selected" : null}
      onClick={ toggleStockSelection.bind(this, stockName) } >
    <td>
      {stockName}
    </td>
    <td className={getStockValueColor(stockData)}>
      {stockData.current_value.toFixed(2)}
    </td>
    <td>
      <Sparklines data={stockData.history.map((history) => { return history.value})}>
        <SparklinesLine color="blue" />
      </Sparklines>
    </td>
    <td className="updated_at">
      { timeAgoString(stockData.history.slice(-1)[0].time,
                      Date.now())[0]
      }
    </td>
  </tr>
); // end StockRow component

// getStockValueColor -- for StockRow component, understands history
const getStockValueColor = (stock) => {
  const cur_value = stock.current_value;
  const prev_value = stock.history.slice(-2)[0].value;
  return (
    (cur_value === prev_value)
    ? null
    :
    (cur_value > prev_value)
    ? "green"
    : "red"
  );
}

// MarketTrendArrow component is internal to StocksList, not exported
const MarketTrendArrow = (props) => (
  <span title="Market trend"
        className={"icon market-trend"}>
    { (props.current_trend === "up")
      ? <span className="up-arrow">&#8679;</span>
      :
      (props.current_trend === "down")
      ? <span className="down-arrow">&#8681;</span>
      : "-"
    }
  </span>
);  // end MarketTrendArrow
