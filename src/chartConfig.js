// configurations required for ChartJs

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

// keep enough colors (should be as many as the number of stocks recieved)
// adding these manually to make sure the colors actually look good
export const chartColors = ["rgb(244, 67, 54)", "rgb(76, 175, 80)", "rgb(63, 81, 181)", "rgb(255, 152, 0)", "rgb(33, 150, 243)", "rgb(139, 195, 74)", "rgb(255, 87, 34)", "rgb(121, 85, 72)", "rgb(233, 30, 99)", "rgb(205, 220, 57)", "rgb(156, 39, 176)", "rgb(255, 235, 59)", "rgb(158, 158, 158)", "rgb(103, 58, 183)", "rgb(0, 150, 136)", "rgb(255, 193, 7)", "rgb(96, 125, 139)", "rgb(33, 33, 33)", "rgb(169, 4, 4)", "rgb(1, 74, 64)", "rgb(179, 3, 72)", "rgb(84, 58, 68)"];

export const chartDataset = (stock_name, color, stock_values) => {
  return {
    label: stock_name.toUpperCase(),
    fill: false,
    lineTension: 0,
    backgroundColor: color,
    borderColor: color,
    borderCapStyle: 'butt',
    borderJoinStyle: 'miter',
    pointBorderColor: color,
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: color,
    pointHoverBorderColor: color,
    pointHoverBorderWidth: 2,
    pointRadius: 3,
    pointHitRadius: 10,
    data: stock_values
  };
};
