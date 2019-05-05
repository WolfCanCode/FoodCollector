import React, { Component } from "react";
import "./App.css";
import { createBrowserHistory } from "history";
import { Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Header, Icon } from "semantic-ui-react";
import { Button, Container, Grid } from "semantic-ui-react";

import homePageScreen from "./screen/home";
import menuScreen from "./screen/menu/index";
import menuDetailScreen from "./screen/menu/details";
import todayMenuScreen from "./screen/transaction/today";

const mapStateToProps = state => ({ globalStage: state });
const hist = createBrowserHistory();
class App extends Component {
  render() {
    return (
      <Router history={hist}>
        <Container>
          <Grid>
            <Grid.Row centered>
              <Header as="h2" icon>
                <Icon name="food" circular />
                <Header.Content>O2Food Collector</Header.Content>
              </Header>
            </Grid.Row>
            <Grid.Row centered>
              <Switch>
                <Route path={"/menus"} component={menuScreen} />
                <Route path={"/menu/add"} component={menuDetailScreen} />
                <Route path={"/menu/today"} component={todayMenuScreen} />
                <Route path={"/menu/:id"} component={menuDetailScreen} />
                <Route path={"/"} component={homePageScreen} />
              </Switch>
            </Grid.Row>
            <div
              style={{
                position: "fixed",
                margin: "1em",
                bottom: "0px",
                left: "0px",
                zIndex: 6
              }}
            >
              <Button>
                Make by WolfCanCode for O2f with{" "}
                <Icon name="heart" color="red" />{" "}
              </Button>
            </div>
          </Grid>
        </Container>
      </Router>
    );
  }
}

export default connect(mapStateToProps)(App);
