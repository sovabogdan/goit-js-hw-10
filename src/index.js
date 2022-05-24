import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
refs.searchBox.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

function clearData() {
  refs.countriesList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
function handleSearch(event) {
    const inputValue = event.target.value.trim();
    if (inputValue === '') {
        clearData();
        return;
    }
    fetchCountries(inputValue)
        .then(countries => {
            if (countries.length > 10) {
                clearData();
                Notiflix.Notify.info('Too many matches found. Please enter a more specific query!');
                return;
            }
            else if (countries.length === 1) {
                clearData();
                refs.countryInfo.insertAdjacentHTML("beforeend", renderCountry(countries[0]));
                return;
            }
             refs.countriesList.insertAdjacentHTML("beforeend", renderCountries(countries)); 
        })
        .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
        });
};

function renderCountry(country) {
   return `<div class="info-title">
        <img src = "${country.flags.svg}" alt = 'Flag' width="40">
        <span style="font-weight: bold; font-size: 30px;">${country.name.official}</span>
        <p><span style="font-weight: bold;">Capital:</span>${country.capital}</p>
        <p><span style="font-weight: bold;">Population:</span>${country.population}</p>
        <p><span style="font-weight: bold;">Language:</span>${Object.values(country.languages).join(', ')}</p>
        </div>`;
}

function renderCountries(countries) {
    clearData();
   return countries.map(country => {
       return `<li>
            <img src = "${country.flags.svg}" alt = 'Flag' width="40">
            <span>${country.name.official}</span>
            </li>`;
   }
    ).join("");
}