let defaultProducts = [
    {
        id: 1,
        name: "iPhone 13",
        category: "Electronics",
        price: 35000,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        description: "Used iPhone 13 in good condition.",
        owner: "Other"
    },
    {
        id: 2,
        name: "Study Table",
        category: "Furniture",
        price: 2500,
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6b7?w=500",
        description: "Wooden study table with drawers.",
        owner: "Other"
    },
    {
        id: 3,
        name: "Engineering Books",
        category: "Books",
        price: 800,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
        description: "Collection of engineering semester books.",
        owner: "Other"
    },
    {
        id: 4,
        name: "Royal Enfield Bike",
        category: "Vehicles",
        price: 95000,
        image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500",
        description: "Well-maintained second-hand bike.",
        owner: "Other"
    }
];
let products =
    JSON.parse(localStorage.getItem("usedMartProducts")) ||
    defaultProducts;

function saveProducts() {
    localStorage.setItem(
        "usedMartProducts",
        JSON.stringify(products)
    );
}

function displayProducts() {
    let grid = document.getElementById("productGrid");

    let search =
        document.getElementById("searchInput").value.toLowerCase();
    let category =
        document.getElementById("categoryFilter").value;
    let filteredProducts = products.filter(product => {
        let matchesSearch =
            product.name
            .toLowerCase()
            .includes(search);
        let matchesCategory =
            category === "all" ||
            product.category === category;
        return matchesSearch && matchesCategory;
    });
    grid.innerHTML = "";

    if(filteredProducts.length === 0) {
        grid.innerHTML =
            "<p>No products found.</p>";
        return;
    }
    filteredProducts.forEach(product => {

        grid.innerHTML += `
            <div class="product-card">
                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.src='https://via.placeholder.com/500x300?text=No+Image'">
                <div class="product-info">
                    <span class="category">
                        ${product.category}
                    </span>
                    <h3>
                        ${product.name}
                    </h3>
                    <div class="price">
                        ₹${Number(product.price).toLocaleString("en-IN")}
                    </div>
                    <p class="description">
                        ${product.description}
                    </p>
                    <button
                        class="buy-btn"
                        onclick="buyProduct(${product.id})"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        `;
    });
}

function buyProduct(id) {
    let product =
        products.find(p => p.id === id);

    if(!product) return;

    let confirmPurchase =
        confirm(
            `Do you want to buy ${product.name} for ₹${product.price}?`
        );

    if(confirmPurchase) {
        let purchases =JSON.parse(
                localStorage.getItem("purchases")
            ) || [];

        purchases.push(product);
        localStorage.setItem(
            "purchases",
            JSON.stringify(purchases)
        );
        showNotification(
            "Purchase successful! 🎉"
        );
        updateProfile();
    }
}

document
.getElementById("sellForm")
.addEventListener("submit", function(event) {

    event.preventDefault();
    let newProduct = {
        id: Date.now(),
        name:
            document.getElementById("productName").value,
        category:
            document.getElementById("productCategory").value,
        price:
            document.getElementById("productPrice").value,
        image:
            document.getElementById("productImage").value,
        description:
            document.getElementById("productDescription").value,
        owner: "Me"
    };

    products.push(newProduct);
    saveProducts();
    document.getElementById("sellForm").reset();
    showNotification(
        "Product listed successfully! 📦"
    );
    updateProfile();
    setTimeout(() => {
        showPage("buyPage");
    }, 1000);
});

function updateProfile() {
    let myProducts =
        products.filter(
            product => product.owner === "Me"
        );
    let purchases =
        JSON.parse(
            localStorage.getItem("purchases")
        ) || [];

    document.getElementById("listedCount")
        .innerText = myProducts.length;
    document.getElementById("purchaseCount")
        .innerText = purchases.length;
    let container =document.getElementById("myProducts");
    container.innerHTML = "";
    if(myProducts.length === 0) {
        container.innerHTML =
            "<p>You haven't listed any products yet.</p>";
        return;
    }

    myProducts.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <img
                    class="product-image"
                    src="${product.image}">
                <div class="product-info">
                    <span class="category">
                        ${product.category}
                    </span>
                    <h3>
                        ${product.name}
                    </h3>
                    <div class="price">
                        ₹${Number(product.price).toLocaleString("en-IN")}
                    </div>
                    <p class="description">
                        ${product.description}
                    </p>
                </div>
            </div>
        `;
    });
}

function showPage(pageId) {
    document
        .querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("active");
        });
    document
        .getElementById(pageId)
        .classList.add("active");
    document
        .querySelectorAll(".nav-links button")
        .forEach(button => {
            button.classList.remove("active");
        });
    if(pageId === "buyPage") {
        document
            .getElementById("buyNav")
            .classList.add("active");
    }
    if(pageId === "sellPage") {
        document
            .getElementById("sellNav")
            .classList.add("active");
    }
    if(pageId === "profilePage") {
        document
            .getElementById("profileNav")
            .classList.add("active");
        updateProfile();
    }
}
function showNotification(message) {
    let notification =document.getElementById("notification");
    notification.innerText = message;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 2500);
}
displayProducts();
updateProfile();
