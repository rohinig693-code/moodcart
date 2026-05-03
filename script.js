// ===============================
// LOGIN SYSTEM
// ===============================

function loginUser(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") {
        localStorage.setItem("loggedIn", true);
        alert("Login Successful");
        window.location.href = "index.html";
    } else {
        alert("Invalid Credentials");
    }
}


// ===============================
// MOOD SELECTION
// ===============================

function selectMood(mood) {
    localStorage.setItem("selectedMood", mood);
    window.location.href = "products.html";
}


// ===============================
// PAGE LOAD
// ===============================

window.onload = function () {
    loadProducts();
    loadCart();
};


// ===============================
// LOAD PRODUCTS FROM API
// ===============================

function loadProducts() {

    let container = document.getElementById("product-list");
    if (!container) return;

    let mood = localStorage.getItem("selectedMood");

    container.innerHTML = "";

    switch (mood) {

        // =========================
        // SWEETS API
        // =========================

        case "sweets":

            fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert&Chocolate&Candy&lc=en")
                .then(res => res.json())
                .then(data => {

                    data.meals.slice(0, 40).forEach(item => {

                        container.innerHTML += `
                            <div class="product-card">
                                <img src="${item.strMealThumb}" width="150">
                                <h3>${item.strMeal}</h3>
                                <p>₹120</p>
                                <button onclick="addToCart('${item.strMeal}',120)">
                                    Add to Cart
                                </button>
                            </div>
                        `;
                    });

                });

            break;


        // =========================
        // SNACKS API
        // =========================

      case "snacks":

    fetch("./data/snacks.json")
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch JSON");
            }
            return res.json();
        })
        .then(data => {

            const priority = ["kurkure", "parle-g", "good day", "oreo"];

            container.innerHTML = "";

            if (!data.products) {
                throw new Error("Invalid JSON structure");
            }

            data.products
                .filter(product => {
                    const name = (product.name || "").toLowerCase();
                    return priority.some(p => name.includes(p));
                })
                .sort((a, b) => {
                    const ai = priority.findIndex(p => a.name.toLowerCase().includes(p));
                    const bi = priority.findIndex(p => b.name.toLowerCase().includes(p));
                    return ai - bi;
                })
                .forEach(product => {

                    const name = cleanName(product.name);
                    const price = product.price || 20;

                    // ✅ Use your LOCAL image from JSON
                    const imageUrl = product.image;

                    container.innerHTML += `
                        <div class="product-card">
                            <img src="${imageUrl}" 
                                 alt="${name}" 
                                 width="150"
                                 onerror="this.onerror=null; this.src='data/images/snacks.jpg';">

                            <h3>${name}</h3>
                            <p>₹${price}</p>

                            <button onclick="addToCart('${name}', ${price})">
                                Add to Cart
                            </button>
                        </div>
                    `;
                });

        })
        .catch(error => {
            console.error("Snack Load Error:", error);

            container.innerHTML = `
                <p style="color:red;">
                    Failed to load snacks. Check JSON path or format.
                </p>
            `;
        });

    break;
        // =========================
        // WORKOUT API
        // =========================

    case "workout":

    container.innerHTML = `
        <div id="workout-section" style="padding:20px; font-family:sans-serif;">

            <h2 style="text-align:center; margin-bottom:20px;">
                🏋️ Premium Workout Zone
            </h2>

            <!-- TOP BAR -->
            <div style="
                display:flex;
                justify-content:space-between;
                flex-wrap:wrap;
                background:#f5f5f5;
                padding:10px;
                border-radius:10px;
                margin-bottom:20px;
            ">
                
                <!-- LEFT -->
                <div>
                    <button onclick="filterExercises('all')">All</button>
                    <button onclick="filterExercises('strength')">Strength</button>
                    <button onclick="filterExercises('cardio')">Cardio</button>
                </div>

                <!-- RIGHT -->
                <div>
                    <button onclick="generateWorkout()">🎯 Plan</button>
                    <button onclick="startTimer(30)">⏱️ 30s</button>
                    <button onclick="startTimer(60)">⏱️ 60s</button>
                </div>

            </div>

            <!-- PROGRESS -->
            <p id="progress" style="font-weight:bold; margin-bottom:15px;">
                Workouts Done: 0
            </p>

            <!-- EXERCISES -->
            <h3>💪 Exercises</h3>
            <div id="exercise-list" style="
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap:15px;
                margin-bottom:50px;
            "></div>

            <!-- PROTEIN -->
            <h3>🍫 Protein items</h3>
            <div id="protein-list" style="
                display:grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap:15px;
                margin-bottom:50px;
            "></div>

            <!-- VIDEOS -->
            <h3>🎥 Workout Videos</h3>
            <div id="video-list" style="
                display:flex;
                flex-wrap:wrap;
                gap:15px;
            "></div>

        </div>
    `;

    // ✅ DIRECT CALL (FIXED)
    loadWorkoutSection();

    break;
        // =========================
        // STUDY API
        // =========================

       case "study":

    fetch("https://www.googleapis.com/books/v1/volumes?q=javascript")
        .then(res => res.json())
        .then(data => {

           container.innerHTML += `
    <div style="grid-column: 1 / -1; margin-top:30px;">
        <h2>Books</h2>
    </div>
`;

            // ===============================
            // BOOKS FROM API
            // ===============================
            if (data.items) {
                data.items.slice(0, 20).forEach(book => {

                    const info = book.volumeInfo;

                    const title = info.title || "No Title";
                    const author = info.authors ? info.authors[0] : "Unknown";
                    const img = info.imageLinks
                        ? info.imageLinks.thumbnail
                        : "https://picsum.photos/200";

                    container.innerHTML += `
                        <div class="product-card">
                            <img src="${img}" width="120">
                            <h4>${title}</h4>
                            <p>${author}</p>
                            <p>₹250</p>
                            <button onclick="addToCart('${title}',250)">
                                Add
                            </button>
                        </div>
                    `;
                });
            }

            // ===============================
            // STATIONERY ITEMS (MANUAL)
            // ===============================
    
            const stationery = [
                {
                    name: "100 pages Notebook",
                    price: 40,
                    img: "data/images/100pages.jpg"
                },
             {
                    name: "200 pages Notebook",
                    price: 80,
                    img: "data/images/200pages.jpg"
                },
                {
                    name: " Blue Pen Pack",
                    price: 100,
                    img: "data/images/bluepen.jpg"
                },
                {
                    name: "Black  Pen Pack",
                    price: 40,
                    img: "data/images/blackpen.jpg"
                },
                 {
                    name: "Pencil Set",
                    price: 40,
                    img: "data/images/pencilset.jpg"
                },
                {
                    name: "Highlighter Set",
                    price: 120,
                    img: "data/images/highset.jpg"
                },
                {
                    name: "Geometry Box",
                    price: 150,
                    img: "data/images/geo.jpg"
                },
                {
                    name: "Sticky Notes",
                    price: 60,
                    img: "data/images/stick.jpg"
                },
                {
                    name: "File Folder",
                    price: 90,
                    img: "data/images/file.jpg"
                }
            ];

       container.innerHTML += `
    <div style="grid-column: 1 / -1; margin-top:30px;">
        <h2>Stationery</h2>
    </div>
`;

            stationery.forEach(item => {
                container.innerHTML += `
                    <div class="product-card">
                        <img src="${item.img}" width="120">
                        <h4>${item.name}</h4>
                        <p>₹${item.price}</p>
                        <button onclick="addToCart('${item.name}', ${item.price})">
                            Add
                        </button>
                    </div>
                `;
            });

        })
        .catch(error => {
            console.error("Book API Error:", error);
            container.innerHTML = `
                <p style="color:red;">Failed to load books</p>
            `;
        });
