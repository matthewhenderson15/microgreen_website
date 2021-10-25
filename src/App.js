import React, { Component } from 'react';
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios';

import Cart from './components/Cart';
import ProductList from './components/ProductList';
import Context from './Context';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: {},
      product: []
    };
    this.routerRef = React.createRef;
  }

  async componentDidMount() {
    let cart = localStorage.getItem("cart");
    
    const product = await axios.get('http://localhost:3001/product');
    cart = cart ? JSON.parse(cart) : {};

    this.setState({ cart, product:product.data });
  }

  addToCart = cartItem => {
    let cart = this.state.cart;
    if (cart[cartItem.id]) {
      cart[cartItem.id].amount += cartItem.amount;
    } else {
      cart[cartItem.id] = cartItem;
    }
    if (cart[cartItem.id].amount > cart[cartItem.id].product.stock) {
      cart[cartItem.id].amount = cart[cartItem.id].product.stock;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  removeFromCart = cartItemID => {
    let cart = this.state.cart;
    delete cart[cartItemID];
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  clearCart = () => {
    let cart = {};
    localStorage.removeItem("cart");
    this.setState({ cart });
  }

  render() {
    const value = {
      ...this.state,
      removeFromCart: this.removeFromCart,
      addToCart: this.addToCart,
      clearCart: this.clearCart,
      checkout: this.checkout
    }
    
    return (
      <Context.Provider value={value}>
        <Router ref={this.routerRef}>
        <div className="App">
          <nav
            className="navbar container"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <b className="navbar-item is-size-4 ">La Petit Vert</b>
              <label
                role="button"
                class="navbar-burger burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                onClick={e => {
                  e.preventDefault();
                  this.setState({ showMenu: !this.state.showMenu });
                }}
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </label>
            </div>
              <div className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}>
                <Link to="/productlist" className="navbar-item">
                  Product List
                </Link>
                <Link to="/cart" className="navbar-item">
                  Cart
                  <span className="tag is-primary"
                    style={{ marginLeft: "5px" }}
                  >
                    { Object.keys(this.state.cart).length }
                  </span>
                </Link>
              </div>
            </nav>
            <Switch>
              <Route exact path="/" />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/productlist" component={ProductList} />
            </Switch>
          </div>
        </Router>
      </Context.Provider>
    );
  }
};
