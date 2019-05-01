import { reactLocalStorage } from "reactjs-localstorage";

export default function users(state={
    name :"",
    nickName: "",
    status: ""
}, action) {
  switch (action.type) {
    case "SET_USER":
      state = action.user;
      reactLocalStorage.set("name", state.name);
      reactLocalStorage.set("nickName", state.nickName);
      reactLocalStorage.set("status", state.status);
      state.user = action.user;
      return state;
    default:
      return state;
  }
}
