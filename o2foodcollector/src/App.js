import React, { Component } from "react";
import "./App.css";
import { createBrowserHistory } from "history";
import { Router, Switch, Route, Link } from "react-router-dom";
import { connect } from "react-redux";

const mapStateToProps = state => ({ globalStage: state });
const hist = createBrowserHistory();
class App extends Component {
  render() {
    return (
      <Router history={hist}>
        <Switch>
          <Route
            path={"/menu/today"}
            render={() => <h1>Today we have....</h1>}
          />
          <Route path={"/menus"} render={() => <h1>Menu list</h1>} />
          <Route
            path={"/"}
            render={() => (
              <div>
                <h1>Welcome to O2FoodCollector</h1>
                <h3>Here are the options for you</h3>
                <ul>
                  <li><Link to={"/menu/today"}>Menu today</Link></li>
                  <li><Link to={"/menus"}>Menu in the past</Link></li>

                </ul>
              </div>
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default connect(mapStateToProps)(App);
