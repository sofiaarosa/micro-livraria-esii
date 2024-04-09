function newBook(book) {
    const div = document.createElement('div');
    div.className = 'column is-4';
    div.innerHTML = `
        <div class="card is-shady">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img
                        src="${book.photo}"
                        alt="${book.name}"
                        class="modal-button"
                    />
                </figure>
            </div>
            <div class="card-content">
                <div class="content book" data-id="${book.id}">
                    <div class="book-meta">
                        <p class="is-size-4">R$${book.price.toFixed(2)}</p>
                        <p class="is-size-6">Disponível em estoque: 5</p>
                        <h4 class="is-size-3 title">${book.name}</h4>
                        <p class="subtitle">${book.author}</p>
                    </div>
                    <div class="field has-addons">
                        <div class="control">
                            <input class="input" type="text" placeholder="Digite o CEP" />
                        </div>
                        <div class="control">
                            <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
                        </div>
                    </div>
                    <button class="button button-buy is-success is-fullwidth">Comprar</button>
                </div>
            </div>
        </div>`;
    return div;
}

function calculateShipping(id, cep) {
    fetch('http://localhost:3000/shipping/' + cep)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success');
        })
        .catch((err) => {
            swal('Erro', 'Erro ao consultar frete', 'error');
            console.error(err);
        });
}

const books = document.querySelector('.books');

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/products')
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                data.forEach((book) => {
                    books.appendChild(newBook(book));
                });

                document.querySelectorAll('.button-shipping').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id');
                        const cep = document.querySelector(`.book[data-id="${id}"] input`).value;
                        calculateShipping(id, cep);
                    });
                });

                document.querySelectorAll('.button-buy').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
                    });
                });
            }
        })
        .catch((err) => {
            swal('Erro', 'Erro ao listar os produtos', 'error');
            console.error(err);
        });
});


//funct: find book by id

const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const resultsDiv = document.querySelector('#search-results');

searchButton.addEventListener('click', () => {
    const search = searchInput.value;
    console.log('searching...'+ search);
    fetch('http://localhost:3000/product/' + search)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            resultsDiv.innerHTML = '<h1 class="title is-4">Resultado das Buscas</h1>';
            if (data) {
                result = newBook(data);
                resultsDiv.appendChild(result);

                document.querySelectorAll('.button-shipping').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id');
                        const cep = document.querySelector(`.book[data-id="${id}"] input`).value;
                        calculateShipping(id, cep);
                    });
                });

                document.querySelectorAll('.button-buy').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
                    });
                });
            }
        })
        .catch((err) => {
            swal('Erro', 'Não foi possível encontrar livro com o id pesquisado', 'error');
            console.error(err);
            resultsDiv.innerHTML = '';
        });
});

//funct: add book

const addbookButton = document.querySelector('#addbook-link');
const backButton = document.querySelector('#back-link');
const addbookForm = document.querySelector('#addbook-form');

addbookButton.addEventListener('click', () => {
    addbookForm.style.display = 'block';
    books.style.display = 'none';
    addbookButton.style.display = 'none';
    backButton.style.display = 'block';
    resultsDiv.innerHTML = '';
    searchInput.value = '';

});

backButton.addEventListener('click', () => {
    addbookForm.style.display = 'none';
    books.style.display = 'flex';
    addbookButton.style.display = 'block';
    backButton.style.display = 'none';
});

const registerButton = document.querySelector('#register-button');
registerButton.addEventListener('click', () => {
    const id = document.querySelector('#id').value;
    const name = document.querySelector('#title').value;
    const qtt = document.querySelector('#quantity').value;
    const author = document.querySelector('#author').value;
    const price = document.querySelector('#price').value;
    const image = document.querySelector('#image').files[0];

    console.log(image)

    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('quantity', qtt);
    formData.append('author', author);
    formData.append('price', price);
    formData.append('image', image);

    fetch('http://localhost:3000/add', {
        method: 'POST',
        enctype: 'multipart/form-data',
        body: formData,
    })
    .then((response) => {
        if (response.ok) {
            swal('Livro Adicionado', 'Livro adicionado com sucesso', 'success').then(() => {
                location.reload();
            });
        } else {
            swal('Erro', 'Erro ao adicionar livro', 'error');
        }
    })
    .catch((err) => {
        swal('Erro', 'Erro ao adicionar livro', 'error');
        console.error(err);
    });

    // fetch('http://localhost:3000/add/'+id+'/'+name+'/'+qtt+'/'+price+'/'+author+'/', {method: 'PUT'}).then((response)=>{
    //     if(response.ok){
    //         swal('Livro Adicionado', 'Livro adicionado com sucesso', 'success').then(()=>{
    //             location.reload();   
    //         });
    //     }else{
    //         swal('Erro', 'Erro ao adicionar livro', 'error');
    //     }
    // }).catch((err) => {});

}); 
