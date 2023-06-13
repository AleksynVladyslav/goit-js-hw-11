import axios from 'axios';

const BASE_KEY = 'key=29399039-4460efa4eda80960e71e08ca2';
const URL = 'https://pixabay.com/api/?';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchInPixabay(query) {
    try {
      const response = await axios.get(
        `${URL}${BASE_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`
      );

      const data = response.data;
      // this.incrementPage();

      return data;
    } catch (error) {
      throw new Error(error.message);
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
