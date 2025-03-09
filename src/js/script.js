//import { render } from "sass";

{
  'use strict';

  class BooksList {
    constructor() {
      this.favoriteBooks = [];
      this.filters = [];
      this.initData();
      this.getElements();
      this.renderBooks();
      this.initActions();
    }

    initData() {
      this.data = dataSource.books;
    }

    getElements() {
      this.booksList = document.querySelector('.books-list');
      this.filtersForm = document.querySelector('section.filters');
      this.template = Handlebars.compile(document.querySelector('#template-book').innerHTML);
    }

    renderBooks() {
      for (let book of this.data) {
        const ratingWidth = book.rating * 10 + '%',
          ratingBgc = this.determineRatingBgc(book.rating);

        book.ratingWidth = ratingWidth;
        book.ratingBgc = ratingBgc;

        const bookHTML = this.template(book),
          bookElementDom = utils.createDOMFromHTML(bookHTML);
        this.booksList.appendChild(bookElementDom);
      }
    }

    determineRatingBgc(rating) {
      if (rating < 6) {
        return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else {
        return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
      }
    }

    initActions() {
      this.booksList.addEventListener('dblclick', (event) => {
        event.preventDefault();

        const clickedElement = event.target.offsetParent;

        if (clickedElement && clickedElement.classList.contains('book__image')) {
          const bookId = clickedElement.getAttribute('data-id');

          if (this.favoriteBooks.includes(bookId)) {
            this.favoriteBooks.splice(this.favoriteBooks.indexOf(bookId), 1);
            clickedElement.classList.remove('favorite');
          } else {
            this.favoriteBooks.push(bookId);
            clickedElement.classList.add('favorite');
          }

          console.log('Ulubione książki:', this.favoriteBooks);
        }
      });

      this.filtersForm.addEventListener('click', (event) => {
        const clickedElement = event.target;
        if (clickedElement.tagName === 'INPUT' &&
                    clickedElement.type === 'checkbox' &&
                    clickedElement.name === 'filter') {
          const filtersValue = event.target.value;
          if (clickedElement.checked) {
            this.filters.push(filtersValue);
          }
          else {
            this.filters.splice(this.filters.indexOf(filtersValue), 1);
          }
        }
        console.log('Wybrane filtry:', this.filters);
        this.filterBooks();
      });
    }

    filterBooks() {
      for (let book of this.data) {
        let shouldBeHidden = false;
        for (let filter of this.filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        const bookImage = document.querySelector('.book__image[data-id="' + book.id + '"]');
        if (bookImage) {
          if (shouldBeHidden) {
            bookImage.classList.add('hidden');
          } else {
            bookImage.classList.remove('hidden');
          }
        }
      }
    }
  }

  const app = new BooksList();
  app.init();



}
