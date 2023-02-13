import axios from "axios";

export class PixabayAPI {
    #page = 1;
    #per_page = 40;
    #query = '';
    #totalPhotos = 0;

   async getPhotos() {
        const params = {
            key: '33273264-8cef788596cbe82d545eecd40',
            q: this.#query,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: this.#per_page,
            page: this.#page,
        };
        axios.defaults.baseURL = 'https://pixabay.com';
        const { data } = await axios.get(`/api/?`, { params });
        return data;
    };

    get query() {
        return this.query;
    }

    set query(newQuery) {
        this.#query = newQuery;
    }

    incrementPage() {
        this.#page += 1;
    }

    resetPage() {
        this.#page = 1;
    }

    get totalPhotos() {
        return this.#totalPhotos;
    }

    set totalPhotos(newTotal) {
        this.#totalPhotos = newTotal;
    }

    hasMorePhotos() {
        return this.#page < Math.ceil(this.#totalPhotos / this.#per_page);
    }
}
