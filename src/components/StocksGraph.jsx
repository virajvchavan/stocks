import React from 'react'
import {Line} from 'react-chartjs-2';
import * as zoom from 'chartjs-plugin-zoom'
import { chartJsConfig, chartColors } from '../config.js'

class StocksGraph extends React.Component {

  update_chart = () => {
    let chart = this.refs.chart.chartInstance;

    if(Object.keys(this.props.stocks).length === 0)
    {
      chart.data.datasets = [];
      return chart.update();
    }

    Object.keys(this.props.stocks).map((stock_name, index) =>
    {
      let current_stock = this.props.stocks[stock_name];
      let chart_dataset = chart.data.datasets.find((dataset) => { return dataset.label === stock_name.toUpperCase() });

      if(current_stock.is_selected)
      {
        let current_stock = this.props.stocks[stock_name];
        if(chart_dataset)
        {
          // only update the data, don't create a new dataset for the graph
          chart_dataset.data = this.get_chart_data(current_stock);
        }
        else
        {
          // create a new dataset for graph
          if(current_stock)
          {
            let dataset = {
              label: stock_name.toUpperCase(),
              fill: false,
              lineTension: 0,
              backgroundColor: chartColors[index],
              borderColor: chartColors[index],
              borderCapStyle: 'butt',
              borderJoinStyle: 'miter',
              pointBorderColor: chartColors[index],
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: chartColors[index],
              pointHoverBorderColor: chartColors[index],
              pointHoverBorderWidth: 2,
              pointRadius: 3,
              pointHitRadius: 10,
              data: this.get_chart_data(current_stock)
            };
            chart.data.datasets = chart.data.datasets.concat([dataset])
          }
        }
      }
      else
      {
        if(chart_dataset)
        {
          // remove the dataset from graph
          chart.data.datasets.splice(chart.data.datasets[chart_dataset], 1);
        }
      }
      chart.update();
    })
  }

  componentDidUpdate = () => {
    this.update_chart();
  }

  get_chart_data = (stock) =>{
    return stock.history.map((history) => { return {t: new Date(history.time), y: history.value}})
  }

  resetZoom = () => {
    this.refs.chart.chartInstance.resetZoom();
  }

  render() {
    return (
      <div className={'card column'} >
        <div className='card-header'>
          <div className='card-header-title'>
            Graph
          </div>
        </div>
        <div className='card-content'>
          <p className='is-size-7 has-text-info'>
            { this.refs.chart && this.refs.chart.chartInstance.data.datasets.length > 0 ? 'Scroll/pinch to zoom, drag to pan.' : 'Click on any stocks on your left to see graphs.' }
          </p>
          <a className="button is-small is-pulled-right" onClick={this.resetZoom}>Reset zoom</a>
          <Line
            data={{datasets: []}}
            options={chartJsConfig}
            ref='chart'
          />
        </div> 
      </div>
    );
  }
}

export default StocksGraph;