import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>EuclidOLAP Web Console</h1>
        <h3>EuclidOLAP is a data analysis system with unparalleled multidimensional analysis capabilities.</h3>
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        <a
          className="App-link"
          href="http://www.euclidolap.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.euclidolap.com
        </a>
      </header>
    </div>
  );
}

export default App;
