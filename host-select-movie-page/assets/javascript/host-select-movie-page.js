//API Keys
var googleAPIKey = 'AIzaSyA95SKVltP7yweTYygcg_TvIBoP_bgNLDA';
var tmsAPIKey = 'dgf69zqkhraznhf7zzdaee2r';
var tmdbAPIKey = 'd4b8f64d1915c91386ea4a4bba96b122';
var omdbAPIKey = 'ee6c2ea1';

//input variables
var zipcode = 92660;
var showDate = '2018-06-16';
var tmsURL;
var selectedMovieTitles = [];
var selectedMovieArrays = [];
var movies = [];
var selectState = false;



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

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var currUser = firebase.auth().currentUser;
        //console.log(currUser);
        $('#createPollBtn').on('click', function () {
            // console.log(currUser);
            var creatorID = currUser.providerData[0].uid;

            console.log(selectedMovieTitles);
            selectedMovieTitles.forEach(function (element) {
                var movie = {
                    imdbID: $(`.posters[data-title='${element}']`).attr('id'),
                    title: $(`.posters[data-title='${element}']`).attr('data-title'),
                    actors: $(`.posters[data-title='${element}']`).attr('data-actors'),
                    director: $(`.posters[data-title='${element}']`).attr('data-director'),
                    genre: $(`.posters[data-title='${element}']`).attr('data-genre'),
                    plot: $(`.posters[data-title='${element}']`).attr('data-plot'),
                    year: $(`.posters[data-title='${element}']`).attr('data-year'),
                    runtime: $(`.posters[data-title='${element}']`).attr('data-runtime'),
                    poster: $(`.posters[data-title='${element}']`).attr('data-poster'),
                    showTimes: movies[movies.map(x => x.title).indexOf(element)].showtimes,
                }
                selectedMovieArrays.push(movie);
            });
            console.log(selectedMovieArrays);
            createPoll(creatorID,zipcode,showDate,selectedMovieArrays,'');
             window.location.href = '../../../user-profile/user_profile.html';
        })
    } else {
        // TODO: if user unsuccessful to login pop or error msg will come out 
        console.log('bye');
    }
});
$('#showMovieBtn').on('click', function () {
    event.preventDefault();
    showDate = $('#date-input').val().trim();
    zipcode = $('#zip-input').val().trim();
    tmsURL = 'http://data.tmsapi.com/v1.1/movies/showings?startDate=' + showDate + '&zip=' + zipcode + '&api_key=' + tmsAPIKey;
    getMovieList();
});

function createPoll(creatorID, inputZip, inputShowDate, movies, chosenMovie) {
    // A poll entry.
    var newPollKey = database.ref().child('polls').push().key;
    var pollData = {
        id: newPollKey,
        host: creatorID,
        inputZip: inputZip,
        inputShowDate: inputShowDate,
        movies: movies,
        chosenMovie: chosenMovie,
    };
    // Write the new poll's data simultaneously
    var updates = {};
    updates['/polls/' + newPollKey] = pollData;

    return database.ref().update(updates);
}


function limitMovieSelect() {
    $('#limitSelection').modal('show');
}

function selectMovie() {
    $('#movieInfoModal').modal('hide');
    if (selectedMovieTitles.length === 3) {
        limitMovieSelect();
    }
    else {
        selectState = true;
        selectedMovieTitles.push($(this).attr('data-title'));
        $(`.posters[data-title='${$(this).attr('data-title')}']`).css('border', '5px solid #008000');
        $(`.posters[data-title='${$(this).attr('data-title')}']`).attr('data-state-selected', selectState);
        console.log('selected movie titles: ' + selectedMovieTitles);
    }
}

function launchModal() {
    $('#movieInfoModal').modal('show');
    selectState = false;
    $(this).css('border', '');

    var titleToBeRemove = $(this).attr('data-title');
    if (selectedMovieTitles.indexOf(titleToBeRemove) !== -1) {
        selectedMovieTitles.splice(selectedMovieTitles.indexOf(titleToBeRemove), 1);
    };
    $('.modal-title').text($(this).attr('data-title'));
    var movieInfoDiv = $(`<div>
                                <p><strong>Actors:</strong> ${$(this).attr('data-actors')}</p>
                                <p><strong>Director:</strong> ${$(this).attr('data-director')}</p>
                                <p><strong>Genre:</strong> ${$(this).attr('data-genre')}</p>
                                <p><strong>Year:</strong> ${$(this).attr('data-year')}</p>
                                <p><strong>Duration:</strong> ${$(this).attr('data-runtime')}</p>
                                <p><strong>Rating:</strong> ${$(this).attr('data-rating')}</p>
                                <p><strong>Plot:</strong> ${$(this).attr('data-plot')}</p>
                            </div>`)
    $('#movieInfoModalBody').html(movieInfoDiv);
    var closeButton = $(`<button type="button"  id="closeBtn" class="btn btn-secondary" data-dismiss="modal">Close</button>`)
    var selectButton = $(`<button type="button" id="selectBtn" class="btn btn-primary" data-title="${$(this).attr('data-title')}" data-poster="${$(this).attr('data-poster')}">
                                Select
                            </button>`)
    selectButton.on('click', selectMovie);
    // $('#selectBtn').attr('data-title', $(this).attr('data-title'));
    // $('#selectBtn').attr('data-poster', $(this).attr('data-poster'));
    $('#movieInfoModalFooter').empty();
    $('#movieInfoModalFooter').append(closeButton);
    $('#movieInfoModalFooter').append(selectButton);
}

function getMovieList() {
    var movieTitles = [];
   
    axios.get(tmsURL)
        .then(function (tmsResp) {
            console.log(tmsResp);
            tmsResp.data.forEach(function (element) {
                movieTitles.push(element.title);
                movies.push(element);
            });
            console.log(movieTitles);
            console.log(movies);
            movieTitles.forEach(function (element) {
                var omdbURL = 'https://omdbapi.com/?t=' + element + '&apikey=trilogy';

                axios.get(omdbURL)
                    .then(function (omdbResp) {
                        console.log(omdbResp);
                        if(omdbResp.data.Response !== 'False'){

                        var posterDiv = $(`<img class='posters m-3' id='${omdbResp.data.imdbID}' 
                                                data-title='${omdbResp.data.Title}'
                                                data-actors='${omdbResp.data.Actors}'
                                                data-director='${omdbResp.data.Director}'
                                                data-genre='${omdbResp.data.Genre}'
                                                data-plot='${omdbResp.data.Plot}'
                                                data-year='${omdbResp.data.Year}'
                                                data-runtime='${omdbResp.data.Runtime}'
                                                data-rating='${omdbResp.data.imdbRating}'
                                                data-poster='${omdbResp.data.Poster}'
                                                src=${omdbResp.data.Poster}
                                        >`);
                        posterDiv.on('click', launchModal);
                        $('#movie-display').append(posterDiv);
                        }
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            });
        }).catch(function (err) {
            console.error(err);
        });
}


function initGoogleMap() {
    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
        origins: ['AMC Tustin 14 at The District'],
        destinations: ['92660'],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) {
        if (status !== 'OK') {
            alert('Error was: ' + status);
        } else {
            console.log(response);
        }
    });
}