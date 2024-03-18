import React, {useState, useEffect} from 'react';
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';
import memoriesLogo from "../../images/memoriesLogo.png";
import memoriesText from "../../images/memoriesText.png";
import useStyles from './styles.js';
import {Link} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
    const dispatch = useDispatch(); 
    const location = useLocation();
   
    
   const u = user?.result?.name
   

    useEffect (()=> {
        const token = user?.token;
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()){
                logout()
            }
        }


        setUser(JSON.parse(localStorage.getItem("profile")));
    }, [location]);

    const decodeToken = (token) => {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error("Error decoding token", error);
            return null;
        }
    };

    const tokenPayload = user ? decodeToken(user?.result?.credential) : null;

    const logout = () => {
        dispatch({type : 'LOGOUT'});
        navigate('/auth');
        setUser(null);
    };

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <Link to='/' className={classes.brandContainer}>
                <img className={classes.image} src={memoriesText} alt="memories" height="60"/>
                <img className={classes.image} src={memoriesLogo} alt="memories" height="60"/>
            </Link>
            <Toolbar className={classes.toolbar}>
                {user ? (
                    <div className={classes.profile}>
                        {(!u) && (
                            <>
                            <Avatar className={classes.purple} alt={tokenPayload?.name} src={tokenPayload?.imageUrl}>{tokenPayload?.name?.charAt(0)}</Avatar>
                        <Typography className={classes.userName} variant='h6'>{tokenPayload?.name}</Typography>

                            </>

                        )}
                        
                        {(u) && (
                            <>
                            <Avatar className={classes.purple} alt={user?.result?.name} src={tokenPayload?.imageUrl}>{user?.result?.name.charAt(0)}</Avatar>
                            <Typography className={classes.userName} variant='h6'>{user?.result?.name}</Typography>

                             </>
                            
                        )}
                        
                        
                        <Button component={Link} to='/auth' variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to='/auth' variant='contained' color="primary">Sign In</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
