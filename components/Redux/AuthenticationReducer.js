import { combineReducers } from 'redux';

const initialState = {
    authenticationResponse: null,
  };
  
  const AuthenticationReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_AUTHENTICATION_RESPONSE': {
        const { data } = action.payload;
        return {
          ...state,
          authenticationResponse: {
            ...state.authenticationResponse,
            data, // Store only the required data from the response
          },
        };
      }
      // other cases
      default:
        return state;
    }
  };
  
  export default AuthenticationReducer;