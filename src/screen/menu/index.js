import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Grid, Button, Icon } from "semantic-ui-react";
import firebase from "./../../utils/firebase";
import { Link } from "react-router-dom";
import { Table } from "semantic-ui-react";
const db = firebase.firestore();

const mapStateToProps = state => ({ globalStage: state });

class menuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nickName: "",
      status: "",
      menuList: [],
      loading: false
    };
  }

  componentDidMount = () => {
    this.getMenu();
  };

  handleChange = input => {
    this.setState(input);
  };

  getMenu() {
    db.collection("menus")
      .get()
      .then(collection => {
        console.log(collection);
        let menus = collection.docs.map(doc => {
          return { id: doc.id, data: doc.data() };
        });
        console.log(menus);
        this.setState({ menuList: menus });
      });
  }

  assignMenu(menu) {
    this.setState({ loading: true });
    let transaction = {};
    transaction.assignTime = new Date().toTimeString();
    transaction.assignDate = new Date().toDateString();
    transaction.createdDate = new Date();
    transaction.menu = menu.data;
    delete menu.id;
    db.collection("transaction")
      .add(transaction)
      .then(() => {
        this.setState({ loading: false });
        this.props.history.push("/menu/today");
      });
  }

  render() {
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Link to="/">
                <Button icon labelPosition="left" style={{ float: "left" }}>
                  <Icon name="arrow left" /> BACK
                </Button>
              </Link>
            </Grid.Column>
            <Grid.Column width={8} textAlign="right">
              <Link to="/menu/today">
                <Button color="blue">TODAY</Button>
              </Link>
              <Link to="/menu/add">
                <Button color="green" icon labelPosition="right">
                  <Icon name="plus" /> ADD
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={4} />
              <Table.HeaderCell width={4} textAlign="center">
                MENU FOOD
              </Table.HeaderCell>
              <Table.HeaderCell width={4} />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {(this.state.menuList &&
              this.state.menuList.length > 0 &&
              this.state.menuList.map((menu, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{menu.data.name}</Table.Cell>
                  <Table.Cell>{menu.data.address}</Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button
                      color="yellow"
                      onClick={() => this.assignMenu(menu)}
                      loading={this.state.loading}
                    >
                      Assign
                    </Button>
                    <Link to={`/menu/${menu.id}`}>
                      <Button color="green">Edit</Button>
                    </Link>
                    <Button color="red">Delete</Button>
                  </Table.Cell>
                </Table.Row>
              ))) || (
              <Table.Row>
                <Table.Cell width={4}>This list is empty</Table.Cell>
                <Table.HeaderCell width={4} />
                <Table.HeaderCell width={4} />
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(menuScreen);
