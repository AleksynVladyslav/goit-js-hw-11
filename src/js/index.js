import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ApiService from './api.js';

const refs = {
  searchFormRef: document.querySelector('#search-form'),
  submitRefs: document.querySelector('#search-form button'),
  cardsConteinerRef: document.querySelector('.gallery'),
  loadMoreRef: document.querySelector('.load-more'),
};
const { searchFormRef, submitRefs, cardsConteinerRef, loadMoreRef } = refs;
//Экземпляр класса из файла api.js
const apiService = new ApiService();

//Экземпляр SimpleLightbox
const lightbox = new SimpleLightbox('.gallery .gallery__link', {
  captionPosition: 'bottom',
  captionsData: 'alt',
  captionDelay: 250,
});

//Отображение кнопки Load More
const displayLoadMore = {
  invisibly: () => loadMoreRef.classList.add('is-hidden'),
  visibly: () => loadMoreRef.classList.remove('is-hidden'),
};
//Состояние кнопки Submit
const submitState = {
  disabled: () => {
    submitRefs.disabled = true;
  },
  enabled: () => {
    submitRefs.disabled = false;
  },
};

submitState.disabled();
displayLoadMore.invisibly();

//Слушатели событий
searchFormRef.addEventListener('submit', onSubmit);
loadMoreRef.addEventListener('click', onLoadMore);
searchFormRef.addEventListener('input', onInputValidation);

function onInputValidation(e) {
  const searchValue = e.currentTarget.elements.searchQuery.value;
  const newValue = searchValue.trim();
  displayLoadMore.invisibly();
  clearCardsConteiner();
  if (newValue) {
    submitState.enabled();
  }
}

async function onSubmit(e) {
  e.preventDefault();

  apiService.query = e.currentTarget.elements.searchQuery.value;
  apiService.resetPage();

  try {
    const result = await apiService.fetchInPixabay(apiService.query);

    if (result.hits.length === 0) {
      clearCardsConteiner();
      apiService.query = '';
      displayLoadMore.invisibly();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    clearCardsConteiner();
    result.hits.map(card => appendCardsMarkup(card)).join('');
    if (result.totalHits < apiService.perPage) {
      return lastPageCheck();
    }

    displayLoadMore.visibly();
  } catch (error) {
    console.log(error);
  }
  lightbox.refresh();
}

async function onLoadMore(e) {
  try {
    const result = await apiService.fetchInPixabay(apiService.query);

    // const totalPages = Math.ceil(result.totalHits / apiService.perPage);
    // if (apiService.page === totalPages) {
    //   const remainder = result.totalHits % apiService.perPage;
    //   apiService.perPage = remainder || apiService.perPage;
    //   lastPageCheck();
    // }
    if (
      result.totalHits <=
      (apiService.page - 1) * apiService.perPage + result.hits.length
    ) {
      return lastPageCheck();
    }

    for (let i = 0; i < result.hits.length; i++) {
      appendCardsMarkup(result.hits[i]);
    }
  } catch (error) {
    console.log(error);
  }
  lightbox.refresh();
}

//Действие на последнюю страницу
function lastPageCheck() {
  displayLoadMore.invisibly();
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}

//Добавление разметки в DOM
function appendCardsMarkup(card) {
  submitState.disabled();
  const template = createCardTemplate(card);
  refs.cardsConteinerRef.insertAdjacentHTML('beforeend', template);
}

//Разметка карточек
function createCardTemplate({
  largeImageURL,
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
  <a class='gallery__link' href="${largeImageURL}">
    <div class='photo-card'>
    <img class='card-img' src='${webformatURL}' alt='${tags}'  loading='lazy' />
      <div class='info'>
      
        <p class='info-item'>
          <b>Likes: </b><br>
          ${likes}
        </p>

        <p class='info-item'>
          <b>Views: </b><br>
          ${views}
        </p>

        <p class='info-item'>
          <b>Comments: </b><br>
          ${comments}
        </p>

        <p class='info-item'>
        <b>Downloads: </b><br>
        ${downloads}
        </p>
      </div>
      
    </div>
    </a>
  `;
}
//Очистка контейнера
function clearCardsConteiner() {
  cardsConteinerRef.innerHTML = '';
}
