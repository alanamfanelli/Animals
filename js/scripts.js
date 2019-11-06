var pokemonRepository = (function() {    //Start of IIFE
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var $pokemonList = $('ul');

  //Function to add new Pokemon data
  function add(pokemon) {
    //Must be an 'object' type
    if (typeof pokemon !== 'object') {
      return 'Not a valid input'
    }else{
    repository.push(pokemon);
    }
  }

  //Function to pull all Pokemon data
  function getAll() {
    return repository;
  }

  //Function to add list for each pokemon object
  function addListItem(pokemon) {
    var $listItem = $('<li></li>');
    $pokemonList.append($listItem);
    var $button = $('<button type="button" id="pokemon-button" class="btn btn-outline-light" data-toggle="modal" data-target="#exampleModalCenter">' + pokemon.name + '</button>');
    $listItem.append($button);
    $button.on('click', function() {
      showDetails(pokemon)
    })
  }

  //Function to load pokemon list from API
  function loadList() {
    return $.ajax(apiUrl, {dataType: 'json'}).then(function(responseJSON) {
      return responseJSON;
    }).then(function(json) {
      json.results.forEach(function(item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function(e) {
      console.error(e);
    })
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url, {dataType: 'json'}).then(function(responseJSON) {
      return responseJSON;
    }).then(function(details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
      item.types = Object.keys(details.types);
    }).catch(function(e) {
      console.error(e);
    })
  }

  //Funtion to create modal
    var $modalContainer = $('#modal-container');
    function showModal(title, text, image) {
      $modalContainer.addClass('is-visible');

     // Clear all existing modal content
     $modalContainer.innerHTML = '';

     var $modal = $('<div class="modal"></div>');

     // Add the new modal content: Name, height, and image
     var $closeButtonElement = $('<button class="modal-close">Close</button>');
     $('closeButtonElement').on('click', function (hideModal){
       $modalContainer.classList.remove('is-visible');
      });

     var $titleElement = $('<h1>title</h1>');

     var $contentElement = $('<p>'Height: ' + text</p>');

     var $imageElement = $('img class=myImage');
     imageElement.src = image;

     modal.appendChild(closeButtonElement);
     modal.appendChild(titleElement);
     modal.appendChild(contentElement);
     modal.appendChild(imageElement);
     $modalContainer.appendChild(modal);

     $modalContainer.classList.add('is-visible');
   }

    function hideModal() {
      $modalContainer.classList.remove('is-visible');
      }

    function showDetails(item) {
      pokemonRepository.loadDetails(item).then(function () {
        showModal(item.name, item.height, item.imageUrl);
      });
    }

  return{
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
    hideModal: hideModal,
  };
})();

//Creates list of Pokemon with Pokemon's name on the button
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
