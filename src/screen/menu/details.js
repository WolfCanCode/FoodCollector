import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Grid,
  Button,
  Form,
  List,
  Label,
  Icon
} from "semantic-ui-react";
import firebase from "./../../utils/firebase";
import { Link } from "react-router-dom";
const db = firebase.firestore();

const mapStateToProps = state => ({ globalStage: state });

class menuDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      foods: [],
      loading: false,
      foodName: "",
      foodPrice: 0
    };
  }

  handleChange = input => {
    this.setState(input);
  };

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getMenu();
    }
  }

  getMenu() {
    db.collection("menus")
      .doc(this.props.match.params.id)
      .get()
      .then(doc => {
        let menu = doc.data();
        this.setState({
          name: menu.name,
          address: menu.address,
          foods: menu.foods
        });
        console.log(menu);
      });
  }

  //   deleteUser(user) {
  //     db.collection("users")
  //       .doc(user.id)
  //       .delete()
  //       .then(() => {
  //         console.log("Xóa thành công user ", user.data.name);
  //         this.getUser();
  //       });
  //   }

  addMenu = e => {
    this.setState({ loading: true });
    let menu = {
      name: this.state.name,
      address: this.state.address,
      foods: this.state.foods
    };
    if (this.props.match.params.id) {
      db.collection("menus")
        .doc(this.props.match.params.id)
        .set(menu)
        .then(() => {
          console.log(menu.name, " has been set.");
          this.props.history.push("/menus");
          this.setState({ loading: false });
        });
    } else {
      db.collection("menus")
        .add(menu)
        .then(() => {
          console.log(menu.name, " has been added.");
          this.props.history.push("/menus");
          this.setState({ loading: false });
        });
      this.setState({
        name: "",
        address: "",
        foods: []
      });
    }
    e.preventDefault();
  };

  deleteFood = food => {
    {
      console.log("food: ", food);
      let foods = this.state.foods;
      let pos = foods.indexOf(food);
      console.log(pos);
      foods.splice(pos, 1);
      this.setState({
        foods: foods
      });
    }
  };

  render() {
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Link to="/menus">
              <Button icon labelPosition="left" style={{ float: "left" }}>
                <Icon name="arrow left" /> BACK
              </Button>
            </Link>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column centered>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Form>
                      <Form.Field>
                        <label>Menu name</label>
                        <input
                          placeholder="Menu Name"
                          onChange={e =>
                            this.handleChange({ name: e.target.value })
                          }
                          value={this.state.name}
                          disabled={this.state.loading}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Address</label>
                        <input
                          placeholder="Address"
                          onChange={e =>
                            this.handleChange({ address: e.target.value })
                          }
                          value={this.state.address}
                          disabled={this.state.loading}
                        />
                      </Form.Field>

                      <Button
                        onClick={e => this.addMenu(e)}
                        loading={this.state.loading}
                      >
                        Add
                      </Button>
                    </Form>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Grid>
                      <Grid.Row centered>
                        <Form>
                          <Form.Group widths="equal">
                            <Form.Field>
                              <label>Food name</label>
                              <input
                                placeholder="Food Name"
                                onChange={e =>
                                  this.handleChange({
                                    foodName: e.target.value
                                  })
                                }
                                value={this.state.foodName}
                                disabled={this.state.loading}
                              />
                            </Form.Field>
                            <Form.Field>
                              <label>Food price</label>
                              <input
                                placeholder="Food price"
                                onChange={e =>
                                  this.handleChange({
                                    foodPrice: e.target.value
                                  })
                                }
                                type="number"
                                value={this.state.foodPrice}
                                disabled={this.state.loading}
                              />
                            </Form.Field>
                            <Button
                              onClick={() => {
                                let foods = this.state.foods;
                                foods.push({
                                  name: this.state.foodName,
                                  price: this.state.foodPrice
                                });
                                console.log(foods);
                                this.setState({
                                  foods: foods,
                                  foodName: "",
                                  foodPrice: 0
                                });
                              }}
                            >
                              Add
                            </Button>
                          </Form.Group>
                        </Form>
                      </Grid.Row>
                      <Grid.Row
                        centered
                        style={{ overflowY: "scroll", maxHeight: 500 }}
                      >
                        <List divided celled selection verticalAlign="middle">
                          {(this.state.foods &&
                            this.state.foods.length > 0 &&
                            this.state.foods.map((food, index) => (
                              <List.Item key={index}>
                                <List.Content
                                  floated="right"
                                  style={{ lineHeight: 5 }}
                                >
                                  <Button
                                    color="red"
                                    onClick={() => this.deleteFood(food)}
                                  >
                                    Delete
                                  </Button>
                                </List.Content>
                                <List.Icon
                                  name="food"
                                  size="large"
                                  verticalAlign="middle"
                                  color="orange"
                                />
                                <List.Content>
                                  <List.Header as="a" style={{ padding: 5 }}>
                                    {food.name}
                                  </List.Header>
                                  <List.Description as="a">
                                    <Label color="orange" tag>
                                      {food.price} đ
                                    </Label>
                                  </List.Description>
                                </List.Content>
                              </List.Item>
                            ))) ||
                            "There are no food in this menu"}
                        </List>
                      </Grid.Row>
                    </Grid>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(menuDetailScreen);
