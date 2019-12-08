import React from 'react';
import { Line } from 'react-chartjs-2';
import { chartJsConfig, chartColors, chartDataset } from '../config/chartConfig.js';

// NOTE: The import from "chartjs-plugin-zoom" to "zoom" below is required to
//       support scrolling input in the chart graph (mouse support).
//       The "zoom" name is not explicitly referenced and would cause a compile warning.
//       Hence the eslint warning disabling below. ==>
// eslint-disable-next-line
import * as zoom from 'chartjs-plugin-zoom';

export class StocksGraph extends React.Component {

  updateChart = () => {
    const chart = this.refs.chart.chartInstance;

    if (Object.keys(this.props.stocks).length === 0) {
      chart.data.datasets = [];
      return chart.update();
    }

    Object.keys(this.props.stocks)
    .map((stock_name, idx) =>
      {
        const current_stock = this.props.stocks[stock_name];
        const chart_dataset = chart.data.datasets.find(
          (dataset) => dataset.label === stock_name );
  
        if (current_stock.is_selected) {
          const current_stock = this.props.stocks[stock_name];
          if (chart_dataset) { // update, no new dataset
            chart_dataset.data = this.getStockValues(current_stock);
          } else { // create new dataset for graph
            if (current_stock) {
              chart.data.datasets = chart.data.datasets.concat(
                [ chartDataset(stock_name,
                               chartColors[idx],
                               this.getStockValues(current_stock)) ] )
            }
          }
        } else {
          if (chart_dataset) { // remove dataset from graph
            chart.data.datasets.splice(chart.data.datasets.indexOf(chart_dataset), 1);
          }
        }
        chart.update();
        return true;
      })
  
  } // end updateChart

  componentDidUpdate = () => {
    this.updateChart();
  }

  // returns an array of objects, {t: timestamp, y: value}
  getStockValues = (stock) =>
    stock.history.map((h) => ({ t: new Date(h.time),
                                y: h.value }));

  resetZoom = () => {
    this.refs.chart.chartInstance.resetZoom();
  }

  render = () => (
    <div className={'card column'} >
      <div className='card-header'>
        <div className='card-header-title'>
          Graph
        </div>
      </div>
      <div className='card-content'>
        <p className='is-size-7 has-text-info'>
          { this.refs.chart &&
            this.refs.chart.chartInstance.data.datasets.length > 0
             ? 'Scroll/pinch to zoom, drag to pan.'
             : 'Click on any stocks on your left to see graphs.'
          }
        </p>
        <button className="button is-small is-pulled-right"
                onClick={this.resetZoom}>
          Reset zoom
        </button>
        <Line
          data={{datasets: []}}
          options={chartJsConfig}
          ref='chart' />
      </div> 
    </div>
  );

}
