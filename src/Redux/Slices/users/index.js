import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Define your initial state here
  user: {},
  otherUsers: [],
  chats: [],
  selectedChat:{}
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
    setAllChats(state, action) {
      state.chats = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
  },
});

const { setUser, setOtherUsers, setAllChats, setSelectedChat } =
  userSlice.actions;
const userReducer = userSlice.reducer;

export { userReducer, setUser, setOtherUsers, setAllChats, setSelectedChat };
