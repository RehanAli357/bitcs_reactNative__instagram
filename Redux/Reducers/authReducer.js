import { produce } from "immer";

let initialState = {
  id: null,
  password: null,
  email: null,
  userImage: null,
  follower:0,
  following:0
};
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "Signup":
      return produce(state, (draft) => {
        draft.id = action.payload.id;
      });

    case "Login":
      return produce(state, (draft) => {
        draft.id = action.payload.uId;
        draft.email = action.payload.email;
        draft.password = action.payload.password;
        draft.userImage = action.payload.userImage;
        draft.follower=action.payload.follower;
        draft.following=action.payload.following;
      });

    case "updateDP":
      return produce(state, (draft) => {
        draft.userImage = action.payload;
      });

    case "deleteDP":
      return produce(state, (draft) => {
        draft.userImage = null;
      });

    case "updateEmail":
      return produce(state, (draft) => {
        draft.email = action.payload;
      });

    case "updatePassword":
      return produce(state, (draft) => {
        draft.password = action.payload;
      });

    case "logout":
      return produce(state, (draft) => {
        draft.email = null;
        draft.id = null;
        draft.password = null;
        draft.userImage = null;
      });

    default:
      return state;
  }
};
