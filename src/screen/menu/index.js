import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Grid, Button } from "semantic-ui-react";
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

  deleteUser(user) {
    db.collection("users")
      .doc(user.id)
      .delete()
      .then(() => {
        console.log("Xóa thành công user ", user.data.name);
        this.getUser();
      });
  }

  addUser = e => {
    this.setState({ loading: true });
    let user = {
      name: this.state.name,
      nickName: this.state.nickName,
      status: this.state.status
    };
    db.collection("users")
      .add(user)
      .then(() => {
        console.log(user.name, " has been added.");
        this.getUser();
        this.setState({ loading: false });
      });
    this.setState({
      name: "",
      nickName: "",
      status: ""
    });
    e.preventDefault();
  };

  render() {
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Link to="/">Back</Link>
            </Grid.Column>
            <Grid.Column width={8} textAlign="right">
              <Link to="/menu/add">Add</Link>
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
              this.state.menuList.map((menu, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{menu.data.name}</Table.Cell>
                  <Table.Cell>{menu.data.address}</Table.Cell>
                  <Table.Cell textAlign="right">
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
