import React, {Component} from 'react';
import axios from "axios";
import logo from './logo.svg';
import trending_up from './trending_up.svg';
import trending_down from './trending_down.svg';
import trending_unchanged from './trending_unchanged.svg';
import './App.css';

export default class App extends Component {

  //define the state variables 
  state = {
    current_price: '-',
    previous_price: '-',
    current_trending_logo: trending_up,
    loading: false,
    display_error: false
  }

  //when the component mounts, fetch the current bitcoin price from the API
  componentDidMount = () => {
    this.fetchCurrentBitcoinPrice();
  }


  fetchCurrentBitcoinPrice = () => {
    //set the loading state to true
    this.setState({loading: true});

    setTimeout(() => {
      //fetch data from our remote endpoint
      axios.get('http://localhost:8080/api/bitcoin/fetch')
      .then(response => {
        console.log(response.data);
        let current_trending_logo = null;
        if(response.data.current_price.mid > response.data.previous_price.mid ){
          current_trending_logo = trending_up
        } else if (response.data.current_price.mid < response.data.previous_price.mid){
          current_trending_logo = trending_down
        } else {
          current_trending_logo = trending_unchanged;
        }
        this.setState({
          //update the current and previous prices, for UI re-rendering
          current_price: Math.round(response.data.current_price.mid, 2),
          previous_price: Math.round(response.data.previous_price.mid,2),

          //change button state from loading to retry
          loading: false,
          current_trending_logo: current_trending_logo,
          display_error: false
        });

      })
      .catch(error => {
        this.setState({
          loading: false,
          display_error: true
        });
      })
    }, 2000)
    
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Current ₿itcoin Price</h1>
        </header>
        <main className="main">
          <span id="current-price-span">Current Price: <span id="current-price-amount">$ {this.state.current_price}</span>
          <img src={this.state.current_trending_logo} className="trend" alt="trending_up" />
           </span>
          <span id="previous-price-span">Last Price: <span id="previous-price-amount">$ {this.state.previous_price}</span></span>
          <button className={this.state.loading === true ? 'App-link' : 'App-link-loading'}
            onClick={this.fetchCurrentBitcoinPrice}>
            {this.state.loading ? 'Loading...' : 'Refresh'}
          </button>

          {
           this.state.display_error && <span className="error">Error while fetching bitcoin price. Please Retry</span>
          }
          
        </main>
      </div>
    );
  }
}