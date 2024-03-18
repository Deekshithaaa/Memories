import React from "react";
import { Container } from "@material-ui/core";
import Navbar from "./components/Navbar/Navbar.js";
import Home from "./components/Home/Home.js";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth/Auth.js";
import {GoogleOAuthProvider} from '@react-oauth/google';
import PostDetails from "./components/PostDetails/PostDetails.jsx";
import Posts from "./components/Posts/Posts.js";
const App =() => {
    const user = JSON.parse(localStorage.getItem('profile'))
    return (
        <GoogleOAuthProvider clientId="365553992329-don01c74hkhiotbo7ep8o145062ff8ks.apps.googleusercontent.com">
             <BrowserRouter>
        <Container maxWidth="xl">
            <Navbar/>
            <Routes>
                <Route path="/" exact Component={ () => <Navigate to="/posts" replace /> }/>
                <Route path="/posts" exact Component={Home} />
                <Route path="/posts/search" exact Component={Home} />
                <Route path="/posts/:id" Component={PostDetails}/>
                <Route path="/auth" exact Component={() => (!user ? <Auth/> : <Navigate to="/posts" replace />)}/>

            </Routes>
            
        </Container>
        </BrowserRouter>

        </GoogleOAuthProvider>
       
    )
}

export default App;