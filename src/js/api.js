import axios from 'axios';

export { ApiService };
const BASE_KEY = 'key=29399039-4460efa4eda80960e71e08ca2';
const URL = 'https://pixabay.com/api/?';

class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchInPixabay(query) {
    try {
      const response = await axios.get(
        `${URL}${BASE_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`
      );

      const data = await response.data;
      this.incrementPage();

      const dt = data.totalHits % this.perPage;
      if (dt != 0) {
        this.perPage = dt;
      }

      return data;
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
