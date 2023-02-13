import SimpleLightBox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { PixabayAPI } from './js/PixabayAPI'

const formEl = document.querySelector('form')
const galleryEl =  document.querySelector('.gallery')
const buttonEl = document.querySelector('button[type="submit"]')
const inputEl = document.querySelector('input')
let loadMoreBtn = document.querySelector('.load-more')


loadMoreBtn.classList.add('visually-hidden');
const pixabay = new PixabayAPI();
let gallery = new SimpleLightBox('a');

function renderMarkup(results) {
    const markup = results
      .map(
        ({
          likes,
          tags,
          webformatURL,
          views,
          comments,
          downloads,
          largeImageURL,
        }) => {
          return `<a class="photo-card_wrapper" href="${largeImageURL}">
            <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">Likes:
        <b>${likes}</b>
      </p>
      <p class="info-item">Views:
        <b>${views}</b>
      </p>
      <p class="info-item">Comments:
        <b>${comments}</b>
      </p>
      <p class="info-item">Downloads:
        <b>${downloads}</b>
      </p>
    </div>
  </div>
  </a>`;
        }
      )
      .join('');
  
    return markup;
  }

  function renderMarkup(results) {
    const markup = results
      .map(
        ({
          likes,
          tags,
          webformatURL,
          views,
          comments,
          downloads,
          largeImageURL,
        }) => {
          return `<a class="photo-card_wrapper" href="${largeImageURL}">
            <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">Likes:
        <b>${likes}</b>
      </p>
      <p class="info-item">Views:
        <b>${views}</b>
      </p>
      <p class="info-item">Comments:
        <b>${comments}</b>
      </p>
      <p class="info-item">Downloads:
        <b>${downloads}</b>
      </p>
    </div>
  </div>
  </a>`;
        }
      )
      .join('');
  
    return markup;
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    const {
      elements: { searchQuery },
    } = event.target;
  
    const currentQuery = searchQuery.value.trim();
  
    if (!currentQuery) {
      loadMoreBtn.classList.add('visually-hidden');
      galleryEl.innerHTML = '';
      Notiflix.Notify.warning('Please enter your query');
      return;
    }
  
    pixabay.query = currentQuery;
    galleryEl.innerHTML = '';
    pixabay.resetPage();
  
    try {
      loadMoreBtn.classList.add('visually-hidden');
      const { hits, totalHits } = await pixabay.getPhotos();
      if (hits.length === 0) {
        loadMoreBtn.classList.add('visually-hidden');
        galleryEl.innerHTML = '';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      pixabay.totalPhotos = totalHits;
      const markup = renderMarkup(hits);
      galleryEl.insertAdjacentHTML('beforeend', markup);
      const showMore = pixabay.hasMorePhotos();
  
      if (showMore) {
        loadMoreBtn.classList.remove('visually-hidden');
      } else {
        loadMoreBtn.classList.add('visually-hidden');
      }
      gallery.refresh();
    } catch (error) {
      console.log(error);
      Notiflix.Notify.warning('Something went wrong. Please try again!');
    }
    event.target.reset();
  }
  
  async function handleLoadMoreClick(event) {
    pixabay.incrementPage();
  
    const showMore = pixabay.hasMorePhotos();
  
    if (!showMore) {
      loadMoreBtn.classList.add('visually-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  
    try {
      const { hits } = await pixabay.getPhotos();
      const markup = renderMarkup(hits);
      galleryEl.insertAdjacentHTML('beforeend', markup);
  
      gallery.refresh();
    } catch (error) {
      Notiflix.Notify.warning('Something went wrong. Please try again!');
    }
  }
  
  formEl.addEventListener('submit', handleSubmit);
  loadMoreBtn.addEventListener('click', handleLoadMoreClick);