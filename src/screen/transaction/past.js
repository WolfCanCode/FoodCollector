import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Grid, Header } from "semantic-ui-react";
import firebase from "../../utils/firebase";

const db = firebase.firestore();

const mapStateToProps = state => ({ globalStage: state });

class pastTransactionScreen extends Component {
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
      <Container >
        <Grid>
          <Grid.Row centered>
            <Header as="h2" color="grey">This feature is in construction</Header>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(pastTransactionScreen);
