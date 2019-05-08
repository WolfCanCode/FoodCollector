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
      <Container style={{width:'100vw'}}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Link to="/">
                <Button icon style={{ float: "left" }}>
                  <Icon name="arrow left" />
                </Button>
              </Link>
            </Grid.Column>
            <Grid.Column width={8} textAlign="right">
              <Link to="/menu/add">
                <Button color="green" icon>
                  <Icon name="plus" />
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Table
              unstackable
              selectable
              key={"black"}
              inverted
              color={"black"}
              style={{width:'100vw'}}
            >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan={6} textAlign="center">
                    Danh sách MENU
                  </Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  <Table.HeaderCell>Tên</Table.HeaderCell>
                  <Table.HeaderCell>Địa chỉ</Table.HeaderCell>
                  <Table.HeaderCell colSpan={3} textAlign="right">
                    Hành động
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {(this.state.menuList &&
                  this.state.menuList.length > 0 &&
                  this.state.menuList.map((menu, index) => (
                    <Table.Row key={index}>
                      <Table.Cell width={6}>{menu.data.name}</Table.Cell>
                      <Table.Cell width={12}>{menu.data.address}</Table.Cell>
                      <Table.Cell textAlign="right" width={1}>
                        <Button
                          color="yellow"
                          onClick={() => this.assignMenu(menu)}
                          loading={this.state.loading}
                          icon
                        >
                          <Icon name="arrow up" />
                        </Button>
                      </Table.Cell>
                      <Table.Cell textAlign="right" width={1}>
                        <Link to={`/menu/${menu.id}`}>
                          <Button color="green" icon>
                            <Icon name="edit" />
                          </Button>
                        </Link>
                      </Table.Cell>
                      <Table.Cell textAlign="right" width={1}>
                        <Button color="red" icon>
                          <Icon name="delete" />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))) || (
                  <Table.Row>
                    <Table.Cell colSpan={3}>Danh sách rỗng</Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(menuScreen);
