'use strict';
(function () {

    /**
     * * this function cache all the elements need for signup
     * @returns {object} DOM elements
     */
    const cacheElement = (function () {

        const userName = document.getElementById('user-name');
        const email = document.getElementById('user-email');
        const password = document.getElementById('user-password');
        const signUpForm = document.getElementById('sign-up-form');
        const showEmailErrorMsg = document.getElementById('error-email-msg');
        const inputEmailAdd = document.getElementById('user-email');

        return {
            signUpForm,
            email,
            password,
            userName,
            showEmailErrorMsg,
            inputEmailAdd,
        }

    }());

    /**
     * * attach event on the form.
     * * gets the input value
     */
    cacheElement.signUpForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = cacheElement.email.value.trim();
        const password = cacheElement.password.value.trim();
        const userName = cacheElement.userName.value.trim();

        // ! userInfo object
        const userInfo = {
            email,
            password,
            userName
        }

        // invokes the createNewUser function
        //passes 1 argument type{object}
        ValidateEmail(userInfo)
    })

    /**
     * * this function validates the email address using regex,
     * * regex is not the best practice to validate email address,
     * * because some of the unicode are now being used by email provider
     * @param {object} userInfo takes a email address of the user.
     */
    function ValidateEmail(userInfo) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (userInfo.email.match(mailformat)) {
            createNewUser(userInfo);
            // userBasicInfo(userInfo);
        } else {
            cacheElement.showEmailErrorMsg.classList.add('d-block');
        }
    }
    cacheElement.inputEmailAdd.addEventListener('focus', () => {
        cacheElement.showEmailErrorMsg.classList.remove('d-block');
    })



    /**
     * this function creates new user
     * @param {object} userInfo holds the user data 
     */
    function createNewUser(userInfo) {
        // TODO: validate email address
        // ! HIGH IMPORTANCE
        const email = userInfo.email;
        const password = userInfo.password;
        /**
         * firebase method will create a new user with email and password
         * @param {string, string} email and password
         * ! this is promise
         */
        firebase.auth().createUserWithEmailAndPassword(email, password)

            // if promise has no error it will invoke 2 functions
            // userProfile takes takes userInfo as its argument
            // userState fn will check if the user has login or signout.
            .then(user => {
                checkUserState();
            })
            .then(() => {
                return userBasicInfo(userInfo);
            })
            // handle error here
            // TODO: create a modal
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ...
            });
    }


    /**
     * * this function check the user state
     * if log in or logout
     */
    function checkUserState() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log(user);
                // window.location.href = '../test_signout.html';
            } else {
                // TODO: if user unsuccessful to login pop or error msg will come out 
                console.log('bye');
            }
        });
    }

    /**
     * this function will set the user name
     * @param {object} userInfo takes the user basic info
     */
    function userBasicInfo(userInfo) {
        const user = firebase.auth().currentUser;
        console.log(userInfo);
        user.updateProfile({
            displayName: userInfo.userName,
            // photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(function () {
            window.location.href = '../../../user-profile/user_profile.html';
            // Update successful.
        }).catch(function (error) {
            // An error happened.
        });
    }
})();