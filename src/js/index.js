import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

import { ApiService } from './api.js';

const refs = {
  searchFormRef: document.querySelector('#search-form'),
  submitRefs: document.querySelector('#search-form button'),
  cardsConteinerRef: document.querySelector('.gallery'),
  loadMoreRef: document.querySelector('.load-more'),
};
const { searchFormRef, submitRefs, cardsConteinerRef, loadMoreRef } = refs;
const apiService = new ApiService();
// const lightbox = new SimpleLightbox('.gallery gellery-link');

submitRefs.disabled = true;
loadMoreRef.classList.add('is-hidden');

//Слушатели
searchFormRef.addEventListener('submit', onSubmit);
loadMoreRef.addEventListener('click', onLoadMore);
searchFormRef.addEventListener('input', e => {
  if (e.currentTarget.elements.searchQuery.value) {
    submitRefs.disabled = false;
  }
});

async function onSubmit(e) {
  e.preventDefault();

  apiService.query = e.currentTarget.elements.searchQuery.value;
  apiService.resetPage();

  if (apiService.query === '') {
    return;
  }

  try {
    const result = await apiService.fetchInPixabay(apiService.query);

    if (result.length === 0) {
      apiService.query = '';
      loadMoreRef.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    clearCardsConteiner();
    loadMoreRef.classList.remove('is-hidden');
    result.map(card => appendCardsMarkup(card)).join('');
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore(e) {
  try {
    const result = await apiService.fetchInPixabay(apiService.query);

    if (result.length === 0) {
      loadMoreRef.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );

      return;
    }
    result.map(card => appendCardsMarkup(card)).join('');
    console.log(result.hits);
  } catch (error) {
    console.log(error);
  }
}

function appendCardsMarkup(card) {
  submitRefs.disabled = true;
  const template = createCardTemplate(card);
  refs.cardsConteinerRef.insertAdjacentHTML('beforeend', template);
}

function createCardTemplate(card) {
  return `
    <div class='photo-card'>
   <a class='gellery-link' href="#"> <img class='card-img' src='${card.webformatURL}' alt='${card.tags}'  loading='lazy' /></a>
      <div class='info'>

        <p class='info-item'>
          <b>Likes: </b><br>
          ${card.likes}
        </p>

        <p class='info-item'>
          <b>Views: </b><br>
          ${card.views}
        </p>

        <p class='info-item'>
          <b>Comments: </b><br>
          ${card.comments}
        </p>

        <p class='info-item'>
        <b>Downloads: </b><br>
        ${card.downloads}
        </p>
      </div>
    </div>
  `;
}

function clearCardsConteiner() {
  cardsConteinerRef.innerHTML = '';
}
