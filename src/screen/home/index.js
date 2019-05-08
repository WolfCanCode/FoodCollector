import React, { Component } from "react";
import { connect } from "react-redux";
import { Container,Button} from "semantic-ui-react";
import firebase from "./../../utils/firebase";
import { Link } from "react-router-dom";

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
      <Container style={{marginTop:50}}>
        <Link to="/menus">
          <Button color="orange">MENUS</Button>
        </Link>
        <Link to="/menu/today">
          <Button color="blue">TODAY</Button>
        </Link>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(homePageScreen);
