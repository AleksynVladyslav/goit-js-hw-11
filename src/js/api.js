import axios from 'axios';
// import Notiflix from 'notiflix';

export { ApiService };
const BASE_KEY = 'key=29399039-4460efa4eda80960e71e08ca2';
const URL = 'https://pixabay.com/api/?';

class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchInPixabay() {
    try {
      const response = await axios.get(
        `${URL}${BASE_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      );

      const data = await response.data;
      this.incrementPage();
      return data.hits;
    } catch (error) {
      console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
