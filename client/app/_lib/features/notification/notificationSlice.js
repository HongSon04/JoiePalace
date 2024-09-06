const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    getNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
});

function getNotifications() {
  return async (dispatch) => {
    // const response = await fetch("/api/notifications");
    // const data = await response.json();
    // dispatch(notificationSlice.actions.getNotifications(data));
  };
}

// export const { getNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
