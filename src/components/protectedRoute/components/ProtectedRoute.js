import React,{ useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ADMIN } from "./constants";
import { actions } from "../../adminLoginPage"
 
/**
 * A wrapper for routers, which is used to limit which route users who have not signed in can use
 *
 * @function
 * @param {Component} component - the jsx component for default page layout
 * @param {func} authenticated - A boolean value indicating if the current user is loggedIn or not
 */
export default function PrivateRoute({
    component: Component,
    authenticated,
}) { 
    // import the authentication status of both admin and user
    const dispatch = useDispatch()
    const isAdminAuthenticated = useSelector(state=>state.adminAuthenticated)
    const isUserAuthenticated = useSelector(state=>state.userAuthenticated)
    
    // define the authenticated status depending on what was passed into the route
    let userAuthenticated = (authenticated === ADMIN)?isAdminAuthenticated:isUserAuthenticated;
    
    // upon mount of this app, check if the user is authenticated in the state
    // otherwise check firebase if the user is authenticated via cookies
    useEffect(()=>{
        if(!userAuthenticated){
            dispatch(actions.isAdminAuthenticated())
        }
    },[dispatch,userAuthenticated])

    return (
        // if the user is logged in, let them proceed, otherwise redirect to login page
        <Route
            render={() => (userAuthenticated === true ? (
                <Component />
            ) : (
                <Redirect to="/login" />
            ))}
        />
    );
}

// define the proptypes and their default values

PrivateRoute.propTypes = {
    authenticated: PropTypes.string,
    component: PropTypes.func,
};

PrivateRoute.defaultProps = {
    authenticated: false,
    component: 0,
};
