- Show live stock prices in the form of table/graphs.
- data is coming from a websocket (ws://stocks.mnet.website)
  - format: [ [ name, price], [ name, price] … ]

- data in table/graphs should be updated as we recieve it from the websocket

- A simple table:
  - each row will have
    - stock_name
    - latest price (can color it relative to the previous value)
    - a sparkline graph for each row? (try how this looks)
    - when was the data for this stock last updated?
  - a way to select stocks by clicking on them

- A Graph:
  - Can show a line graph for each stock
  - x: time, y: stock_value
  - use a nice library for graphs
  - show graphs for only selected stocks
