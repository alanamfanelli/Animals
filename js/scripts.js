const pokemonRepository = (function () { // Start of IIFE
  const repository = [];
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  const $pokemonList = $('ul');

  // Function to add new Pokemon data
  function add(pokemon) {
    // Must be an 'object' type
    if (typeof pokemon !== 'object') {
      return 'Not a valid input';
    }
    repository.push(pokemon);
  }

  // Function to pull all Pokemon data
  function getAll() {
    return repository;
  }

  // Function to load pokemon list from API
  function loadList() {
    return $.ajax(apiUrl, { dataType: 'json' }).then((responseJSON) => responseJSON).then((json) => {
      json.results.forEach((item) => {
        const pokemon = {
          name: item.name,
          detailsUrl: item.url,
        };
        add(pokemon);
      });
    }).catch((e) => {
      console.error(e);
    });
  }

  function loadDetails(item) {
    const url = item.detailsUrl;
    return $.ajax(url, { dataType: 'json' }).then((responseJSON) => responseJSON).then((details) => {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
      item.types = Object.keys(details.types);
    }).catch((e) => {
      console.error(e);
    });
  }

  return {
    add,
    getAll,
    loadList,
    loadDetails,
  };
}());

const $pokemonList = $('.pokemon-list');

function addListItem(pokemon) {
		    const listItem = $('<button type="button" class="btn btn-primary list-group-item-action data-toggle="modal" data-target="#pokemon-modal"></button>');
		    listItem.text(pokemon.name);
  $pokemonList.append(listItem);
		    listItem.click(() => {
	 	      showDetails(pokemon);
  });
}


function showDetails(pokemon) {
  pokemonRepository.loadDetails(pokemon).then(() => {
    // creates Modal
    const modal = $('.modal-body');
    const name = $('.modal-title').text(pokemon.name);
    const height = $('<p class="pokemon-height"></p>').text(`Height: ${pokemon.height} Decimetres.`);
    const weight = $('<p class="pokemon-weight"></p>').text(`Weight: ${pokemon.weight} Hectograms.`);
    const type = $('<p class="pokemon-type"></p>').text(`Type: ${pokemon.types}.`);
    const image = $('<img class="pokemon-picture">');
    image.attr('src', pokemon.imageUrl);

    if (modal.children().length) {
      modal.children().remove();
      $('#pokemon-modal').modal('show');
    }

    modal.append(image)
      .append(height)
      .append(weight)
      .append(type);
  });
}

// Creates list of Pokemon with Pokemon's name on the button
pokemonRepository.loadList().then(() => {
  const pokemons = pokemonRepository.getAll();

  $.each(pokemons, (index, pokemon) => {
    addListItem(pokemon);
  });
});
