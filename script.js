// let books = [
//     {title: "Flowers for Algernon", author: "Daniel Kiz", genre: "tragedy", price: 200, image: "media/1.png"},
//     {title: "1984", author: "George Orwell", genre: "distopia", price: 300, image: "media/1.png"},
//     {title: "Game of Thrones", author: "George RR Martin", genre: "fantasy", price: 100, image: "media/1.png"},
//     {title: "Lord of the Rings", author: "George RR Tolkien", genre: "fantasy", price: 400, image: "media/1.png"},
//     {title: "Hamlet", author: "William Shakespear", genre: "tragedy", price: 300, image: "media/1.png"},
//     {title: "451 Ferenheit", author: "Rey Bradbury", genre: "distopia", price: 200, image: "media/1.png"},
//     {title: "Julius Ceaser", author: "William Shakespear", genre: "tragedy", price: 100, image: "media/1.png"}
// ]

let searchInput = document.getElementById("search-input");
let categorySelect = document.getElementById("category-select");
let sortSelect = document.getElementById("sorting-select");
let loginButton = document.getElementById("login");
let addItemButton = document.getElementById("add-item");
let token = "";

fetchBooks();

async function fetchBooks(){
    try{
        let response = await fetch("https://backend-for-students-production.up.railway.app/api/items")
        .then(res => res.json()).then(data => {
            books = data;
            loadBooks();
        })
        .catch(err => console.log(err));
    } catch(err){
        console.log(err);
    }
}

async function loadBooks(){
    let cardContainer = document.getElementById("cards");
    cardContainer.innerHTML = "";

    let booksToDisplay = books;

    if(searchInput.value){
        booksToDisplay = books.filter(b => 
            b.title.toLowerCase().includes(searchInput.value.toLowerCase())
        || b.author.toLowerCase().includes(searchInput.value.toLowerCase()));
    }

    if(categorySelect.value != "all"){
        booksToDisplay = booksToDisplay.filter(b => b.genre == categorySelect.value);
    }
    
    if(sortSelect.value === "asc"){
        booksToDisplay = booksToDisplay.sort((a, b) => a.price - b.price);
    }

    if(sortSelect.value === "desc"){
        booksToDisplay = booksToDisplay.sort((a, b) => b.price - a.price);
    }

    if(sortSelect.value === "name"){
        booksToDisplay = booksToDisplay.sort((a, b) => a.name.localeCompare(b.name));
    }

    booksToDisplay.forEach(b => {
        let card = document.createElement("div");
        card.className = "card";

        let title = document.createElement("h3");
        title.innerText = b.name;

        let image = document.createElement("img");
        image.src = "media/1.png";

        let author = document.createElement("p");
        author.innerText = b.description;

        let price = document.createElement("p");
        price.innerText = `Price: ${b.price} hryven`;

        card.appendChild(title);
        card.appendChild(image);
        card.appendChild(author);
        card.appendChild(price);

        cardContainer.appendChild(card);
    });
}

async function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    try {
        let response = await fetch("https://backend-for-students-production.up.railway.app/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        }).then(res => res.json()).then(data => {
            token = data.token;
            console.log("Login successful");
        });
    }
    catch(err){
        console.log(err);
    }
}

async function addItem() {
    let name = document.getElementById("new-name").value;
    let description = document.getElementById("new-description").value;
    let price = document.getElementById("new-price").value;

    try {
        let response = await fetch("https://backend-for-students-production.up.railway.app/api/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, description, price })
        }).then(res => res.json()).then(data => {
            console.log("Item added successfully:", data);
            fetchBooks(); // Refresh the book list after adding a new item
        });
    }
    catch(err){
        console.log(err);
    }
}    


searchInput.addEventListener("input", loadBooks);
categorySelect.addEventListener("change", loadBooks);
sortSelect.addEventListener("change", loadBooks);
loginButton.addEventListener("click", login);
addItemButton.addEventListener("click", addItem);




// other urls:
// register: https://backend-for-students-production.up.railway.app/api/register
// get by id: https://backend-for-students-production.up.railway.app/api/items/:id