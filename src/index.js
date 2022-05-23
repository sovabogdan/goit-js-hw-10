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

let country = null;

function renderCountry(country) {
   return refs.countryInfo.innerHTML = `
    <div class="info-title">
        <img src = "${country.flags.svg}" alt = Flag of "${country.name.official} class = "flag" ">
        <p><span>Capital:</span>${country.capital}</p>
        <p><span>Population:</span>${country.population}</p>
        <p><span>Language:</span>${Object.values(country.languages).join(', ')}</p>
        </div>`;
}

function renderCountries(countries) {
    clearData();
   return countries.map(country => {
        refs.countriesList.innerHTML = `
        <li>
            <img src = "${country.flags.svg}" alt = Flag of "${country.name.official}">
            <span>${country.name.official}</span>
            </li>`;
    });
}