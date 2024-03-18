import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container, Snackbar, SnackbarContent } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { jwtDecode } from 'jwt-decode';

import Icon from './icon';
import { signin, signup } from '../../actions/auth';
import { AUTH, AUTH_ERROR } from '../../constants/actionTypes';
import useStyles from './styles';
import Input from './input';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const SignUp = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const authError = useSelector((state) => state.auth.error);

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const switchMode = () => {
    setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      dispatch(signup(form, navigate)).catch(() => {
        dispatch({ type: AUTH_ERROR });
      });
    } else {
      dispatch(signin(form, navigate)).catch(() => {
        dispatch({ type: AUTH_ERROR });
      });
    }
  };

  const googleSuccess =  async (res) =>  {
    console.log(res)
    console.log('here is jwt')
    const decodedToken = jwtDecode(res?.credential);
    console.log(decodedToken.name);

    const result = res;
    const token = res?.credential;

    try {
        dispatch({type: 'AUTH', data: {result, token}});
        navigate('/');
        
    } catch (error) {
        console.log(error);
    }
  };

  const googleError = () => console.log('Google Sign In was unsuccessful. Try again later');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={6}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{ isSignup ? 'Sign up' : 'Sign in' }</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            { isSignup && (
              <>
                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
              </>
            )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            { isSignup ? 'Sign Up' : 'Sign In' }
          </Button>
          <GoogleLogin
            clientId="365553992329-don01c74hkhiotbo7ep8o145062ff8ks.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy="single_host_origin"
          />
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        open={!!authError}
        autoHideDuration={6000}
        onClose={() => dispatch({ type: AUTH_ERROR })}
      >
        <SnackbarContent
          message="Please enter correct details."
          action={
            <Button color="inherit" size="small" onClick={() => dispatch({ type: AUTH_ERROR })}>
              Dismiss
            </Button>
          }
        />
      </Snackbar>
    </Container>
  );
};

export default SignUp;
