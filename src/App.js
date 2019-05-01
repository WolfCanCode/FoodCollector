import React, { Component } from "react";
import "./App.css";
import { createBrowserHistory } from "history";
import { Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Header, Icon } from "semantic-ui-react";
import { Button } from 'semantic-ui-react'

import homePageScreen from "./screen/home";

const mapStateToProps = state => ({ globalStage: state });
const hist = createBrowserHistory();
class App extends Component {
  render() {
    return (
      <Router history={hist}>
        <Header as="h2" icon textAlign="center">
          <Icon name="food" circular />
          <Header.Content>O2Food Collector</Header.Content>
        </Header>

        <Switch>
          <Route
            path={"/menu/today"}
            render={() => <h1>Today we have....</h1>}
          />
          <Route path={"/menus"} render={() => <h1>Menu list</h1>} />
          <Route path={"/"} component={homePageScreen} />
        </Switch>
        <div style={{position: "fixed", margin: "1em", bottom: "0px", left: "0px", zIndex: 6}}>
          <Button>Make by WolfCanCode for O2f with <Icon name="heart" color="red"/> </Button>
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps)(App);
