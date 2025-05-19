const STORAGE_KEY = "wishlist";

function getList() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveList(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function addItem(item) {
  const list = getList();
  if (!list.some((i) => i.id === item.id)) {
    list.push(item);
    saveList(list);
  }
}

function removeItem(id) {
  const list = getList().filter((i) => i.id !== id);
  saveList(list);
}

function isInList(id) {
  return getList().some((i) => i.id === id);
}

function updateButtons() {
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    const id = btn.dataset.productId;
    if (isInList(id)) {
      btn.textContent = "★ In Wishlist";
      btn.classList.add("in-wishlist");
    } else {
      btn.textContent = "☆ Add to Wishlist";
      btn.classList.remove("in-wishlist");
    }
  });
}

function renderWishlist() {
  console.log("render wishlist");
  const root = document.getElementById("wishlist-root");
  if (!root) return console.log("root undefined");

  const list = getList();
  if (list.length === 0) {
    root.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  root.innerHTML = `
    <ul class="wishlist-list">
      ${list
        .map(
          (item) => `
        <li class="wishlist-item" data-id="${item.id}">
          <a href="${item.url}">${item.title}</a>
          <button class="remove-wishlist-btn" data-id="${item.id}">Remove</button>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
}

updateButtons();
renderWishlist();

document.body.addEventListener("click", (e) => {
  // Додавання / видалення зі сторінки товару
  if (e.target.matches(".wishlist-btn")) {
    e.preventDefault();
    const btn = e.target;
    const item = {
      id: btn.dataset.productId,
      url: btn.dataset.productUrl,
      title: btn.dataset.productTitle,
    };

    if (isInList(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }

    updateButtons();
    renderWishlist(); // на випадок, якщо юзер на wishlist сторінці
  }

  // Видалення зі списку бажань
  if (e.target.matches(".remove-wishlist-btn")) {
    e.preventDefault();
    const id = e.target.dataset.id;
    removeItem(id);
    renderWishlist();
    updateButtons(); // на випадок, якщо кнопки на сторінці ще є
  }
});