break;

        // =========================
        // RELAX API (MULTI API)
        // =========================

case "shopping":

    container.innerHTML = `
        <div style="grid-column: 1 / -1; margin-bottom:20px;">
            <h2>👗 Women's Fashion & Accessories</h2>
        </div>

        <!-- FILTERS & SORT -->
        <div style="grid-column: 1 / -1; background:#f5f5f5; padding:15px; border-radius:8px; margin-bottom:20px; display:flex; gap:15px; flex-wrap:wrap; align-items:center;">
            
            <!-- PRICE FILTER -->
            <div>
                <label>Price Range: </label>
                <input type="range" id="priceFilter" min="0" max="5000" value="5000" style="width:150px;">
                <span id="priceValue">₹5000</span>
            </div>

            <!-- CATEGORY FILTER -->
            <div>
                <label>Category: </label>
                <select id="categoryFilter" style="padding:5px; border-radius:4px;">
                    <option value="all">All</option>
                    <option value="clothing">Clothing</option>
                    <option value="jewelry">Jewelry</option>
                </select>
            </div>

            <!-- SORT -->
            <div>
                <label>Sort by: </label>
                <select id="sortFilter" style="padding:5px; border-radius:4px;">
                    <option value="default">Default</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                </select>
            </div>
        </div>

        <div id="products-container"></div>
    `;

    let allProducts = [];
    let filteredProducts = [];

    // Fetch data
    Promise.all([
        fetch("https://fakestoreapi.com/products/category/women%27s%20clothing").then(r => r.json()),
        fetch("https://fakestoreapi.com/products/category/jewelery").then(r => r.json())
    ])
    .then(([clothing, jewelry]) => {
        // Add category labels
        clothing.forEach(p => { p.category_label = "clothing"; });
        jewelry.forEach(p => { p.category_label = "jewelry"; });
        
        allProducts = [...clothing, ...jewelry];
        filteredProducts = [...allProducts];
        
        renderProducts();
        setupFilters();
    })
    .catch(err => {
        console.error("Shopping Error:", err);
        container.innerHTML += "<p style='color:red; grid-column: 1 / -1;'>Failed to load products</p>";
    });

    function renderProducts() {
        const productsContainer = document.getElementById("products-container");
        if (!productsContainer) return;

        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>No products match your filters</p>";
            return;
        }

        productsContainer.innerHTML = filteredProducts.map((item, idx) => {
            const price = Math.round(item.price * 80);
            const title = item.title.length > 45 ? item.title.substring(0, 45) + "..." : item.title;
            const rating = (Math.random() * 2 + 3).toFixed(1);
            const reviews = Math.floor(Math.random() * 200 + 20);

            return `
                <div class="product-card">
                    <div style="position:relative;">
                        <img src="${item.image}" alt="${title}" width="120" style="height:150px; object-fit:contain;">
                        <button onclick="toggleWishlist(${idx})" style="position:absolute; top:5px; right:5px; background:#fff; border:none; font-size:20px; cursor:pointer; border-radius:50%; width:30px; height:30px;" id="wish-${idx}">🤍</button>
                    </div>
                    <h4>${title}</h4>
                    
                    <div style="margin:5px 0; font-size:12px;">
                        <span style="color:#ff9800;">★★★★☆</span> ${rating} (${reviews})
                    </div>
                    
                    <p style="font-size:18px; font-weight:bold; margin:8px 0;">₹${price}</p>
                    
                    <div style="display:flex; gap:5px;">
                        <button onclick="addToCart('${item.title.replace(/'/g, "\\'")}', ${price})" style="flex:1; background:#FF9800; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer;">
                            Add to Cart
                        </button>
                        <button onclick="viewDetails(${idx})" style="flex:1; background:#2196F3; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer;">
                            View
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        productsContainer.style.display = "grid";
        productsContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
        productsContainer.style.gap = "15px";
        productsContainer.style.gridColumn = "1 / -1";
    }

    function setupFilters() {
        const priceFilter = document.getElementById("priceFilter");
        const priceValue = document.getElementById("priceValue");
        const categoryFilter = document.getElementById("categoryFilter");
        const sortFilter = document.getElementById("sortFilter");

        if (!priceFilter) return;

        priceFilter.addEventListener("input", (e) => {
            priceValue.textContent = "₹" + e.target.value;
            applyFilters();
        });

        categoryFilter.addEventListener("change", applyFilters);
        sortFilter.addEventListener("change", applyFilters);
    }

    function applyFilters() {
        const priceMax = parseInt(document.getElementById("priceFilter").value);
        const category = document.getElementById("categoryFilter").value;
        const sort = document.getElementById("sortFilter").value;

        filteredProducts = allProducts.filter(p => {
            const price = Math.round(p.price * 80);
            const categoryMatch = category === "all" || p.category_label === category;
            const priceMatch = price <= priceMax;
            return categoryMatch && priceMatch;
        });

        if (sort === "priceLow") {
            filteredProducts.sort((a, b) => (a.price * 80) - (b.price * 80));
        } else if (sort === "priceHigh") {
            filteredProducts.sort((a, b) => (b.price * 80) - (a.price * 80));
        }

        renderProducts();
    }

    window.toggleWishlist = function(idx) {
        const btn = document.getElementById(`wish-${idx}`);
        if (btn.textContent === "🤍") {
            btn.textContent = "❤️";
            alert(filteredProducts[idx].title + " added to wishlist!");
        } else {
            btn.textContent = "🤍";
        }
    };

    window.viewDetails = function(idx) {
        const product = filteredProducts[idx];
        const price = Math.round(product.price * 80);
        alert(`📦 ${product.title}\n\n💰 Price: ₹${price}\n\n✅ In Stock\n\n⭐ Highly Rated\n\nClick Add to Cart to purchase!`);
    };

    break;
  }
}


// ===============================
// SEARCH FUNCTION
// ===============================

function searchProduct() {

    let input = document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    let cards =
        document.getElementsByClassName("product-card");

    for (let i = 0; i < cards.length; i++) {

        let title =
            cards[i].getElementsByTagName("h3")[0] ||
            cards[i].getElementsByTagName("h4")[0];

        if (title && title.innerText
            .toLowerCase()
            .includes(input)) {

            cards[i].style.display = "block";

        } else {

            cards[i].style.display = "none";
        }
    }
}


// ===============================
// CART SYSTEM
// ===============================

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {

    cart.push({ name, price });

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(name + " added to cart");
}


// ===============================
// LOAD CART
// ===============================

function loadCart() {

    let container =
        document.getElementById("cart-items");

    if (!container) return;

    let cartItems =
        JSON.parse(localStorage.getItem("cart")) || [];

    container.innerHTML = "";

    let total = 0;

    cartItems.forEach((item, index) => {

        total += item.price;

        let div =
            document.createElement("div");

        div.innerHTML = `
            ${item.name} - ₹${item.price}
            <button onclick="removeFromCart(${index})">
                Remove
            </button>
        `;

        container.appendChild(div);
    });

    let totalDiv =
        document.createElement("h3");

    totalDiv.innerHTML =
        "Total: ₹" + total;

    container.appendChild(totalDiv);
}


// ===============================
// REMOVE ITEM
// ===============================

function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    loadCart();
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("loggedIn");

    window.location.href = "login.html";
}
function cleanName(name) {

    if (!name) return "Biscuit";

    // Remove very long names
    if (name.length > 30) {
        name = name.substring(0, 30) + "...";
    }

    return name;
}
// ===============================
// WORKOUT FUNCTIONS (ADD HERE)
// ===============================
let workoutCount = 0;

// ===============================
// GLOBAL EXERCISE DATA (IMPORTANT)
// ===============================
const exercises = [
    { name: "Push Ups", type: "strength", img: "data/images/pushup.jpg" },
    { name: "Squats", type: "strength", img: "data/images/squats.jpg" },
    { name: "Jumping Jacks", type: "cardio", img: "data/images/jumping_jacks.jpg" },
    { name: "Plank", type: "strength", img: "data/images/plank.jpg" },
    { name: "Burpees", type: "cardio", img: "data/images/burpees.jpg" },
    { name: "Sit Ups", type: "cardio", img: "data/images/situp.jpg" },
    { name: "Crunches", type: "cardio", img: "data/images/crunches.jpg" },
    { name: "Lunges", type: "cardio", img: "data/images/lunges.jpg" }
];

// ===============================
// DISPLAY EXERCISES
// ===============================
function displayExercises(list) {
    const exerciseList = document.getElementById("exercise-list");
    exerciseList.innerHTML = "";

    list.forEach(ex => {
        exerciseList.innerHTML += `
            <div class="product-card">
                <img src="${ex.img}" width="120"
                     onerror="this.src='https://picsum.photos/200'">
                <h4>${ex.name}</h4>
                <p>${ex.type}</p>
                <button onclick="completeWorkout()">Done</button>
            </div>
        `;
    });
}

// ===============================
// LOAD WORKOUT SECTION
// ===============================
function loadWorkoutSection() {

    const proteinList = document.getElementById("protein-list");
    const videoList = document.getElementById("video-list");

    // load all exercises initially
    displayExercises(exercises);

    // ===============================
    // PROTEIN ITEMS
    // ===============================
    const proteins = [
        { name: "Chocolate Protein Bar", price: 120, img: "data/images/proteinbar.jpg" },
        { name: "Peanut Protein Bar", price: 110, img: "data/images/proteinbar2.jpg" },
        { name: "Energy Bar", price: 100, img: "data/images/energybar.jpg" },
        { name: "Whey Protein", price: 100, img: "data/images/wheyprotein.jpg" },
        { name: "Eggs", price: 100, img: "data/images/eggs.jpg" },
        { name: "No Sugar", price: 100, img: "data/images/nosugar.jpg" },
        { name: "Diet Coke", price: 100, img: "data/images/coke.jpg" }
    ];

    proteinList.innerHTML = "";

    proteins.forEach(p => {
        proteinList.innerHTML += `
            <div class="product-card">
                <img src="${p.img}" width="120"
                     onerror="this.src='https://picsum.photos/200'">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>
                <button onclick="addToCart('${p.name}', ${p.price})">Add</button>
            </div>
        `;
    });

    // ===============================
    // VIDEOS
    // ===============================
    videoList.innerHTML = `
     <video width="220" height="140" controls>
  <source src="data/videos/video1.mp4" type="video/mp4">
</video>

<video width="220" height="140" controls>
  <source src="data/videos/video2.mp4" type="video/mp4">
</video>

<video width="220" height="140" controls>
  <source src="data/videos/video3.mp4" type="video/mp4">
</video>
<video width="220" height="140" controls>
  <source src="data/videos/video4.mp4" type="video/mp4">
</video>
<video width="220" height="140" controls>
  <source src="data/videos/video5.mp4" type="video/mp4">
</video>
<video width="220" height="140" controls>
  <source src="data/videos/video6.mp4" type="video/mp4">
</video>



        
    `;
}

// ===============================
// FILTER FUNCTION (FIXED)
// ===============================
function filterExercises(type) {

    if (type === "all") {
        displayExercises(exercises);
    } else {
        const filtered = exercises.filter(ex => ex.type === type);
        displayExercises(filtered);
    }
}

// ===============================
// PLAN
// ===============================
function generateWorkout() {
    alert("Workout plan generated 💪");
}

// ===============================
// TIMER
// ===============================
function startTimer(sec) {
    alert("Timer started: " + sec + " seconds");
}

// ===============================
// PROGRESS
// ===============================
function completeWorkout() {
    workoutCount++;
    document.getElementById("progress").innerText =
        "Workouts Done: " + workoutCount;
}

