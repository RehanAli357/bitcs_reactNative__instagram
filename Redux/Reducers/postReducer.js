import { produce } from "immer";

const initialState = {
  imageID: null,
  imageUrl: null,
  caption: null,
  userId: null,
  path:null,
};

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case "EditPost":
      return produce(state, (draft) => {
        draft.imageID = action.payload.imageId;
        draft.imageUrl = action.payload.imageUrl;
        draft.caption = action.payload.caption;
        draft.userId = action.payload.userId;
        draft.path = action.payload.path;
      });

    case "removePostData":
      return produce(state, (draft) => {
        draft.imageID = null;
        draft.imageUrl = null;
        draft.caption = null;
        draft.userId = null;
      });

    default:
      return state;
  }
};
