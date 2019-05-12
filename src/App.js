import React, { Component } from "react";
import "./App.css";
import { createBrowserHistory } from "history";
import { Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import {
  Button,
  Container,
  Grid,
  Modal,
  Input,
  Responsive,
  Image,
  Sidebar,
  Menu,
  Segment,
  Visibility
} from "semantic-ui-react";
import { reactLocalStorage } from "reactjs-localstorage";
import { Link } from "react-router-dom";
// import homePageScreen from "./screen/home";
import menuScreen from "./screen/menu/index";
import menuDetailScreen from "./screen/menu/details";
import todayTransactionScreen from "./screen/transaction/today";
import pastTransactionScreen from "./screen/transaction/past";
import _ from "underscore";
import firebase from "./utils/firebase";
import { setUser } from "./actions/user";
const db = firebase.firestore();

const mapStateToProps = state => ({ globalStage: state });
const hist = createBrowserHistory();

const getWidth = () => {
  const isSSR = typeof window === "undefined";

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });
  render() {
    const { sidebarOpened } = this.state;
    const { children } = this.props;
    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation="push"
          onHide={this.handleSidebarHide}
          vertical
          inverted
          style={{ paddingTop: 1 }}
          visible={sidebarOpened}
        >
          <Menu.Item>
            <Image size="small" src={require("./assets/with-text-white.png")} />
          </Menu.Item>
          <Menu.Item as={Link} to="/menus">
            Thực đơn
          </Menu.Item>
          <Menu.Item as={Link} to="/">
            Hôm nay
          </Menu.Item>
          <Menu.Item as={Link} to="/menu/past">
            Lịch sử
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened} style={{ height: "100vh" }}>
          <Segment
            textAlign="center"
            style={{
              minHeight: 350,
              padding: "1em 0em",
              overflowY: "scroll",
              maxHeight: "95vh",
              paddingTop: 1
            }}
            vertical
          >
            <Container style={{ marginBottom: 15 }}>
              <Menu
                pointing
                secondary
                size="large"
                style={{
                  boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
                  position: "fixed",
                  width: "92vw",
                  background: "#F5F5F5",
                  zIndex: 99
                }}
              >
                {/* <Menu.Item onClick={this.handleToggle}>
                  <Icon name="sidebar" inverted />
                </Menu.Item> */}
                <Menu.Item onClick={this.handleToggle}>
                  <Image size="small" src={require("./assets/with-text.png")} />
                </Menu.Item>
              </Menu>
              {/* <Menu pointing secondary size="large">
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name="sidebar" />
                </Menu.Item>
                <Menu.Item position="right">
                  <Button as="a">Log in</Button>
                  <Button as="a" style={{ marginLeft: "0.5em" }}>
                    Sign Up
                  </Button>
                </Menu.Item>
              </Menu> */}
            </Container>
            {children}
          </Segment>
        </Sidebar.Pusher>
      </Responsive>
    );
  }
}

class DesktopContainer extends Component {
  state = { active: "today" };

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  componentDidMount() {
    let active = "today";
    console.log(this.props.history);
    if (_.contains(this.props.history.location.pathname.split("/"), "today")) {
    }
    if (_.contains(this.props.history.location.pathname.split("/"), "past")) {
      active = "past";
    }
    if (
      _.contains(this.props.history.location.pathname.split("/"), "menu") ||
      _.contains(this.props.history.location.pathname.split("/"), "menus")
    ) {
      active = "menus";
    }
    this.setState({ active: active });
  }

  render() {
    const { fixed } = this.state;
    const { children } = this.props;
    const style = {
      menu: {
        lineHeight: "60px",
        fontWeight: "bold",
        fontFamily: "inherit",
        fontSize: "20px"
      }
    };
    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment textAlign="center" vertical style={{ paddingTop: "1px" }}>
            <Menu
              fixed={fixed ? "top" : null}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
              style={{
                boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
                position: "fixed",
                width: "100%",
                background: "#F5F5F5",
                zIndex: 99
              }}
            >
              <Container>
                <Menu.Item as={Link} to={"/"} style={style.menu}>
                  <Image size="small" src={require("./assets/with-text.png")} />
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/menus"
                  style={style.menu}
                  onClick={() => this.setState({ active: "menus" })}
                  active={this.state.active === "menus"}
                >
                  Thực đơn
                </Menu.Item>

                <Menu.Item
                  as={Link}
                  to="/menu/past"
                  style={style.menu}
                  onClick={() => this.setState({ active: "past" })}
                  active={this.state.active === "past"}
                >
                  Lịch sử
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/"
                  style={style.menu}
                  onClick={() => this.setState({ active: "today" })}
                  active={this.state.active === "today"}
                >
                  Hôm nay
                </Menu.Item>
              </Container>
            </Menu>
            {children}
          </Segment>
        </Visibility>
      </Responsive>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      user: "",
      hasReg:
        !this.props.globalStage.user ||
        !reactLocalStorage.get("name_o2" || true)
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
    const body = (
      <Container style={{ marginTop: 140 }}>
        <Modal size="mini" dimmer={true} open={this.state.hasReg}>
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
            <Switch>
              <Route path={"/menus"} component={menuScreen} />
              <Route path={"/menu/add"} component={menuDetailScreen} />
              <Route path={"/menu/past"} component={pastTransactionScreen} />
              <Route path={"/menu/:id"} component={menuDetailScreen} />
              <Route path={"/"} component={todayTransactionScreen} />
              {/* <Route path={"/"} component={homePageScreen} /> */}
            </Switch>
          </Grid.Row>
        </Grid>
      </Container>
    );

    return (
      <Router history={hist}>
        <DesktopContainer history={hist} children={body} />
        <MobileContainer history={hist} children={body} />
      </Router>
    );
  }
}

export default connect(mapStateToProps)(App);
