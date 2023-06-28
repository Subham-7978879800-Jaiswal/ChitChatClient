import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Define your initial state here
  user: {},
  otherUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setOtherUsers(state, action) {
      state.otherUsers = action.payload;
    },
  },
});

const { setUser, setOtherUsers } = userSlice.actions;
const userReducer = userSlice.reducer;

export { userReducer, setUser, setOtherUsers };
