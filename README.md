A demo application built in React.

Deployed here:http://stocksdemo.herokuapp.com)

What it does: Show real time stock market data (fake, random data, just to simulate) in the form of table and graphs

Subscribes to a Websocket(ws://stocks.mnet.website/) to fetch simulated stock market data.

Features:
  - A table showing data for all the stocks
  - Each row shows:
    - The latest stock price. (With color relative to the previous stock value)
    - A sparkline showing the changes in stock values (Without considering the time factor)
    - When was the specific stock last updated
  - Market Trend arrow indicating how stock values behaved
  - Ability to select any stocks, to be shown in the Graph
  - Graphs can show historical values wrt time for any stocks selected
  - Can zoom/pan over graph, Reset the zoom
  - Clear history of all stocks with the click of a button
  - Handles connection errors
  
Possible Enhancements: ([See issues](https://github.com/virajvchavan/stocks/issues))
  - An option to export the historical data of the selected stocks
  - Show Highs and Lows of individual stocks
  - A graph that can show aggregated condition for the overall market
