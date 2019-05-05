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
  Button
} from "semantic-ui-react";
import { Link } from "react-router-dom";

const db = firebase.firestore();

const mapStateToProps = state => ({ globalStage: state });
class todayMenuScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    this.getFirstLoad();
  }

  getFirstLoad() {
    // let today = new Date();
    // let startDate = new Date(today.toDateString());
    // let endDate = new Date(
    //   new Date(new Date(new Date().setDate(today.getDate() + 1)).toDateString())
    // );
    // console.log(startDate);
    // console.log(endDate);
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
  }

  render() {
    return (
      <Container>
        <Grid>
          <Link to="/menus">
            <Button icon labelPosition="left" style={{ float: "left" }}>
              <Icon name="arrow left" /> BACK
            </Button>
          </Link>
          {(this.state.transactions &&
            this.state.transactions.length > 0 &&
            this.state.transactions.map(transaction => (
              <Grid.Row centered>
                <Segment>
                  <Card
                    image="https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                    header={transaction.data.menu.name}
                    meta="Quán ăn"
                    description={transaction.data.assignTime}
                  />
                  <Feed size="large" centered>
                    {transaction.data.menu &&
                      transaction.data.menu.foods &&
                      transaction.data.menu.foods.length > 0 &&
                      transaction.data.menu.foods.map(food => (
                        <Feed.Event>
                          <Feed.Label image="https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
                          <Feed.Content>
                            <Feed.Summary>
                              <Feed.User>{food.name}</Feed.User> {food.price} đ
                            </Feed.Summary>
                            <Feed.Meta>
                              <Feed.Like>
                                <Icon name="like" />4 Likes
                              </Feed.Like>
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
