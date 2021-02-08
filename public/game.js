class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBook(book) {
    // console.log(book);
    const bookList = document.getElementById('book-list');
    const row = document.createElement('tr');
    
    row.innerHTML += `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</td>
      `;
    bookList.appendChild(row);
  }

  showAlert(msg, className) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className}`;
    alertDiv.appendChild(document.createTextNode(msg));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    // insert alert
    container.insertBefore(alertDiv, form);
    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 3000)
    
  }

  clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

  removeBook(target) {
    if(target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }
}

// Local Storage Class
class Store {

  static getBooks() {
    let books;
    if(!localStorage.getItem('books')) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => {
      const ui = new UI;
      ui.addBook(book);
    })
  }

  static addBook(book) {
    let books = Store.getBooks()
    books = [...books, book];
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    let books = Store.getBooks();
    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
        console.log('book to remove ' + book.isbn);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Dome Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listeners for add book
document.getElementById('book-form').addEventListener('submit', function(e){
  // Get form values
  const title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;

  const book = new Book(title, author, isbn);

  const ui = new UI;

  // Validate
  if(title === '' || author === '' || isbn === '') {
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    ui.addBook(book);
    Store.addBook(book);
    ui.showAlert('Book was added to list', 'success');
    ui.clearFields();
  }
  e.preventDefault();

});

document.querySelector('#book-list').addEventListener('click', function(e) {
  const ui = new UI;
  ui.removeBook(e.target);
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  ui.showAlert('Book was removed', 'success');
  e.preventDefault();
});

