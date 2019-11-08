var pokemonRepository = (function () { // Start of IIFE
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

  // Function to add list for each pokemon object
  function addListItem(pokemon) {
    const $listItem = $('<li></li>');
    $pokemonList.append($listItem);
    const $button = $(`<button type="button" id="pokemon-button" class="btn btn-outline-light" data-toggle="modal" data-target="#exampleModalCenter">${pokemon.name}</button>`);
    $listItem.append($button);
    $button.on('click', () => {
      showDetails(pokemon);
    });
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

  // Funtion to create modal
  const modalContainer = $('#modal-container');
  function showModal(title, text, image) {
    modalContainer.addClass('is-visible');

    // Clear all existing modal content
    modalContainer.innerHTML = '';

    const modal = $('<div class="modal"></div>');

    // Add the new modal content: Name, height, and image
    const closeButtonElement = $('<button class="modal-close">Close</button>');
    $('closeButtonElement').on('click', () => {
      modalContainer.classList.remove('is-visible');
    });

    const titleElement = $('<h1>title</h1>');

    const contentElement = $(`<p> Height: ${text}</p>`);

    const imageElement = $('<img class=myImage></img>');
    $imageElement.src = image;

    modal.append($closeButtonElement);
    modal.append($titleElement);
    modal.append($contentElement);
    modal.append($imageElement);
    modalContainer.append($modal);
  }

  function hideModal() {
    modalContainer.classList.remove('is-visible');
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(() => {
      showModal(item.name, item.height, item.imageUrl);
    });
  }

  return {
    add,
    getAll,
    addListItem,
    showDetails,
    loadList,
    loadDetails,
    showModal,
    hideModal,
  };
}());

// Creates list of Pokemon with Pokemon's name on the button
pokemonRepository.loadList().then(() => {
  pokemonRepository.getAll().forEach((pokemon) => {
    pokemonRepository.addListItem(pokemon);
  });
});
