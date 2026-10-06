
/* =====================================================
   TVS BIKES & SCOOTERS - SCRIPT.JS
===================================================== */

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwyMizpelcSB8pFF2NkpLVhKvCIt2_XP4byYMCUluDYYfkuL3qGG5LbjsS6HVSEW74d4A/exec";

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function getElement(id) {
    return document.getElementById(id);
}

function showMessage(message) {
    alert(message);
}

function getValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getVehiclePrice(card) {
    const priceElement = card?.querySelector("h4");

    if (!priceElement) {
        return null;
    }

    const text = priceElement.textContent.trim();

    // "Check with dealer" is not a numeric price.
    const match = text.replace(/,/g, "").match(/₹\s*(\d+(?:\.\d+)?)/);

    if (!match) {
        return null;
    }

    const price = Number(match[1]);

    return Number.isFinite(price) ? price : null;
}

async function sendToGoogleScript(formData) {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: formData
    });

    const text = await response.text();

    let result;

    try {
        result = JSON.parse(text);
    } catch {
        throw new Error(
            "The server returned an invalid response. Check your Apps Script deployment."
        );
    }

    if (!response.ok) {
        throw new Error("Server error: " + response.status);
    }

    return result;
}

function getButton(form) {
    return form?.querySelector(
        "button[type='submit'], input[type='submit']"
    );
}

// =====================================================
// EXPLORE VEHICLES BUTTON
// HTML section ID: vehicles
// =====================================================

const exploreButton = document.querySelector(".hero .primary-btn");

if (exploreButton) {
    exploreButton.addEventListener("click", function (event) {
        event.preventDefault();

        getElement("vehicles")?.scrollIntoView({
            behavior: "smooth"
        });
    });
}

// =====================================================
// VEHICLE DETAILS MODAL
// =====================================================

const carModal = getElement("carModal");
const closeModal = getElement("closeModal");
const modalCarName = getElement("modalCarName");
const modalCarPrice = getElement("modalCarPrice");
const modalCarDetails = getElement("modalCarDetails");

document.querySelectorAll(".details-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        const card = button.closest(".car-card");

        if (!card) return;

        const name = card.querySelector("h3");
        const price = card.querySelector("h4");
        const description = card.querySelector("p");

        if (modalCarName && name) {
            modalCarName.textContent = name.textContent.trim();
        }

        if (modalCarPrice && price) {
            modalCarPrice.textContent = price.textContent.trim();
        }

        if (modalCarDetails && description) {
            modalCarDetails.textContent =
                description.textContent.trim();
        }

        carModal?.classList.add("active");
    });
});

function hideCarModal() {
    carModal?.classList.remove("active");
}

closeModal?.addEventListener("click", hideCarModal);

carModal?.addEventListener("click", function (event) {
    if (event.target === carModal) {
        hideCarModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        hideCarModal();
    }
});

// =====================================================
// SHOPPING CART
// =====================================================

const cartButton = document.querySelector(".cart-btn");
const cartItems = getElement("cartItems");
const cartTotal = getElement("cartTotal");

let selectedVehicles = [];

function updateCartButton() {
    if (cartButton) {
        cartButton.textContent =
            "Cart 🛒 (" + selectedVehicles.length + ")";
    }
}

function displayCart() {
    if (!cartItems || !cartTotal) {
        updateCartButton();
        return;
    }

    cartItems.innerHTML = "";

    if (selectedVehicles.length === 0) {
        cartItems.textContent = "Your cart is empty.";
        cartTotal.textContent = "Total: ₹0";
        updateCartButton();
        return;
    }

    let allPricesKnown = true;
    let total = 0;

    selectedVehicles.forEach(function (vehicle, index) {
        const item = document.createElement("div");
        item.className = "cart-item";

        const details = document.createElement("span");

        if (vehicle.price === null) {
            details.textContent =
                vehicle.name + " - Price confirmed by dealer";
            allPricesKnown = false;
        } else {
            details.textContent =
                vehicle.name + " - ₹" +
                vehicle.price.toLocaleString("en-IN");

            total += vehicle.price;
        }

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-cart-btn";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {
            selectedVehicles.splice(index, 1);
            displayCart();
        });

        item.appendChild(details);
        item.appendChild(removeButton);
        cartItems.appendChild(item);
    });

    if (allPricesKnown) {
        cartTotal.textContent =
            "Total: ₹" + total.toLocaleString("en-IN");
    } else {
        cartTotal.textContent =
            "Final price will be confirmed by the dealer.";
    }

    updateCartButton();
}

document.querySelectorAll(".cart-add-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        const card = button.closest(".car-card");

        if (!card) return;

        const name = card.querySelector("h3");

        if (!name) return;

        const vehicleName = name.textContent.trim();

        selectedVehicles.push({
            name: vehicleName,
            price: getVehiclePrice(card)
        });

        displayCart();

        showMessage(vehicleName + " added to your cart!");
    });
});

cartButton?.addEventListener("click", function () {
    const section = getElement("cart") || getElement("cart-section");

    section?.scrollIntoView({
        behavior: "smooth"
    });
});

displayCart();

// =====================================================
// VEHICLE SEARCH
// =====================================================

const searchInput = getElement("carSearch");

