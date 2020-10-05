import React, { useContext } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import { Button } from '@material-ui/core';
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App';
import { useLocation, useHistory } from 'react-router-dom';
// import { UserContext } from '../../App';



const Login = () => {

    
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);

    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };
    
    if(firebase.apps.length === 0){

        firebase.initializeApp(firebaseConfig);
    }

    
   
    const handleGoogleSignIn = () => {

        const googleProvider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(googleProvider)
        .then(function(result) {
            var token = result.credential.accessToken;
            const {displayName, email} = result.user;
            const signedInUser = {name: displayName, email};
            setLoggedInUser(signedInUser);
            storeAuthToken();
            history.replace(from);
            // console.log(signedInUser);
          }).catch(function(error) {
            const errorMessage = error.message;
            console.log(errorMessage);
          });
    }
    const handleFbSignIn = () => {
        const fbProvider = new firebase.auth.FacebookAuthProvider();

        firebase.auth().signInWithPopup(fbProvider).then(function(result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log('fb user after sign in ',user)
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            console.log(error)
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
    }

    const storeAuthToken = () => {
      firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
      .then(function(idToken) {
        //console.log(idToken);
        sessionStorage.setItem('token', idToken);
      }).catch(function(error) {
        // Handle error
      });
    }
    return (
        <div>
            <Button onClick={handleGoogleSignIn} variant="contained" color="primary">Google Login</Button>
        
       
            <Button onClick={handleFbSignIn} variant="contained" color="primary">Facebook Login</Button>
        
            </div>
    );
};

export default Login;