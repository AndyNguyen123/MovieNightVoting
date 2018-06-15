'use strict';
(function () {

    // * flag variable.
    // * used to toggle the event on window
    let isModalShowing = false;

    const cacheElement = (function () {
        const loginBtn = document.getElementById('login-btn')
        const email = document.getElementById('signIn-userEmail');
        const password = document.getElementById('signIn-password');
        const hideLabel = document.querySelectorAll('.label-sign-in');
        const errorAlert = document.querySelectorAll('.error-alert');
        const closeModalBtn = document.querySelectorAll('.modal-close');
        const homeLogInBtn = document.getElementById('loginB');
        // const signInForm = document.getElementById('sign-in-form');

        return {
            // signInForm,
            email,
            password,
            loginBtn,
            hideLabel,
            errorAlert,
            closeModalBtn,
            homeLogInBtn,
        }

    }());

    cacheElement.loginBtn.addEventListener('click', e => {
        const email = cacheElement.email.value.trim();
        const password = cacheElement.password.value.trim();
        signIn(email, password);
    });

    /**
     * ! create a sign with email and password.
     * ! will take to parameters the email and password
     */
    function signIn(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => {
                userState();
            })
            .catch((error) => {
                // Handle Errors here.
                // TODO: If user has not account error will pop out a modal saying 
                // * theres no account associated with this email.
                const errorCode = error.code;
                const errorMessage = error.message;
                showAndHideError('add');
                // alert('There was an error with your E-Mail/Password combination. Please try again.');
                // ...
            });
    }

    function userState() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // ! User is signed in.
                // ! User data
                console.log(user);
                window.location.href = './user-profile/user_profile.html';
                // ...
            } else {
                // User is signed out.
                // TODO: handle user if they sign out
                // ...
            }
        });
    }

    /**
     * this function will show and hide error depending on the passed argument
     * @param {string} method should take add and remove as a param...
     * any string will have an error
     * used eval function to evaluate the string as method
     */
    function showAndHideError(method) {
        cacheElement.hideLabel.forEach(labelElem => {
            eval(`labelElem.classList.${method}('d-none')`);
        });
        cacheElement.errorAlert.forEach(alertMsg => {
            eval(`alertMsg.classList.${method}('d-block')`);
        })
    }    
    

    /**
     * * this function removes err msg and show the label
     */
    cacheElement.closeModalBtn.forEach(btnElem => {
        btnElem.addEventListener('click', () => {
            showAndHideError('remove');
        })
    })


    /**
     * * function to show modal if theres an error
     * TODO: move this to signup for error alert
     */
    function showModal() {
        $("#exampleModal").modal();
    }

})();