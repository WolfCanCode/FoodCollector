import { reactLocalStorage } from "reactjs-localstorage";

export default function user(state={
    name :"",
    nickName: "",
    status: ""
}, action) {
  switch (action.type) {
    case "SET_USER":
      state = action.user;
      reactLocalStorage.set("name_o2", state.name);
      return state;
    default:
      return state;
  }
}
