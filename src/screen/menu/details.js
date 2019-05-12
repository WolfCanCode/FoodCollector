import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Grid,
  Button,
  Form,
  List,
  Label,
  Icon,
  Segment,
  Image
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
    this.setState({ loading: true });
    db.collection("menus")
      .doc(this.props.match.params.id)
      .get()
      .then(doc => {
        let menu = doc.data();
        console.log("menu",doc);
        this.setState({
          name: menu.name,
          address: menu.address,
          foods: menu.foods,
          logo: menu.logo
        });
        this.setState({ loading: false });
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
      foods: this.state.foods,
      logo: this.state.logo
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

  addDefaultSrc(e){
    e.target.src = 'https://cdn.dribbble.com/users/1012566/screenshots/4187820/topic-2.jpg';
  }

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
        <Segment style={{overflowY:'scroll', maxHeight:'85vh', background:'rgba(0,0,0,0.3)'}}>
        <Grid> 
          <Grid.Row style={{ minWidth: "100vw" }}>
            <Grid.Column width={8}>
              <Link to="/menus">
                <Button icon style={{ float: "left" }}>
                  <Icon name="arrow left" />
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>

            <Grid.Column>
              <Grid doubling columns={2}>
                <Grid.Row textAlign="left">
                  <Grid.Column width={8}>
                    <Segment
                      raised
                      inverted
                      color="orange"
                      loading={this.state.loading}
                    >
                      <Form inverted>
                        <Form.Field>
                          <label>Tên Menu</label>
                          <input
                            placeholder="Tên menu..."
                            onChange={e =>
                              this.handleChange({ name: e.target.value })
                            }
                            value={this.state.name}
                            disabled={this.state.loading}
                          />
                        </Form.Field>
                        <Form.Field>
                          <label>Địa chỉ</label>
                          <input
                            placeholder="Địa chỉ..."
                            onChange={e =>
                              this.handleChange({ address: e.target.value })
                            }
                            value={this.state.address}
                            disabled={this.state.loading}
                          />
                        </Form.Field>
                        <Form.Field>
                          <label>Logo</label>
                          <input
                            placeholder="Link hình ảnh..."
                            onChange={e =>
                              this.handleChange({ logo: e.target.value })
                            }
                            value={this.state.logo}
                            disabled={this.state.loading}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Image
                            size="small"
                            src={
                              this.state.logo ||
                              "https://cdn.dribbble.com/users/1012566/screenshots/4187820/topic-2.jpg"
                            }
                            onError={this.addDefaultSrc}
                          />
                        </Form.Field>
                        <Button
                          onClick={e => this.addMenu(e)}
                          loading={this.state.loading}
                          color="yellow"
                        >
                          Thêm
                        </Button>
                      </Form>
                    </Segment>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Segment
                      raised
                      inverted
                      color="orange"
                      loading={this.state.loading}
                    >
                      <Form inverted>
                        <Form.Group widths="equal">
                          <Form.Field>
                            <label>Tên món ăn</label>
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
                            <label>Giá</label>
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
                          <Form.Field>
                            <label>_</label>
                            <Button
                              onClick={() => {
                                let foods = this.state.foods;
                                if (
                                  this.state.foodName &&
                                  this.state.foodPrice !== 0
                                ) {
                                  foods.push({
                                    name: this.state.foodName,
                                    price: parseInt(this.state.foodPrice)
                                  });
                                  console.log(foods);
                                  this.setState({
                                    foods: foods,
                                    foodName: "",
                                    foodPrice: 0
                                  });
                                } else {
                                  alert(
                                    "Không được để trống và giá để 0 nha !"
                                  );
                                }
                              }}
                              color="yellow"
                            >
                              Thêm món
                            </Button>
                          </Form.Field>
                        </Form.Group>
                      </Form>
                      <Grid>
                        <Grid.Row centered>Danh sách món ăn</Grid.Row>
                        <Grid.Row
                          centered
                          style={{ overflowY: "scroll", maxHeight: 500 }}
                        >
                          <Segment raised>
                            <List
                              divided
                              selection
                              relaxed="very"
                              verticalAlign="middle"
                            >
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
                                        icon
                                        onClick={() => this.deleteFood(food)}
                                      >
                                        <Icon name="delete" />
                                      </Button>
                                    </List.Content>
                                    <List.Icon
                                      name="food"
                                      size="large"
                                      verticalAlign="middle"
                                      color="orange"
                                    />
                                    <List.Content>
                                      <List.Header
                                        as="a"
                                        style={{ padding: 5 }}
                                      >
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
                          </Segment>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </Segment>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(menuDetailScreen);
