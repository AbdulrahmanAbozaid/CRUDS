"use strict";
/* ======================== VARIABLES ============================== */
let title = document.querySelector('#title'),
    price = document.querySelector('#price'),
    taxes = document.querySelector('#taxes'),
    ads = document.querySelector('#ads'),
    discount = document.querySelector('#discount'),
    total = document.querySelector('#total'),
    count = document.querySelector('#count'),
    category = document.querySelector('#category'),
    create = document.querySelector('#create'),
    searchTitle = document.querySelector('#search-title'),
    searchCategory = document.querySelector('#search-category'),
    versionModeCreate = true,
    ghostIndex;


/* ============== total ================== */
let ptsCol = document.querySelectorAll('.cruds__body-price>input');
ptsCol.forEach(pt => {
    pt.addEventListener('input', getTotal);
});

function getTotal() {
    if (price.value !== '') {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = '#880';
    } else {
        total.innerHTML = null;
        total.style.background = '#720910';
    };
};

/* ============== create product ================== */
let dataProds;
if (localStorage.progData != null) {
    dataProds = JSON.parse(localStorage.progData);
    showData();
} else {
    dataProds = [];
};


create.addEventListener('click', createProduct);

function createProduct() {
    let newProd = {
        title: title.value.toLowerCase(),
        price: +price.value,
        taxes: +taxes.value,
        ads: +ads.value,
        discount: +discount.value,
        total: +total.innerHTML,
        count: +count.value,
        category: category.value.toLowerCase(),
    };

    if (title.value && price.value && 100 >= count.value && category.value) {
        //create products
        if (versionModeCreate === true) {
            if (newProd.count > 1) {
                for (let i = 0; i < newProd.count; i++) {
                    dataProds.push(newProd);
                };
            } else {
                dataProds.push(newProd);
            };
        } else {
            dataProds[ghostIndex] = newProd;
            //Mode
            versionModeCreate = true;
            //stylings
            count.style.display = 'block';
            create.innerHTML = 'create';
            create.style.backgroundColor = '#183059';
        };
        //clear inputs
        clearInputs(title, price, taxes, ads, discount, category, count);
    } else {
        alert('please enter VALID data');
    };

    //save to localStorage
    localStorage.setItem('progData', JSON.stringify(dataProds));



    //show data
    showData();
};

/* ============== clear inputs ================== */
function clearInputs(...vals) {
    vals.forEach(val => val.value = null);
    getTotal();
};

/* ============== read ================== */
function showData() {
    let tbody = document.querySelector('#table-body');
    tbody.innerHTML = null;

    dataProds.forEach((pro, i) => {
        let row = `
        <tr>
            <td>${++i}</td>
            <td>${pro['title']}</td>
            <td>${pro['price']}</td>
            <td>${pro['taxes']}</td>
            <td>${pro['ads']}</td>
            <td>${pro['discount']}</td>
            <td>${pro['total']}</td>
            <td>${pro['category']}</td>
            <td><button onclick="updateItem(${i})" id="update" class="button button-red">update</button></td>
            <td><button onclick="deleteItem(${i})" id="${i}" class="button button-red">delete</button></td>
        </tr>
        `;
        tbody.innerHTML += row;
    });

    //DELETE ALL
    let delCont = document.querySelector('#delete-all');
    if (dataProds.length) {
        delCont.innerHTML = `<button onclick="deleteAll()" class="button button-delete">Delete all (${dataProds.length})</button>`;
    } else {
        delCont.innerHTML = null;
    };
};

/* ============== delete ================== */
function deleteItem(id) {
    if (dataProds) {
        dataProds.splice(id - 1, 1);
        localStorage.progData = JSON.stringify(dataProds);
        showData();
    };
};

function deleteAll() {
    localStorage.clear();
    dataProds.splice(0);
    showData();
};

/* ============== update ================== */
function updateItem(id) {
    //Mode
    versionModeCreate = false;
    //vars
    ghostIndex = id - 1;
    let upItem = dataProds[id - 1];
    let { title: ti, price: pc, taxes: ta, ads: ad, discount: dc, category: ct } = upItem;

    //setting input
    title.value = ti;
    price.value = pc;
    taxes.value = ta;
    ads.value = ad;
    discount.value = dc;
    category.value = ct;

    //get total price 
    getTotal();

    //stylings
    count.style.display = 'none';
    create.innerHTML = 'UPDATE';
    create.style.backgroundColor = '#a2091084';

    //scrollTop
    window.scroll({
        top: 0,
        behavior: "smooth",
    });
};



/* ============== search ================== */
let searchInput = document.querySelector('#searchInput');
let searchMode = "title";

[searchCategory, searchTitle].forEach(function(item) {
    item.addEventListener('click', function() {
        searchState(this.id);
    });
});

searchInput.addEventListener("keyup", function() {
    searchFn(this.value);
});


function searchState(id) {
    if (id === "search-title") {
        searchMode = "title";
    } else {
        searchMode = "category";
    };

    searchInput.placeholder = "Search By " + searchMode;

    //autofocus
    searchInput.focus();
    searchInput.value = null;
    searchFn(searchInput.value);
};

function searchFn(val) {
    val = val.toLowerCase();
    let table = ``;


    for (let i = 0; i < dataProds.length; i++) {
        if (searchMode === "title") {
            if (dataProds[i].title.includes(val)) {
                table += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${dataProds[i]['title']}</td>
                        <td>${dataProds[i]['price']}</td>
                        <td>${dataProds[i]['taxes']}</td>
                        <td>${dataProds[i]['ads']}</td>
                        <td>${dataProds[i]['discount']}</td>
                        <td>${dataProds[i]['total']}</td>
                        <td>${dataProds[i]['category']}</td>
                        <td><button onclick="updateItem(${i})" id="update" class="button button-red">update</button></td>
                        <td><button onclick="deleteItem(${i})" id="${i}" class="button button-red">delete</button></td>
                    </tr>
                    `;
            };

        } else {
            if (dataProds[i].category.includes(val)) {
                table += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${dataProds[i]['title']}</td>
                        <td>${dataProds[i]['price']}</td>
                        <td>${dataProds[i]['taxes']}</td>
                        <td>${dataProds[i]['ads']}</td>
                        <td>${dataProds[i]['discount']}</td>
                        <td>${dataProds[i]['total']}</td>
                        <td>${dataProds[i]['category']}</td>
                        <td><button onclick="updateItem(${i})" id="update" class="button button-red">update</button></td>
                        <td><button onclick="deleteItem(${i})" id="${i}" class="button button-red">delete</button></td>
                    </tr>
                    `;
            };
        };
    };

    document.querySelector('#table-body').innerHTML = table;
};