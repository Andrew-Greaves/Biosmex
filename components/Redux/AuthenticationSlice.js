import { createSlice } from '@reduxjs/toolkit';

const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    authenticationResponse: null,
  },
  reducers: {
    setAuthenticationResponse: (state, action) => {
      state.authenticationResponse = action.payload;
    },
  },
});

export const { setAuthenticationResponse } = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer;