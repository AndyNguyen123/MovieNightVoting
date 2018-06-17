'use strict';

//initialize firebase
var config = {
    apiKey: "AIzaSyDRY3ewVEjYhF4EaAr0Q6cYAguNySEMDRo",
    authDomain: "movienightvoting-1528237769486.firebaseapp.com",
    databaseURL: "https://movienightvoting-1528237769486.firebaseio.com",
    projectId: "movienightvoting-1528237769486",
    storageBucket: "movienightvoting-1528237769486.appspot.com",
    messagingSenderId: "212113274817"
};
firebase.initializeApp(config);
var database = firebase.database();

const currentLink = window.location.href;

function getToken(link) {
    const linkHref = new URL(link);
    const tokenParam = new URLSearchParams(linkHref.search.slice(1));
    const linkSearch = new URLSearchParams(linkHref.search);
    const hasTokenParam = tokenParam.has('token');

    if (hasTokenParam) {
        return linkSearch.get('token');
    }
}
const token = getToken(currentLink);
console.log(token);

