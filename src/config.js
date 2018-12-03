export const chartJsConfig = { 
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

export const chartColors = ["rgb(0,0,128)", "rgb(0,128,0)", "rgb(128,0,0)", "rgb(128,0,128)", "rgb(60, 180, 75)", "rgb(145,30,180)", "rgb(128,128,0)", "rgb(245,130,48)"];