import React from 'react'
import {Line} from 'react-chartjs-2';
import * as zoom from 'chartjs-plugin-zoom'

class StocksGraph extends React.Component {

  update_chart = () => {
    let chart = this.refs.chart.chartInstance;
    const chart_colors = ["rgb(0,0,128)", "rgb(0,128,0)", "rgb(128,0,0)", "rgb(128,0,128)", "rgb(60, 180, 75)", "rgb(145,30,180)", "rgb(128,128,0)", "rgb(245,130,48)"];

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
              backgroundColor: chart_colors[index],
              borderColor: chart_colors[index],
              borderCapStyle: 'butt',
              borderJoinStyle: 'miter',
              pointBorderColor: chart_colors[index],
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: chart_colors[index],
              pointHoverBorderColor: chart_colors[index],
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

  render() {

    let chart_options = {
      responsive: true,
      scales: {
        xAxes: [{
          type: 'time',
          distribution: 'linear',
          ticks: {
            source: 'auto'
          },
          time: {
            displayFormats: {second: 'h:mm:ss a'},
            unit: 'second'
          },
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepValue: 10,
            steps: 10
          },
          scaleLabel: {
            display: true,
            labelString: 'Price ($)'
          }
        }]
      },
      pan: {
        enabled: true,
        mode: 'x'
      },
      zoom: {
        enabled: true,
        drag: false,
        mode: 'x'
      }
    };

    return (
      <div className={'card column'} >
        <div className='card-header'>
          <div className='card-header-title'>
            Graph
          </div>
        </div>
        <div className='card-content'>
          <Line
            data={{datasets: []}}
            options={chart_options}
            ref='chart'
          />
        </div> 
      </div>
    );
  }
}

export default StocksGraph;