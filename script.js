document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    });
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
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function(){
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function(){
            trashTaskFromCompleted(bookObject.id);
        })
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
            unfinishedBookfinishedBook.append(bookElement);
        }else{
            finishedBook.append(bookElement);
        }
    }
})



