const productList = document.querySelector("#products");
const addProductForm = document.querySelector("#add-product-form");
const cardUpdateForm = document.querySelector("aside");
const updateProductForm = document.querySelector("#updateForm");

const API_URL = "http://localhost";

window.addEventListener("load", async () => {
  await fetchProducts();
});

// Function to fetch all products from the server
async function fetchProducts() {
  const call = await fetch(`${API_URL}:3000/products`);
  const { response: products } = await call.json();

  // Clear product list
  productList.innerHTML = "";

  // Add each product to the list
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `${product.name} - R$ ${product.price}`;

    // Add delete button for each product
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.style.background = "#ff0000";
    deleteButton.addEventListener("click", async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });

    // Add update button for each product
    const updateButton = document.createElement("button");
    updateButton.innerHTML = "Editar";
    updateButton.addEventListener("click", () => {
      cardUpdateForm.style.display = "block";
      const { id, name, description, price } = product;
      updateProductForm.reset();

      updateProductForm.elements["name"].value = name;
      updateProductForm.elements["price"].value = price;
      updateProductForm.elements["description"].value = description;

      updateProductForm.addEventListener("submit", async (event) => {

        let name_up = updateProductForm.elements["name"].value;
        let price_up = updateProductForm.elements["price"].value;
        let description_up = updateProductForm.elements["description"].value;

        cardUpdateForm.style.display = "none";
        await updateProduct( id, name_up, description_up, price_up);
        await fetchProducts();
      });
    });

    const div = document.createElement("div");
    div.append(deleteButton, updateButton);

    li.appendChild(div);
    productList.appendChild(li);
  });
}

// Event listener for Add Product form submit button
addProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = addProductForm.elements["name"].value;
  const price = addProductForm.elements["price"].value;
  const description = addProductForm.elements["description"].value;

  await addProduct(name, description, price);
  addProductForm.reset();
  await fetchProducts();
});

// funções para iterações
async function deleteProduct(id) {
  const response = await fetch(`${API_URL}:3000/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  return response.json();
}

async function addProduct(name, description, price) {
  const response = await fetch(`${API_URL}:3000/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description, price }),
  });

  return response.json();
}

async function updateProduct(id, name, description, price) {
  const response = await fetch(`${API_URL}:3000/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description, price }),
  });

  return response.json({response: response});
}
