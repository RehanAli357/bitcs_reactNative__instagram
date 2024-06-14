export const addUserId = (id) => async (dispatch) => {
  if (id) {
    dispatch({
      type: "Signup",
      payload: { id: id },
    });
  }
};

export const loginUserAction = (data) => async (dispatch) => {
  if (data) {

    dispatch({
      type: "Login",
      payload: data,
    });
  }
};

export const updateImageUrl = (data)=>async (dispatch)=>{
  if (data) {
    dispatch({
      type:"updateDP",
      payload:data
    })
  }
}

export const deleteImageUrl = ()=>async (dispatch)=>{
  dispatch({
    type:"deleteDP"
  })
}

export const updateEmail = (data)=>async(dispatch)=>{
  dispatch({
    type:"updateEmail",
    payload:data
  })
}

export const updatePassword = (data)=>async(dispatch)=>{
  dispatch({
    type:"updatePassword",
    payload:data
  })
}

export const logOut = ()=>async (dispatch)=>{
  dispatch({
    type:"logout"
  })
}