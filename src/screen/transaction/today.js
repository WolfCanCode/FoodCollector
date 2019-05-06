import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "./../../utils/firebase";
import {
  Container,
  Grid,
  Card,
  Feed,
  Icon,
  Segment,
  Button,
  Popup,
  List,
  Image,
  Modal,
  Input
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import pluralize from "pluralize";
import _ from "underscore";

const db = firebase.firestore();

const mapStateToProps = state => ({ globalStage: state });
class todayMenuScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      quantity: 0
    };
  }

  componentDidMount() {
    this.getFirstLoad();
  }

  getFirstLoad = () => {
    // let today = new Date();
    // let startDate = new Date(today.toDateString());
    // let endDate = new Date(
    //   new Date(new Date(new Date().setDate(today.getDate() + 1)).toDateString())
    // );
    // console.log(startDate);
    // console.log(endDate);
    console.log(new Date().toDateString());
    db.collection("transaction")
      .where("assignDate", "==", new Date().toDateString())
      .get()
      .then(collection => {
        let transactions = collection.docs.map(doc => {
          return { id: doc.id, data: doc.data() };
        });
        console.log(transactions);
        this.setState({
          transactions: transactions
        });
      });
  };

  showQuantity(food, trans) {
    this.setState({ hasPick: true, tempFood: food, tempTrans: trans });
  }

  doPick = async () => {
    let food = this.state.tempFood;
    let trans = this.state.tempTrans;
    let transactions = this.state.transactions;
    console.log("vaof rooi ");
    if ((food.users && food.users.length === 0) || !food.users) {
      food.users = [];
    }
    let index = await _.findIndex(
      food.users,
      user => user.name === this.props.globalStage.user.name
    );
    if (index !== -1) {
      console.log(this.state.quantity);
      if (this.state.quantity <= 0) {
        food.users.splice(index, 1);
      } else {
        food.users[index].quantity = this.state.quantity;
      }
    } else {
      if (this.state.quantity <= 0) {
      } else {
        food.users.push({
          name: this.props.globalStage.user.name,
          quantity: this.state.quantity
        });
      }
    }
    let indexTransaction = await _.findIndex(
      transactions,
      transaction => transaction.id === trans.id
    );
    let indexFood = await _.findIndex(
      transactions[indexTransaction].data.menu.foods,
      item => item.name === food.name
    );
    transactions[indexTransaction].data.menu.foods[indexFood] = food;
    console.log(transactions[indexTransaction]);
    db.collection("transaction")
      .doc(transactions[indexTransaction].id)
      .set(transactions[indexTransaction].data)
      .then(() => {
        this.setState({ transactions: transactions, hasPick: false });
      });
  };

  handleChange(value) {
    this.setState({ quantity: value });
  }

  render() {
    return (
      <Container>
        <Modal
          size="mini"
          dimmer={this.state.hasPick}
          open={this.state.hasPick}
        >
          <Modal.Header>Number of this stuff ?</Modal.Header>
          <Modal.Content>
            <Input
              type="number"
              placeholder="Quantity ..."
              value={this.state.quantity}
              onChange={e => this.handleChange(e.target.value)}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button positive content="Deal" onClick={() => this.doPick()} />
          </Modal.Actions>
        </Modal>
        <Grid>
          <Link to="/">
            <Button icon labelPosition="left" style={{ float: "left" }}>
              <Icon name="arrow left" /> BACK
            </Button>
          </Link>
          {(this.state.transactions &&
            this.state.transactions.length > 0 &&
            this.state.transactions.map((transaction, index) => (
              <Grid.Row centered key={index}>
                <Segment>
                  <Card
                    image="https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                    header={transaction.data.menu.name}
                    meta="Quán ăn"
                    description={transaction.data.assignTime}
                  />
                  <Feed size="large">
                    {transaction.data.menu &&
                      transaction.data.menu.foods &&
                      transaction.data.menu.foods.length > 0 &&
                      transaction.data.menu.foods.map((food, index) => (
                        <Feed.Event key={index}>
                          <Feed.Label image="https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
                          <Feed.Content>
                            <Feed.Summary>
                              <Feed.User>{food.name}</Feed.User> {food.price} đ
                            </Feed.Summary>

                            <Feed.Meta>
                              <Popup
                                trigger={
                                  <Feed.Like
                                    style={{ fontSize: 15 }}
                                    onClick={() =>
                                      this.showQuantity(food, transaction)
                                    }
                                  >
                                    <Icon name="like" />
                                    {(food.users && food.users.length) ||
                                      0}{" "}
                                    {pluralize(
                                      "Pick",
                                      (food.users && food.users.length) || 1
                                    )}
                                  </Feed.Like>
                                }
                              >
                                <Popup.Header>People who pick</Popup.Header>
                                <Popup.Content>
                                  <List>
                                    {(food.users &&
                                      food.users.length > 0 &&
                                      food.users.map((user, index) => (
                                        <List.Item key={index}>
                                          <Image
                                            avatar
                                            src="https://img.icons8.com/bubbles/2x/administrator-male.png"
                                          />
                                          <List.Content>
                                            <List.Header as="a">
                                              {user.name}
                                            </List.Header>
                                            <List.Description>
                                              has picked <b>{user.quantity}</b>{" "}
                                              {food.name}
                                            </List.Description>
                                          </List.Content>
                                        </List.Item>
                                      ))) ||
                                      "No one pick this one"}
                                  </List>
                                </Popup.Content>
                              </Popup>
                            </Feed.Meta>
                          </Feed.Content>
                        </Feed.Event>
                      ))}
                  </Feed>
                </Segment>
              </Grid.Row>
            ))) || (
            <Grid.Row centered>
              <h3>Today list is empty today !!! ^^</h3>
            </Grid.Row>
          )}
        </Grid>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(todayMenuScreen);
