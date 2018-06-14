'use strict';

(function () {

    // ! DATABASE
    // ! use this db to push user info
    const rootDb = firebase.database();

    // ! NEW INSTANCE OF GOOGLE PROVIDER
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    /**
     * this functions cache all the DOM elements
     */
    const cacheElement = (function () {
        const googleIn = document.getElementById('signin-google');
        return {
            googleIn,
        }
    })();

    // adds a click event on facebook button
    // 2nd parameter takes a callback fn, this will invoke googleSignIn fn
    cacheElement.googleIn.addEventListener('click', googleSignIn);


    /**
     * this function invokes the sign in pop up method
     * from firebase oAuth
     * provider === google
     */
    function googleSignIn() {
        /**
         * signInWithPopup method returns a PROMISE
         * resolves promise by signing in the user
         * if user success, use the info
         */
        firebase.auth().signInWithPopup(googleProvider)
            .then(function (result) {
                // every login gives a new token
                const token = result.credential.accessToken;
                // user info assigns to user variable
                const user = result.user;
                // ! checks the user state if user is login or not
                userState();

            }).catch(function (error) {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                const credential = error.credential;
                // ...
                console.error(errorMessage)
            })
    };

    /**
     * checks the user states if they're login or not
     * invoke by the googleSignIn function
     */
    function userState() {
        /**
         * onAuthStateChanged listens every time the user changes state
         * this method takes a callback function
         */
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // TODO: if user successfully login redirect to a page 
                // * previous link will not be enabled
                // window.location.replace("http://google.com");
                console.log(user);
                // * can go back to the previous link
                window.location.href = '../../../user-profile/user_profile.html';
            } else {
                // TODO: if user unsuccessful to login pop or error msg will come out 
                console.log('bye');
            }
        });
    }

})();