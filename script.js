document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});


const notFinishedBook = document.getElementById('book-list');
const finishedBook = document.getElementById('completed-book');


function addBook(){
    const titleInput = document.getElementById('title').value;
    const yearInput = document.getElementById('yearBook').value;
    const writerInput = document.getElementById('writer').value;
    const generatedId = generateId();
    const bookObject = generateBookObject(generatedId, titleInput, yearInput, writerInput, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, tittle, year, writer, isCompleted){
    return{
        id,
        tittle,
        year,
        writer,
        isCompleted
    }
}

const books = [];
const RENDER_EVENT = 'render-book';

function makeBook(bookObject){
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.tittle;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${bookObject.year}`;

    const textWriter = document.createElement('p');
    textWriter.innerText =`Penulis: ${bookObject.writer}`;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner')
    textContainer.append(textTitle, textYear, textWriter);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow')
    container.append(textContainer);
    container.setAttribute('id', `todo-${bookObject.id}`);

    if(bookObject.isCompleted){
        const undoButton = document.createElement('i');
        undoButton.classList.add("fa-solid", "fa-repeat", 'undo-button');
        undoButton.addEventListener('click', function(){
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('i');
        trashButton.classList.add("fa-solid", "fa-trash", 'trash-button');

        trashButton.addEventListener('click', function(){
            trashBookFromCompleted(bookObject.id);
        })

        container.append(undoButton, trashButton);
    } else{
        const checkButton = document.createElement('i');
        checkButton.classList.add("fa-solid", "fa-circle-check", 'check-button');

        checkButton.addEventListener('click', function(){
            addBookToComplete(bookObject.id);
        })

        container.append(checkButton)
    }

    return container;
}

document.addEventListener(RENDER_EVENT, function(){
    const unfinishedBook = document.getElementById('book-list');
    unfinishedBook.innerText = '';

    const finishedBook = document.getElementById('completed-book');
    finishedBook.innerText = '';

    for(const bookItem of books){
        const bookElement = makeBook(bookItem);
        if(!bookItem.isCompleted){
            unfinishedBook.append(bookElement);
        }
        else{
            finishedBook.append(bookElement);
        }
    }
})

function addBookToComplete(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget === null ) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}

function findBook(bookId){
    for(const bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }

    return null;
}

function trashBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}


function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
        return index;
        }
    }

    return -1;
}

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(KEY_STORAGE, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-books';
const KEY_STORAGE = 'bookshelf-apps';

function isStorageExist(){
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(KEY_STORAGE))
});

function loadDataFromStorage(){
    const getData = localStorage.getItem(KEY_STORAGE);
    let data = JSON.parse(getData);

    if(data !== null){
        for(const book of data){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

const searchFeature = document.getElementById("search-feature");
searchFeature.addEventListener("input", function () {
    const title = document.getElementById('search-feature').value.toLowerCase();
    const allBookTitle = document.querySelectorAll('.item > .inner h2');
    for (const book of allBookTitle) {
        if(book.innerText.toLowerCase().includes(title)){
            book.parentElement.style.display = "block";
        } else {
            book.parentElement.style.display = "none";
        }
    }
});

const checkBox = document.getElementById('checkBox');
checkBox.addEventListener('input', function(){
    for(const book of books){
        if(checkBox.setAttribute = 'checked'){
            book.isCompleted = 'true'
        }else{
            book.isCompleted = 'false'
        }
    }
    return;
})