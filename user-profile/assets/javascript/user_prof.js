'use strict';

// ! this is just for testing.
// ! remove this if the code works
// ! this is global to get the user UID
// TODO: dont make this global

(function () {


    const cacheElements = (function () {
        const signOutBtn = document.getElementById('sign-out-btn');
        const createPoll = document.getElementById('create-poll');
        const displayUserName = document.getElementById('user-name-display');
        const hostDataElem = document.getElementById('host-data');
        return {
            signOutBtn,
            createPoll,
            displayUserName,
            hostDataElem,
        }
    })()

    cacheElements.createPoll.addEventListener('click', goToAndyPage);

    function goToAndyPage() {
        window.location.href = '../host-select-movie-page/host-select-movie-page.html?token=12312ad';
    }

    cacheElements.signOutBtn.addEventListener('click', SignOutUser);


    /**
     * this function invokes if the user clicks the sign out btn
     */
    function SignOutUser() {
        firebase.auth().signOut().then(function () {
            window.location.href = '../index.html';
            // Sign-out successful.
            console.log('im log out');
        }).catch(function (error) {
            // An error happened.
            console.error(error);
        });
    }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // TODO: if user successfully login redirect to a page 
            // * previous link will not be enabled
            // window.location.replace("http://google.com");

            // * can go back to the previous link
            // window.location.href = '../test_signout.html'

            const currUser = firebase.auth().currentUser

            // currUser.getIdToken().then(data => console.log(data));

            // ! userID
            let userID = '';

            currUser.providerData.forEach(function (profile) {

                cacheElements.displayUserName.innerText = profile.displayName.toUpperCase();

                // console.log("Sign-in provider: " + profile.providerId);
                // console.log("Provider-specific UID: " + profile.uid);
                // console.log("Name: " + profile.displayName);
                // console.log("Email: " + profile.email);
                // console.log("Photo URL: " + profile.photoURL);

                userID = profile.uid;
            });

            const test = firebase.database();

            // console.log(userID, 'active');

            test.ref('/polls').on("value", function (snapshot) {

                const polls = snapshot.val();

                for (let poll in polls) {

                    let hostId = snapshot.val()[poll].host;

                    if (userID === hostId) {

                        /**
                         * andy change the link to you page
                         */
                        cacheElements.hostDataElem.innerHTML += `
                        <a href=./fakelink/?token=${poll} >

                        <div class='d-flex justify-content-left mt-3' style='color: blue; cursor: pointer;'> 
                            <span>  
                                ${snapshot.val()[poll].inputShowDate}_
                                ${snapshot.val()[poll].inputZip}:
                                ${snapshot.val()[poll].movies[0].title}, 
                                ${snapshot.val()[poll].movies[1].title}, 
                                ${snapshot.val()[poll].movies[2].title}
                            </span>
                        </div>
                        </a>
                     `
                        //  console.log(snapshot.val()[poll].movies[0].title, 'asdfasd');
                    }
                }
            });

        } else {
            // TODO: if user unsuccessful to login pop or error msg will come out 
            console.log('bye');
        }
    });

})();