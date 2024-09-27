let title = document.getElementById("title");

let price = document.getElementById("price");
let tax = document.getElementById("tax");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.querySelector(".total");

let count = document.getElementById("count");
let category = document.getElementById("category");
let createBtn = document.querySelector(".create");

let search = document.getElementById("search");
let titleSearch = document.querySelector(".by-title");
let catSearch = document.querySelector(".by-category");

let globalMode = "create";
let searchMode = "title";
let temp;

document.querySelectorAll(".price input").forEach((input) => {
  input.addEventListener("input", getTotalPrice);
});

// Get Total Price
function getTotalPrice() {
  if (price.value !== "") {
    total.innerHTML = +price.value + +tax.value + +ads.value - +discount.value;
    total.style.backgroundColor = "#3f51b5";
  } else {
    total.style.backgroundColor = "red";
    total.innerHTML = "";
  }
}

// Create Product
let productsList = [];

if (localStorage.getItem("products")) {
  productsList = JSON.parse(localStorage.getItem("products"));
}

createBtn.onclick = function () {
  createProduct();
  setDataToLocalStorage(productsList);
  getTotalPrice();
};

// Create New Product
function createProduct() {
  const product = {
    title: title.value,
    price: price.value,
    tax: tax.value || 0,
    ads: ads.value || 0,
    discount: discount.value || 0,
    total: total.innerHTML,
    count: count.value,
    category: category.value,
  };
  if (globalMode === "create") {
    if (
      title.value !== "" &&
      price.value != "" &&
      category.value !== "" &&
      count.value < 100
    ) {
      if (product.count > 1) {
        for (let i = 0; i < product.count; i++) {
          productsList.push(product);
        }
      } else {
        productsList.push(product);
      }
      clearData();
      showProducts();
    }
  } else {
    productsList[temp] = product;
    count.style.display = "block";
    createBtn.innerHTML = "Create";
    globalMode = "create";
  }
}

// Set Data To Local Storage
function setDataToLocalStorage(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

// Clear Inputs Values
function clearData() {
  document.querySelectorAll(".inputs input").forEach((input) => {
    input.value = "";
  });
  total.innerHTML = "";
}

// Show Products On Page
function showProducts() {
  document.querySelector("table tbody").innerHTML = "";
  for (let i = 0; i < productsList.length; i++) {
    document.querySelector("table tbody").innerHTML += `<tr>
    <td>${i}</td>
    <td>${productsList[i].title}</td>
    <td>${productsList[i].price}</td>
    <td>${productsList[i].tax}</td>
    <td>${productsList[i].ads}</td>
    <td>${productsList[i].discount}</td>
    <td>${productsList[i].total}</td>
    <td>${productsList[i].category}</td>
    <td><span class="btn update" onclick = "UpdateProduct(${i})">Update</span></td>
    <td><span class="btn delete" onclick = "deleteProduct(${i})" >Delete</span></td>
  </tr>`;
  }
  productsList.forEach((product) => {});

  if (productsList.length) {
    document.querySelector(
      ".results > div"
    ).innerHTML = `<span class="btn delete-all">Delete All (${productsList.length})</span>`;
    document.querySelector(".results > div .delete-all").onclick = deleteAll;
  } else {
    document.querySelector(".delete-all").remove();
  }
}

// Delete Product
function deleteProduct(proId) {
  productsList.splice(proId, 1);
  setDataToLocalStorage(productsList);
  showProducts();
}

// Delete All Products
function deleteAll() {
  productsList = [];
  localStorage.removeItem("products");
  showProducts();
}

// Update Product Data
function UpdateProduct(proId) {
  title.value = productsList[proId].title;
  price.value = productsList[proId].price;
  tax.value = productsList[proId].tax;
  ads.value = productsList[proId].ads;
  discount.value = productsList[proId].discount;
  category.value = productsList[proId].category;
  count.style.display = "none";
  getTotalPrice();
  createBtn.innerHTML = "Update";
  globalMode = "update";
  temp = proId;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// Search For Product(s)
document.querySelectorAll(".search-methods .btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    getSearchMode(btn);
  });
});

function getSearchMode(btn) {
  if (btn.classList.contains("by-title")) {
    searchMode = "title";
  } else {
    searchMode = "category";
  }
  search.focus();
  search.placeholder = `Search By ${
    searchMode[0].toUpperCase() + searchMode.slice(1)
  }`;
  search.value = "";
  showProducts();
}

search.oninput = function () {
  searchForProducts(this.value);
};

function searchForProducts(value) {
  document.querySelector("table tbody").innerHTML = "";
  for (let i = 0; i < productsList.length; i++) {
    if (searchMode === "title") {
      if (productsList[i].title.toLowerCase().includes(value.toLowerCase())) {
        document.querySelector("table tbody").innerHTML += `<tr>
          <td>${i}</td>
          <td>${productsList[i].title}</td>
          <td>${productsList[i].price}</td>
          <td>${productsList[i].tax}</td>
          <td>${productsList[i].ads}</td>
          <td>${productsList[i].discount}</td>
          <td>${productsList[i].total}</td>
          <td>${productsList[i].category}</td>
          <td><span class="btn update" onclick = "UpdateProduct(${i})">Update</span></td>
          <td><span class="btn delete" onclick = "deleteProduct(${i})" >Delete</span></td>
        </tr>`;
      }
    } else {
      if (
        productsList[i].category.toLowerCase().includes(value.toLowerCase())
      ) {
        document.querySelector("table tbody").innerHTML += `<tr>
        <td>${i}</td>
        <td>${productsList[i].title}</td>
        <td>${productsList[i].price}</td>
        <td>${productsList[i].tax}</td>
        <td>${productsList[i].ads}</td>
        <td>${productsList[i].discount}</td>
        <td>${productsList[i].total}</td>
        <td>${productsList[i].category}</td>
        <td><span class="btn update" onclick = "UpdateProduct(${i})">Update</span></td>
        <td><span class="btn delete" onclick = "deleteProduct(${i})" >Delete</span></td>
      </tr>`;
      }
    }
  }
}
