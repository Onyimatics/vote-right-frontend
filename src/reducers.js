import { combineReducers } from 'redux';
import { reducers as userReducer } from './components/login';
import { reducers as adminReducer } from './components/adminLoginPage';

// combine all the reducers in the project into one reducer
const allReducers = combineReducers({
    adminAuthenticated: adminReducer.authenticateAdminReducer,
    adminLoading: adminReducer.loginAdminReducer,
    confirmationCode: userReducer.confirmReducer,
    userAuthenticated: userReducer.authenticateUserReducer,
    userLoading: userReducer.loginLoandingReducer,
});

// export this reducer
export default allReducers;
