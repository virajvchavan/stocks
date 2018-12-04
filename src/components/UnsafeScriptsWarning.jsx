import React from 'react'

const UnsafeScriptsWarning = props => {
  return (
    <div className='container'>
      <div className='card'>
        <div className='card-content'>
          You need to click on &nbsp;<code>Load Unsafe Scripts</code>&nbsp; to proceed.
          <br /> Look for the &nbsp;<code>shield icon</code>&nbsp; on your browser's addreess bar.  &#8679;
          <br /><br />(Trust me, it's just an app which shows some simulated share market data :p)
        </div>
        <footer className='card-footer'>
          <a onClick={props.loadApp} href='#' className="card-footer-item has-background-success">Proceed if you did that &#8679;</a>
        </footer>
      </div>
    </div>
  );
}

export default UnsafeScriptsWarning;