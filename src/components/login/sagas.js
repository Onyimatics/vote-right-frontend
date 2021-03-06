/* eslint-disable max-lines-per-function */
// i need to disable this rule for this file
// because my login function needs to be coherent,
// and doing so makes it surpass the max number of lines per function

// import the required modules from npm
import { takeLatest, put } from 'redux-saga/effects';
import { message } from 'antd';

// import personal modules
import {
    AUTHENTICATE_USER, LOGIN_USER, CONFIRM_CODE, IS_USER_LOGGEDIN
} from './actionTypes';
import {
    ERROR_STATUS, SUCCESS_STATUS,
    BASE_URL, SERVER_ERROR_MESSAGE,
    UNKNOWN_ERROR, SUCCESSFULL_NIN,
    WAIT_TIME, USER_ALREADY_LOGGED,
    WRONG_CODE, CROSS_CHECK
} from './constants';
import actions from './actions';
import { app, analytics } from '../configuredFirebase';

/**
 * A function to convert the phone number into a contrycode preceeded format
 * @param {Number} number - the number which we wnt to append  country code to
 * @return {void}
 */
const encodePhoneNumber = number => {
    // convert the password to string for easy slicing and nomenclature
    const stringPassword = String(number);
    const phoneNumber = `+234${stringPassword.slice(1)}`;
    return phoneNumber;
};

/**
 * A function to add a user to a session.
 * @param {Object} user - the user to be added to the session.
 * @return {void}
 */
const addUserToSession = user => {
    const jsonUser = JSON.stringify(user);
    window.sessionStorage.setItem('user', jsonUser);
};

/**
 * Watches for the {@link actionTypes.authenticateUser authenticateUser} action.
 * Validates the passed in NIN and the Number using the API
 * @param {Object} body - the data to send to the endpoint {payload:{phoneNumber,nin}}
 * @return {void}
 */
// function to validate the NIN using API calls
function* validateNIN(action) {
    // make a call to THE verification API
    // passing in the NIN and phoneNumber
    const response = yield fetch(`${BASE_URL}/authenticate`, {
        body: JSON.stringify(action.payload),
        header: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    })
        .then(res => res.json())
        .then(res => res)
        .catch(() => { message.error(SERVER_ERROR_MESSAGE, WAIT_TIME); });

    // stop the loader from spinning
    yield put(actions.loadingReducer(false));

    // check the response for different statuses
    // and then respond accordingly
    if (response.status === ERROR_STATUS) {
        message.error(response.message, WAIT_TIME);
    } else if (response.status === SUCCESS_STATUS) {
        // if succesful then alert the user
        message.success(SUCCESSFULL_NIN, WAIT_TIME);
        // start the loader to spin
        yield put(actions.loadingReducer(true));
        // use firebase to send a key to the phoneNumber
        yield put(actions.loginUser(action.payload.phoneNumber));
    } else {
        // something unknown happened
        message.error(UNKNOWN_ERROR, WAIT_TIME);
    }
}

/**
 * Watches for the {@link actionTypes.LOGIN_USER LOGIN_USER} action.
 * This function sends a key to an input phone number.
 * @param {Object} body - the data to send to the endpoint {payload:{phoneNumber}}
 * @return {void}
 */
function* firebaseUserLogin(data) {
    // receive the phone number from the payload of the parametr
    const phoneNumber = data.payload;
    // console.log(phoneNumber)
    const appVerifier = window.recaptchaVerifier;
    // call a method of firebase to authenticate the entered phone number
    const status = yield app.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(confirmationResult => {
            window.confirmationResult = confirmationResult;
            return SUCCESS_STATUS;
        }).catch(error => {
            message.error(error.message, WAIT_TIME);

            return ERROR_STATUS;
        });
    // const status = SUCCESS_STATUS

    // stop the spinner from loading
    yield put(actions.loadingReducer(false));
    if (status === SUCCESS_STATUS) {
        // open a section where users can input the code
        // they recieved on their phone
        yield put(actions.confirmationCodeSection(true));
    }
}

/**
 * Watches for the {@link actionTypes.CONFIRM_CODE CONFIRM_CODE} action.
 * This function recieves in a key with its payload
 * it then confirms if the parameter it recieves is the same as sent to the phone
 * @param {Object} body - the data to send to the endpoint {payload:{code}}
 * @return {void}
 */
function* confirmUserCode(data) {
    const code = data.payload.confirmationCode;
    // the details of the user to login
    const userDetails = {
        age: data.payload.age,
        gender: data.payload.gender,
        phoneNumber: encodePhoneNumber(data.payload.phoneNumber),
    };
    // confirm if the code entered is correct
    const confirmation = yield window.confirmationResult.confirm(code)
        .then(result => (
            {
                message: SUCCESS_STATUS,
                user: result.user,
            }
        ))
        .catch(() => {
        // User couldn't sign in (bad verification code?)
        // ...
            message.error(WRONG_CODE, WAIT_TIME);
            return ERROR_STATUS;
        });
    yield put(actions.loadingReducer(false));
    // const confirmation = {"message":SUCCESS_STATUS}
    if (confirmation.message === SUCCESS_STATUS) {
        // if the authentication goes thru
        // then change the state variable indicating this user is authenticated
        yield put(actions.authenticateUserStatus(true));
        yield put(actions.confirmationCodeSection(false));
        // add user to session
        addUserToSession(userDetails);
        // send an alert
        message.success(USER_ALREADY_LOGGED, WAIT_TIME);
        // add the user to state
        yield put(actions.pushUserPhoneNumber(userDetails));

        // log the event
        analytics.logEvent('user_logged_in');
        analytics.setUserProperties({ gender: data.payload.gender });
    } else {
        // if user entered the wrong number
        // go back to login page
        message.error(CROSS_CHECK, WAIT_TIME);
    }
}

/**
 * Watches for the {@link actionTypes.IS_USER_LOGGEDIN IS_USER_LOGGEDIN} action.
 * This function recieves in a key with its payload
 * it called when a page refreshes to confirm if a user is logged in
 * @return {void}
 */
function* isUserLoggedIn() {
    const loggedinUser = yield JSON.parse(window.sessionStorage.getItem('user'));
    // if it resolves an object and the object contains a phoneNumber
    if (loggedinUser && loggedinUser.phoneNumber) {
        // dispatch a function to change the state variable to user authenticated
        yield put(actions.authenticateUserStatus(true));
        // add the user to state
        yield put(actions.pushUserPhoneNumber(loggedinUser));
    }
}

// map the sagas to their respective actionTypes
function* validateUserSaga() {
    yield takeLatest(AUTHENTICATE_USER, validateNIN);
    yield takeLatest(LOGIN_USER, firebaseUserLogin);
    yield takeLatest(CONFIRM_CODE, confirmUserCode);
    yield takeLatest(IS_USER_LOGGEDIN, isUserLoggedIn);
}

// export this function
export default validateUserSaga;
