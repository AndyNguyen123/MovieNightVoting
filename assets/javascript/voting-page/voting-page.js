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
var ref = database.ref('/polls')

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

ref.on('value', function (snapshot) {
    const polls = snapshot.val();
    console.log(snapshot);
    for (let poll in polls) {
        const pollID = polls[poll].id;
        if (pollID == '-' + token) {
            const movies = polls[poll].movies;
            console.log(movies);
            displayMovies(movies)
        }
    }
});

var posterSelectedIndex = -1;
var movieVoted = '';
function displayMovies(movies) {
    movies.forEach(movie => {
        var showTimes = [];
        movie.showTimes.forEach(showTime => {
            showTimes.push(showTime.theatre.name + ': ' + showTime.dateTime);
        })
        console.log(movie);
        var posterDiv = $(`<img class='posters m-3' src='${movie.poster}' data-movie-title='${movie.title}'>`);
        posterDiv.on('click', test(movie)) 
        $('#movie-display').append(posterDiv);
    });
}

 function test(obj) {
    console.log(obj)
    $('#movie-info-modal').modal('show');
    $('.modal-title').text(movie.title);
    var movieInfoDiv = $(
        `<div>
            <p><strong>Actors:</strong> ${movie.actors}</p>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Genre:</strong> ${movie.genre}</p>
            <p><strong>Year:</strong> ${movie.year}</p>
            <p><strong>Duration:</strong> ${movie.runtime}</p>
            <p><strong>Rating:</strong> ${movie.rating}</p>
            <p><strong>Plot:</strong> ${movie.plot}</p>
         </div>`)
    $('#movie-info-modal-body').html(movieInfoDiv);
    var closeButton = $(`<button type="button"  id="closeBtn" class="btn btn-secondary" data-dismiss="modal">Close</button>`)
    var selectButton = $(`<button type="button" id="selectBtn" class="btn btn-primary">Select</button>`)

    selectButton.on('click', function() {
        posterSelectedIndex = movies.indexOf(movie);
        console.log('Poster Index: ' + posterSelectedIndex);
        movieVoted = movie.title;
        console.log('Movie Voted: ' + movieVoted);

        $('#movie-info-modal').modal('hide');
    });
    $('#movie-info-modal-footer').empty();
    $('#movie-info-modal-footer').append(closeButton);
    $('#movie-info-modal-footer').append(selectButton);
}