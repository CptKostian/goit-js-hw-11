import { createMarkup } from './markup';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let searchQuery = '';
const API_KEY = '31152381-f34de1f724933875c5025d571';
const BASE_URL = 'https://pixabay.com/api/';
let currentPage = 1;
let lastSearchQuery = '';
let numberOfShownPictures = 0;

const axios = require('axios').default;

const searchForm = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');
const imgCollection = document.querySelector('.gallery');

searchForm.addEventListener('submit', onFormSubmit);
loadMore.addEventListener('click', onLoadMore);

async function onFormSubmit(e) {
  e.preventDefault();

  searchQuery = e.currentTarget.elements.query.value;

  await getCollection(searchQuery);
}

async function onLoadMore() {
  await getCollection(searchQuery);

  // Немає необхідності використовувати, коли є нескінченна прокрутка, але працює

  // const { height: cardHeight } = document
  //   .querySelector('.gallery')
  //   .firstElementChild.getBoundingClientRect();

  // window.scrollBy({
  //   top: cardHeight * 2,
  //   behavior: 'smooth',
  // });
}

async function getCollection(searchQuery) {
  try {
    let isTheFirstSearch = false;
    loadMore.classList.add('is-hidden');

    if (lastSearchQuery !== searchQuery) {
      currentPage = 1;
      isTheFirstSearch = true;
      numberOfShownPictures = 0;
    }

    lastSearchQuery = searchQuery;

    const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&safesearch=true&image_type=photo&orientation=horizontal&per_page=40&page=${currentPage}`;

    const response = await axios.get(url);

    if (response.data.hits.length) {
      await createMarkup(response.data.hits, isTheFirstSearch);
      const lightbox = new SimpleLightbox('.gallery a', {
        disableRightClick: true,
        captionDelay: 250,
      });

      numberOfShownPictures += response.data.hits.length;

      if (currentPage === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      }

      if (response.data.totalHits <= numberOfShownPictures) {
        loadMore.classList.add('is-hidden');
        Notiflix.Notify.warning(
          `We're sorry, but you've reached the end of search results.`
        );
        return;
      }

      window.addEventListener('scroll', onScroll);

      async function onScroll() {
        const documentRect = document.documentElement.getBoundingClientRect();

        if (
          documentRect.bottom < document.documentElement.clientHeight + 1000 &&
          response.data.totalHits > numberOfShownPictures
        ) {
          window.removeEventListener('scroll', onScroll);
          await onLoadMore();
        }
      }

      currentPage += 1;

      loadMore.classList.remove('is-hidden');
      return;
    }

    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMore.classList.add('is-hidden');
    imgCollection.innerHTML = '';
  } catch (error) {
    console.error(error);
  }
}
