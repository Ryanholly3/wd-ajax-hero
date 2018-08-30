(function() {
  'use strict';

  const movies = [];
  const searchForm = document.querySelector('form');

  searchForm.addEventListener('submit', searchRequest);

  function searchRequest (event) {
    event.preventDefault();

    const searchBox = document.querySelector('#search');
    const searchTerm = searchBox.value;
    const inputURL = searchTerm.replace(/ /g, '%20');
    const searchURL = 'https://omdb-api.now.sh/?s=' + inputURL;

    fetch(searchURL)
      .then((response) => response.json())
      .then(function(data){
        var currentMovie = {};
        var searchData = data.Search;

        for (var i = 0; i < searchData.length; i++) {
          var currentMovie = {
            id: searchData[i]['imdbID'],
            poster: searchData[i]['Poster'],
            title: searchData[i]['Title'],
            year: searchData[i]['Year']
          }
          movies.push(currentMovie);
        }
        renderMovies();
      })
  }

  function renderMovies() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

})();
