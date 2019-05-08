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
  Modal,
  Input,
  Label,
  Table,
  Header,
  Placeholder
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import _ from "underscore";

const db = firebase.firestore();

const mapStateToProps = state => ({ globalStage: state });
class todayMenuScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      quantity: 0,
      deal: {},
      dealTransactionId: null,
      previewFoods: [],
      showPreview: false
    };
  }

  componentDidMount() {
    let self = this;
    setInterval(function() {
      self.getFirstLoad();
    }, 1000);
  }

  getFirstLoad = () => {
    console.log(new Date().toDateString());
    db.collection("transaction")
      .where("assignDate", "==", new Date().toDateString())
      .get()
      .then(collection => {
        let transactions = collection.docs.map(doc => {
          return { id: doc.id, data: doc.data() };
        });
        this.setState({
          transactions: transactions,
          loading: false
        });
      });
  };

  showQuantity(food, trans) {
    this.setState({ hasPick: true, tempFood: food, tempTrans: trans });
  }

  showDeal(transaction) {
    let trans = JSON.parse(JSON.stringify(transaction.data));
    let foods = _.filter(
      trans.menu.foods,
      food => food.users && food.users.length > 0
    );
    let previewFoods = [];
    for (let i = 0; i < foods.length; i++) {
      let count = 0;
      for (let user of foods[i].users) {
        count += parseInt(user.quantity);
        console.log(user.quantity);
      }
      foods[i].totalQuantity = count;
      previewFoods.push({ name: foods[i].name, totalQuantity: count });
    }

    let deal = trans;
    deal.menu.foods = foods;
    this.setState({
      deal: deal,
      dealTransactionId: transaction.id,
      previewFoods: previewFoods
    });
  }

  doDeal() {
    db.collection("transaction-history")
      .add(this.state.deal)
      .then(() => {
        db.collection("transaction")
          .doc(this.state.dealTransactionId)
          .delete()
          .then(() => {
            this.setState({ deal: {}, dealTransactionId: null });
          });
      });
  }

  doPick = async () => {
    let food = this.state.tempFood;
    let trans = this.state.tempTrans;
    let transactions = this.state.transactions;
    if ((food.users && food.users.length === 0) || !food.users) {
      food.users = [];
    }
    let index = await _.findIndex(
      food.users,
      user => user.name === this.props.globalStage.user.name
    );
    if (index !== -1) {
      if (this.state.quantity <= 0) {
        food.users.splice(index, 1);
      } else {
        food.users[index].quantity = parseInt(this.state.quantity);
      }
    } else {
      if (this.state.quantity <= 0) {
      } else {
        food.users.push({
          name: this.props.globalStage.user.name,
          quantity: parseInt(this.state.quantity)
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
    db.collection("transaction")
      .doc(transactions[indexTransaction].id)
      .set(transactions[indexTransaction].data)
      .then(() => {
        this.setState({
          transactions: transactions,
          hasPick: false,
          quantity: 0
        });
      });
  };

  deleteTransaction(transaction) {
    let confirm = window.confirm("Bạn có muốn xóa đơn này không ?");
    if (confirm) {
      this.setState({ loading: true });
      db.collection("transaction")
        .doc(transaction.id)
        .delete()
        .then(() => {
          this.setState({ loading: false });
        });
    }
  }

  handleChange(value) {
    this.setState({ quantity: value });
  }

  render() {
    return (
      <Container>
        <Modal
          size="mini"
          dimmer={true}
          open={this.state.hasPick}
          onClose={() => this.setState({ hasPick: false })}
        >
          <Modal.Header>Số lượng của sản phẩm ?</Modal.Header>
          <Modal.Content>
            <Label pointing="below">Hãy nhập số lượng</Label>
            <Input
              type="number"
              placeholder="Số lượng ..."
              value={this.state.quantity}
              label={{ content: "Cái" }}
              labelPosition="right"
              onChange={e => this.handleChange(e.target.value)}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button positive content="Duyệt" onClick={() => this.doPick()} />
          </Modal.Actions>
        </Modal>

        <Modal
          size="mini"
          dimmer={true}
          open={Boolean(Object.keys(this.state.deal).length)}
          onClose={() => this.setState({ deal: {} })}
        >
          <Modal.Header>
            Chốt đơn hàng{" "}
            {this.state.deal &&
              this.state.deal.menu &&
              this.state.deal.menu.name}
          </Modal.Header>
          <Modal.Content>
            <Modal
              size="mini"
              dimmer={true}
              open={this.state.showPreview}
              onClose={() => this.setState({ showPreview: false })}
            >
              <Modal.Header>Đơn hàng</Modal.Header>
              <Modal.Content>
                {this.state.previewFoods.map((food, index) => (
                  <p key={index}>
                    {food.name} x {food.totalQuantity}
                  </p>
                ))}
              </Modal.Content>
              <Modal.Actions>
                <Button
                  color="grey"
                  content="Cancel"
                  onClick={() => this.setState({ showPreview: false })}
                />
              </Modal.Actions>
            </Modal>

            <Table basic="very" celled collapsing>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Món</Table.HeaderCell>
                  <Table.HeaderCell>Người đặt</Table.HeaderCell>
                  <Table.HeaderCell>Số lượng</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.deal &&
                  this.state.deal.menu &&
                  this.state.deal.menu.foods &&
                  this.state.deal.menu.foods.map((food, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <Header as="h4" image>
                          <Header.Content>{food.name}</Header.Content>
                        </Header>
                      </Table.Cell>
                      <Table.Cell>
                        <Grid>
                          {food.users &&
                            food.users.map((user, index) => (
                              <Grid.Row centered key={index}>
                                <Header as="h4" image>
                                  <Header.Content>
                                    {user.name} x {user.quantity}
                                  </Header.Content>
                                </Header>
                              </Grid.Row>
                            ))}
                        </Grid>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        = {food.totalQuantity}
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="facebook"
              content="Xuất đơn"
              onClick={() => this.setState({ showPreview: true })}
            />
            <Button positive content="Duyệt" onClick={() => this.doDeal()} />
          </Modal.Actions>
        </Modal>

        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Link to="/">
                <Button icon style={{ float: "left" }}>
                  <Icon name="arrow left" />
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
          {(this.state.transactions &&
            this.state.transactions.length > 0 &&
            this.state.transactions.map((transaction, index) => (
              <Grid.Row centered key={index}>
                <Segment>
                  <Button
                    color="red"
                    attached="top"
                    onClick={() => this.deleteTransaction(transaction)}
                  >
                    Xóa
                  </Button>
                  <Card
                    image={
                      transaction.data.menu.logo ||
                      "https://cdn.dribbble.com/users/1012566/screenshots/4187820/topic-2.jpg"
                    }
                    header={transaction.data.menu.name}
                    meta="Quán ăn"
                    description={transaction.data.assignTime}
                  />
                  <Feed
                    size="large"
                    style={{ overflowY: "scroll", maxHeight: 350 }}
                  >
                    {transaction.data.menu &&
                      transaction.data.menu.foods &&
                      transaction.data.menu.foods.length > 0 &&
                      transaction.data.menu.foods.map((food, index) => (
                        <Feed.Event key={index}>
                          <Feed.Label
                            style={{ margin: "auto" }}
                            image="https://cdn3.iconfinder.com/data/icons/ios-web-user-interface-flat-circle-shadow-vol-6/512/Food_fork_kitchen_knife_meanns_restaurant-512.png"
                          />
                          <Feed.Content>
                            <Feed.Summary>
                              <Feed.User
                                onClick={() =>
                                  this.showQuantity(food, transaction)
                                }
                              >
                                {food.name}
                              </Feed.User>{" "}
                              {food.price} đ
                            </Feed.Summary>

                            <Feed.Meta>
                              <Popup
                                trigger={
                                  <Feed.Like style={{ fontSize: 15 }}>
                                    <Icon name="sticky note" /> Có{" "}
                                    {(food.users && food.users.length) || 0}{" "}
                                    người đặt
                                  </Feed.Like>
                                }
                              >
                                <Popup.Header>
                                  Món đã được ai đặt ?
                                </Popup.Header>
                                <Popup.Content>
                                  <List>
                                    {(food.users &&
                                      food.users.length > 0 &&
                                      food.users.map((user, index) => (
                                        <List.Item key={index}>
                                          <List.Content>
                                            <List.Header as="a">
                                              {user.name}
                                            </List.Header>
                                            <List.Description>
                                              đã đặt <b>{user.quantity}</b> món{" "}
                                              {food.name}
                                            </List.Description>
                                          </List.Content>
                                        </List.Item>
                                      ))) ||
                                      "Không ai đặt món này cả"}
                                  </List>
                                </Popup.Content>
                              </Popup>
                            </Feed.Meta>
                          </Feed.Content>
                        </Feed.Event>
                      ))}
                  </Feed>
                  <Button
                    color="green"
                    attached="bottom"
                    onClick={() => this.showDeal(transaction)}
                  >
                    CHỐT
                  </Button>
                </Segment>
              </Grid.Row>
            ))) ||
            ((this.state.loading && (
              <Grid.Row centered>
                <Segment loading style={{ height: 650, width: 320 }}>
                  <Placeholder>
                    <Placeholder.Image square />

                    <Placeholder.Paragraph>
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Paragraph>
                    <Placeholder.Paragraph>
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Paragraph>
                    <Placeholder.Paragraph>
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Paragraph>
                    <Placeholder.Paragraph>
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Paragraph>
                  </Placeholder>
                </Segment>
              </Grid.Row>
            )) || (
              <Grid.Row centered>
                <Header as="h2" icon="calendar alternate outline" style={{color:'white'}} content="Hôm nay chửa có thực đơn" />{" "}
              </Grid.Row>
            ))}
        </Grid>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(todayMenuScreen);
