import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

const breedSelect = document.querySelector('#placeholderSingle');
const loader = document.querySelector('.loader');
const catInfo = document.querySelector('.cat-info');

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showError() {
  Notiflix.Report.failure(
    'Error',
    'Oops! Something went wrong! Try reloading the page!'
  );
}

function hideCatInfo() {
  catInfo.style.display = 'none';
}

function clearCatInfo() {
  catInfo.innerHTML = '';
}

function populateBreedSelect(breeds) {
  const options = breeds.map(breed => ({
    value: breed.id,
    text: breed.name,
  }));

  new SlimSelect({
    select: '#placeholderSingle',
    data: options,
  });

  breedSelect.addEventListener('change', handleBreedSelectChange);
}

function updateCatInfo(cat) {
  const catElement = document.createElement('div');
  catElement.classList.add('cat-container');

  const image = document.createElement('img');
  image.setAttribute('src', cat.url);
  image.alt = 'Cat';
  image.classList.add('cat-image');
  catElement.appendChild(image);

  const catDetails = document.createElement('div');
  catDetails.classList.add('cat-details');

  const breedName = document.createElement('h2');
  breedName.textContent = cat.breeds[0].name;
  breedName.classList.add('cat-title');
  catDetails.appendChild(breedName);

  const description = document.createElement('p');
  description.textContent = cat.breeds[0].description;
  description.classList.add('cat-description');
  catDetails.appendChild(description);

  const temperamentTitle = document.createElement('span');
  temperamentTitle.textContent = `Temperament: `;
  temperamentTitle.classList.add('cat-temperament-title');
  catDetails.appendChild(temperamentTitle);

  const temperament = document.createElement('p');

  temperamentTitle.insertAdjacentHTML(
    'afterend',
    `${cat.breeds[0].temperament}`
  );

  catElement.appendChild(catDetails);

  catInfo.innerHTML = '';
  catInfo.appendChild(catElement);
}

function handleBreedSelectChange() {
  const selectedBreedId = breedSelect.value;

  hideCatInfo();
  clearCatInfo();
  showLoader();

  fetchCatByBreed(selectedBreedId)
    .then(cat => {
      updateCatInfo(cat);
      hideLoader();
      catInfo.style.display = 'block';
    })
    .catch(error => {
      console.error(error);
      hideLoader();
      showError();
    });
}

fetchBreeds()
  .then(breeds => {
    populateBreedSelect(breeds);
    hideLoader();
  })
  .catch(error => {
    console.error(error);
    hideLoader();
    showError();
  });