searchInput?.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase().trim();

    document.querySelectorAll(".car-card").forEach(function (card) {
        const matches = card.textContent
            .toLowerCase()
            .includes(searchText);

        card.style.display = matches ? "" : "none";
    });
});

// =====================================================
// MOBILE NAVIGATION
// =====================================================

const menuBtn = getElement("menuBtn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
    menuBtn.setAttribute("aria-expanded", "false");

    menuBtn.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("active");

        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");
        });
    });
}

// =====================================================
// BOOKING FORM
// Backend field "car" is preserved for compatibility.
// =====================================================

const bookingForm = getElement("bookingForm");

bookingForm?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = getElement("customerName")?.value.trim() || "";
    const email = getElement("customerEmail")?.value.trim() || "";
    const mobile = getElement("customerMobile")?.value.trim() || "";
    const vehicle = getElement("selectedCar")?.value.trim() || "";

    if (name.length < 2) {
        showMessage("Please enter your name.");
        return;
    }

    if (!getValidEmail(email)) {
        showMessage("Please enter a valid email address.");
        return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        showMessage("Please enter a valid 10-digit mobile number.");
        return;
    }

    if (!vehicle) {
        showMessage("Please select a bike or scooter.");
        return;
    }

    const button = getButton(bookingForm);
    const originalText = button
        ? (button.textContent || button.value)
        : "";

    if (button) {
        button.disabled = true;

        if (button.tagName === "INPUT") {
            button.value = "Booking...";
        } else {
            button.textContent = "Booking...";
        }
    }

    try {
        const data = new URLSearchParams();

        data.append("action", "booking");
        data.append("name", name);
        data.append("email", email);
        data.append("mobile", mobile);

        // Keep this field name to match the existing backend.
        data.append("car", vehicle);

        const result = await sendToGoogleScript(data);

        if (!result || result.success !== true) {
            throw new Error(
                result?.error || "Booking could not be saved."
            );
        }

        showMessage(
            "Booking Successful!\n\n" +
            "Booking ID: " + (result.bookingId || "Please check your booking record") +
            "\nName: " + name +
            "\nSelected Vehicle: " + vehicle
        );

        bookingForm.reset();

    } catch (error) {
        console.error("Booking error:", error);

        showMessage(
            "Booking Error:\n\n" + error.message
        );

    } finally {
        if (button) {
            button.disabled = false;

            if (button.tagName === "INPUT") {
                button.value = originalText;
            } else {
                button.textContent = originalText;
            }
        }
    }
});

// =====================================================
// CONTACT FORM
// =====================================================

const contactForm = getElement("contactForm");
const contactSuccess = getElement("contactSuccess");

contactForm?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = getElement("contactName")?.value.trim() || "";
    const email = getElement("contactEmail")?.value.trim() || "";
    const message = getElement("contactMessage")?.value.trim() || "";

    if (name.length < 2) {
        showMessage("Please enter your name.");
        return;
    }

    if (!getValidEmail(email)) {
        showMessage("Please enter a valid email address.");
        return;
    }

    if (message.length < 5) {
        showMessage(
            "Please enter a message of at least 5 characters."
        );
        return;
    }

    const button = getButton(contactForm);
    const originalText = button
        ? (button.textContent || button.value)
        : "";

    if (button) {
        button.disabled = true;

        if (button.tagName === "INPUT") {
            button.value = "Sending...";
        } else {
            button.textContent = "Sending...";
        }
    }

    if (contactSuccess) {
        contactSuccess.textContent = "";
        contactSuccess.style.display = "none";
    }

    try {
        const data = new URLSearchParams();

        data.append("action", "contact");
        data.append("name", name);
        data.append("email", email);
        data.append("message", message);

        const result = await sendToGoogleScript(data);

        if (!result || result.success !== true) {
            throw new Error(
                result?.error || "Message could not be saved."
            );
        }

        const successText =
            "Message sent successfully! Thank you, " + name + ".";

        if (contactSuccess) {
            contactSuccess.textContent = "✓ " + successText;
            contactSuccess.style.display = "block";
            contactSuccess.setAttribute("role", "status");
        }

        showMessage(successText);

        contactForm.reset();

    } catch (error) {
        console.error("Contact form error:", error);

        showMessage(
            "Contact Error:\n\n" + error.message
        );

    } finally {
        if (button) {
            button.disabled = false;

            if (button.tagName === "INPUT") {
                button.value = originalText;
            } else {
                button.textContent = originalText;
            }
        }
    }
});

// =====================================================
// MODAL BOOK NOW BUTTON
// =====================================================

const modalBookBtn = getElement("modalBookBtn");

modalBookBtn?.addEventListener("click", function () {
    const selectedVehicle = getElement("selectedCar");
    const vehicleName = modalCarName?.textContent.trim() || "";

    if (selectedVehicle && vehicleName) {
        const matchingOption = Array.from(
            selectedVehicle.options
        ).find(function (option) {
            return option.value === vehicleName ||
                option.textContent.trim() === vehicleName;
        });

        if (matchingOption) {
            selectedVehicle.value = matchingOption.value;
        }
    }

    hideCarModal();

    const bookingSection =
        getElement("booking") || getElement("booking-section");

    bookingSection?.scrollIntoView({
        behavior: "smooth"
    });
});

