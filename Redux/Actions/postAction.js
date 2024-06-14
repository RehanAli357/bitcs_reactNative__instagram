export const editPost = (data) =>async = (dispatch) => { 
    dispatch({
      type: "EditPost",
      payload: data,
    });
  };


export const removePostData = ()=>async  (dispatch)=>{
  dispatch({
    type:"removePostData",
  })
}