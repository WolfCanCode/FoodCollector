import React, { Component } from "react";
import "./App.css";
import { createBrowserHistory } from "history";
import { Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Header, Icon } from "semantic-ui-react";
import { Button, Container, Grid, Modal, Input } from "semantic-ui-react";
import { reactLocalStorage } from "reactjs-localstorage";

import homePageScreen from "./screen/home";
import menuScreen from "./screen/menu/index";
import menuDetailScreen from "./screen/menu/details";
import todayMenuScreen from "./screen/transaction/today";
import firebase from "./utils/firebase";
import { setUser } from "./actions/user";
const db = firebase.firestore();

const mapStateToProps = state => ({ globalStage: state });
const hist = createBrowserHistory();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      user: "",
      hasReg:
        !this.props.globalStage.user || !reactLocalStorage.get("name_o2" || true)
    };
    console.log(reactLocalStorage.get("name_o2"));
  }

  componentDidMount() {
    if (
      this.props.globalStage.user ||
      (this.props.globalStage.user && !this.props.globalStage.user.name)
    ) {
      if (reactLocalStorage.get("name_o2")) {
        this.props.dispatch(
          setUser({ name: reactLocalStorage.get("name_o2") })
        );
      } else {
        db.collection("users")
          .get()
          .then(collection => {
            let users = collection.docs.map(doc => {
              return { id: doc.id, data: doc.data() };
            });
            this.setState({ users: users });
          });
      }
    }
  }

  handleChange(value) {
    this.setState({ user: value });
  }

  pickUser() {
    db.collection("users")
      .where("name", "==", this.state.user)
      .get()
      .then(collection => {
        if (collection.docs.length > 0) {
          this.props.dispatch(setUser(collection.docs[0].data()));
          this.setState({ hasReg: false });
        } else {
          db.collection("users")
            .add({ name: this.state.user })
            .then(() => {
              this.props.dispatch(setUser({ name: this.state.user }));
              this.setState({ hasReg: false });
            });
        }
      });
  }

  render() {
    return (
      <Router history={hist}>
        <Container>
          <Modal  size="mini" dimmer={true} open={this.state.hasReg}>
            <Modal.Header>Make sure who are you ?</Modal.Header>
            <Modal.Content>
              <Input
                list="users"
                placeholder="You are ..."
                value={this.state.user}
                onChange={e => this.handleChange(e.target.value)}
              />
              {this.state.users && this.state.users.length > 0 && (
                <datalist id="users">
                  {this.state.users.map((user, index) => (
                    <option key={index} value={user.data.name} />
                  ))}
                </datalist>
              )}
            </Modal.Content>
            <Modal.Actions>
              <Button
                positive
                icon="checkmark"
                labelPosition="right"
                content="Yep, that's me"
                onClick={() => this.pickUser()}
              />
            </Modal.Actions>
          </Modal>
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
