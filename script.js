//===============================
// EXPLORE CARS
// ===============================

const exploreButton = document.querySelector(".hero .primary-btn");

if (exploreButton) {
    exploreButton.addEventListener("click", function () {
        document.querySelector("#cars").scrollIntoView({
            behavior: "smooth"
        });
    });
}


// ===============================
// CAR DETAILS MODAL
// ===============================

const detailButtons = document.querySelectorAll(".details-btn");

const carModal = document.getElementById("carModal");
const closeModal = document.getElementById("closeModal");

const modalCarName = document.getElementById("modalCarName");
const modalCarPrice = document.getElementById("modalCarPrice");
const modalCarDetails = document.getElementById("modalCarDetails");

detailButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const card = button.closest(".car-card");

        const carName = card.querySelector("h3").textContent;
        const carPrice = card.querySelector("h4").textContent;
        const carDetails = card.querySelector("p").textContent;

        modalCarName.textContent = carName;
        modalCarPrice.textContent = carPrice;
        modalCarDetails.textContent = carDetails;

        carModal.classList.add("active");
    });

});

if (closeModal) {
    closeModal.addEventListener("click", function () {
        carModal.classList.remove("active");
    });
}

if (carModal) {
    carModal.addEventListener("click", function (event) {

        if (event.target === carModal) {
            carModal.classList.remove("active");
        }

    });
}


// ===============================
// CART
// ===============================

const cartButton = document.querySelector(".cart-btn");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const addToCartButtons = document.querySelectorAll(".cart-add-btn");

let selectedCars = [];
let totalPrice = 0;
let cartCount = 0;


// Add to Cart

addToCartButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const card = button.closest(".car-card");

        const carName = card.querySelector("h3").textContent;

        const priceText = card.querySelector("h4").textContent;

        const price = Number(
            priceText.replace("₹", "").replace(/,/g, "")
        );

        selectedCars.push({
            name: carName,
            price: price
        });

        totalPrice += price;

        cartCount++;

        cartButton.textContent = "Cart 🛒 (" + cartCount + ")";

        button.textContent = "Added ✓";

        button.disabled = true;

        displayCart();

    });

});


// Display Cart

// ===============================
// DISPLAY CART
// ===============================

function displayCart() {

    if (!cartItems || !cartTotal) {
        return;
    }

    if (selectedCars.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.textContent =
            "Total: ₹0";

        return;
    }

    cartItems.innerHTML = "";

    selectedCars.forEach(function (car, index) {

        const item =
            document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `
            <span>
                ${car.name} - ₹${car.price.toLocaleString("en-IN")}
            </span>

            <button class="remove-cart-btn" data-index="${index}">
                Remove ❌
            </button>
        `;

        cartItems.appendChild(item);

    });

    cartTotal.textContent =
        "Total: ₹" +
        totalPrice.toLocaleString("en-IN");


    // Remove buttons

    const removeButtons =
        document.querySelectorAll(".remove-cart-btn");

    removeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const index =
                Number(button.getAttribute("data-index"));

            totalPrice -= selectedCars[index].price;

            selectedCars.splice(index, 1);

            cartCount--;

            if (cartButton) {

                cartButton.textContent =
                    "Cart 🛒 (" + cartCount + ")";

            }

            displayCart();

        });

    });

}

// Cart Button

if (cartButton) {

    cartButton.addEventListener("click", function () {

        document.querySelector("#cart").scrollIntoView({
            behavior: "smooth"
        });

    });

}


// ===============================
// SEARCH
// ===============================

const searchInput =
    document.getElementById("carSearch");

