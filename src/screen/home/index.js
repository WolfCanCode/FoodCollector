import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Card, Grid, Button, Form } from "semantic-ui-react";
import firebase from "./../../utils/firebase";

const db = firebase.firestore();

const mapStateToProps = state => ({ globalStage: state });

class homePageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nickName: "",
      status: "",
      userList: [],
      loading: false
    };
  }

  componentDidMount = () => {
    this.getUser();
  };

  handleChange = input => {
    this.setState(input);
  };

  getUser() {
    db.collection("users")
      .get()
      .then(collection => {
        console.log(collection);
        let users = collection.docs.map(doc => {
          return { id: doc.id, data: doc.data() };
        });
        console.log(users);
        this.setState({ userList: users });
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
      status: this.state.status,
      manager:{
          name:"hihi",
          nickName:"haha",
          status:"alalaa"
      }
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
            <Grid.Column width={4}>
              <Form>
                <Form.Field>
                  <label>Name</label>
                  <input
                    placeholder="Name"
                    onChange={e => this.handleChange({ name: e.target.value })}
                    value={this.state.name}
                    disabled={this.state.loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Nick Name</label>
                  <input
                    placeholder="Nick Name"
                    onChange={e =>
                      this.handleChange({ nickName: e.target.value })
                    }
                    value={this.state.nickName}
                    disabled={this.state.loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Status</label>
                  <input
                    placeholder="Status"
                    onChange={e =>
                      this.handleChange({ status: e.target.value })
                    }
                    value={this.state.status}
                    disabled={this.state.loading}
                  />
                </Form.Field>
                <Button
                  onClick={e => this.addUser(e)}
                  loading={this.state.loading}
                >
                  Add
                </Button>
              </Form>
            </Grid.Column>
            <Grid.Column width={12}>
              {(this.state.userList.length !== 0 && (
                <Card.Group>
                  {this.state.userList.map((user, index) => (
                    <Card key={index}>
                      <Card.Content>
                        <Card.Header>{user.data.name}</Card.Header>
                        <Card.Meta>{user.data.nickName}</Card.Meta>
                        <Card.Description>{user.data.status}</Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <Button
                          basic
                          color="red"
                          onClick={() => this.deleteUser(user)}
                        >
                          Delete
                        </Button>
                      </Card.Content>
                    </Card>
                  ))}
                </Card.Group>
              )) ||
                "This list is empty"}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(homePageScreen);