const carCards =
    document.querySelectorAll(".car-card");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const searchText =
            searchInput.value.toLowerCase().trim();

        carCards.forEach(function (card) {

            const cardText =
                card.textContent.toLowerCase();

            if (cardText.includes(searchText)) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

}


// ===============================
// BOOKING FORM
// ===============================

const bookingForm =
    document.getElementById("bookingForm");

if (bookingForm) {

    bookingForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("customerName").value.trim();

        const email =
            document.getElementById("customerEmail").value.trim();

        const mobile =
            document.getElementById("customerMobile").value.trim();

        const car =
            document.getElementById("selectedCar").value;


        // Name validation

        if (name.length < 2) {

            alert("Please enter a valid name.");

            return;
        }


        // Email validation

        if (!email.includes("@")) {

            alert("Please enter a valid email.");

            return;
        }


        // Mobile validation

        if (!/^[0-9]{10}$/.test(mobile)) {

            alert("Please enter a valid 10-digit mobile number.");

            return;
        }


        // Car validation

        if (car === "") {

            alert("Please select a car.");

            return;
        }


        // Successful Booking

        alert(
            "Booking Successful! ✓\n\n" +
            "Thank you, " + name + "!\n" +
            "Selected Car: " + car
        );

        bookingForm.reset();

    });

}

// ===============================
// MOBILE MENU
// ===============================

const menuBtn =
    document.getElementById("menuBtn");

const navLinks =
    document.querySelector(".nav-links");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", function () {

        navLinks.classList.toggle("active");

    });

}



// ===============================
// CONTACT FORM
// ===============================

const contactForm =
    document.getElementById("contactForm");

const contactSuccess =
    document.getElementById("contactSuccess");

const contactSubmitBtn =
    contactForm
        ? contactForm.querySelector("button[type='submit']")
        : null;


// ===============================
// GOOGLE APPS SCRIPT URL
// ===============================

const GOOGLE_SCRIPT_URL =
   "https://script.google.com/macros/s/AKfycbxrG3IXwsso8gQu44ZRuAMy382S6DzGpCC3iHIzR2as3mnd6XRWQ9K8ullzE9YWZfZMIA/exec";


// ===============================
// CONTACT FORM SUBMIT
// ===============================

if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("contactName").value.trim();

        const email =
            document.getElementById("contactEmail").value.trim();

        const message =
            document.getElementById("contactMessage").value.trim();


        // ===============================
        // VALIDATION
        // ===============================

        if (name.length < 2) {

            alert("Please enter a valid name.");

            return;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            alert("Please enter a valid email address.");

            return;
        }


        if (message.length < 5) {

            alert("Please enter a message.");

            return;
        }


        // ===============================
        // LOADING
        // ===============================

        if (contactSubmitBtn) {

            contactSubmitBtn.textContent =
                "Sending... ⏳";

            contactSubmitBtn.disabled = true;

        }


        // ===============================
        // SEND TO GOOGLE SHEET
        // ===============================

        try {

            const response = await fetch(
                GOOGLE_SCRIPT_URL,
                {
                    method: "POST",

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message
                    })
                }
            );


            const result = await response.json();


            if (result.success) {

                if (contactSuccess) {

                    contactSuccess.textContent =
                        "✓ Message sent successfully! Thank you, " +
                        name +
                        ".";

                }

                contactForm.reset();

            } else {

                alert(
                    "Message could not be saved. Please try again."
                );

            }


        } catch (error) {

            console.error(error);

            alert(
                "Something went wrong. Please try again."
            );

        }


        // ===============================
        // RESTORE BUTTON
        // ===============================

        if (contactSubmitBtn) {

            contactSubmitBtn.textContent =
                "Send Message";

            contactSubmitBtn.disabled = false;

        }

    });

}

// ===============================
// MODAL BOOK NOW
// ===============================

const modalBookBtn = document.getElementById("modalBookBtn");

if (modalBookBtn) {
    modalBookBtn.addEventListener("click", function () {

        const carName =
            document.getElementById("modalCarName").textContent;

        document.getElementById("selectedCar").value = carName;

        carModal.classList.remove("active");

        document.querySelector("#booking").scrollIntoView({
            behavior: "smooth"
        });

    });
}