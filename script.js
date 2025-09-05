let events = [];
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
let selectedEvent = null;

// Load events directly from HTML
document.querySelectorAll(".event").forEach(div => {
    events.push({
        id: parseInt(div.dataset.id),
        name: div.dataset.name,
        category: div.dataset.category,
        date: div.dataset.date,
        price: parseInt(div.dataset.price),
        seats: parseInt(div.dataset.seats),
        image: div.querySelector("img").src
    });
});

// Save to localStorage
function saveData() {
    localStorage.setItem("bookings", JSON.stringify(bookings));
}

// Show section
function showSection(id) {
    document.querySelectorAll("main section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    if (id === "bookings") renderBookings();
}

// Booking Modal
function openModal(eventId) {
    selectedEvent = events.find(e => e.id === eventId);
    document.getElementById("modalEvent").textContent = `${selectedEvent.name} (${selectedEvent.seats} seats left)`;
    document.getElementById("modalImage").src = selectedEvent.image;
    document.getElementById("bookingModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("bookingModal").classList.add("hidden");
}

function confirmBooking() {
    let name = document.getElementById("userName").value.trim();
    let email = document.getElementById("userEmail").value.trim();
    let phone = document.getElementById("userPhone").value.trim();
    let count = parseInt(document.getElementById("ticketCount").value);

    // Email regex (basic official format: user@domain.com)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Phone regex (10-digit number, allows country code +91 etc.)
    const phonePattern = /^(\+?\d{1,3}[- ]?)?\d{10}$/;

    // Validate fields
    if (!name) return alert("Please enter your name.");
    if (!emailPattern.test(email)) return alert("Enter a valid email address (e.g., user@example.com).");
    if (!phonePattern.test(phone)) return alert("Enter a valid phone number (10 digits, optional country code).");
    if (isNaN(count) || count <= 0) return alert("Enter a valid number of tickets.");
    if (count > selectedEvent.seats) return alert("Not enough seats!");

    // Save booking
    selectedEvent.seats -= count;
    bookings.push({
        eventId: selectedEvent.id,
        name,
        email,
        phone,
        tickets: count
    });

    saveData();
    closeModal();
    renderBookings();
    updateSeatsOnHome();
}


// Render bookings like event cards with collapsible details
function renderBookings() {
    let list = document.getElementById("bookingList");
    list.innerHTML = "";
    bookings.forEach((b, i) => {
        let ev = events.find(e => e.id === b.eventId);
        let div = document.createElement("div");
        div.className = "booking-card";
        div.innerHTML = `
      <img src="${ev.image}" alt="${ev.name}">
      <h3>${ev.name}</h3>
      <div class="booking-details">
        <p>🎟️ ${b.tickets} tickets booked by ${b.name}</p>
        <p>📧 ${b.email}</p>
        <p>📞 ${b.phone}</p>
        <button onclick="cancelBooking(${i})">Cancel</button>
      </div>
    `;

        // Toggle collapsible on click
        div.addEventListener("click", function(e) {
            // prevent button clicks from toggling
            if (e.target.tagName.toLowerCase() === "button") return;
            let details = this.querySelector(".booking-details");
            details.classList.toggle("active");
        });

        list.appendChild(div);
    });
}


function cancelBooking(index) {
    let booking = bookings[index];
    let ev = events.find(e => e.id === booking.eventId);

    // Find the card element
    const list = document.getElementById("bookingList");
    const card = list.children[index];

    // Animate card out
    card.classList.add("removing");

    // After animation ends, update data + UI
    setTimeout(() => {
        ev.seats += booking.tickets;
        bookings.splice(index, 1);
        saveData();
        renderBookings();
        updateSeatsOnHome();
    }, 600); // matches transition duration
}

// Update seat counts on Home page
function updateSeatsOnHome() {
    events.forEach(ev => {
        let card = document.querySelector(`.event[data-id="${ev.id}"]`);
        if (card) {
            card.querySelector("p:nth-of-type(2)").textContent = `Price: $${ev.price} | Seats: ${ev.seats}`;
        }
    });
}

// Footer Quotes with fade effect
const quotes = [
    '"A goal without a plan is just a wish."',
    '"Success is not final, failure is not fatal: It is the courage to continue that counts."',
    '"Do something today that your future self will thank you for."',
    '"Dream big, start small, act now."',
    '"Innovation distinguishes between a leader and a follower."'
];

let quoteIndex = 0;

function changeQuote() {
    const footerQuote = document.getElementById("footer-quote");

    // Fade out
    footerQuote.classList.add("fade-out");

    setTimeout(() => {
        // Change text while hidden
        quoteIndex = (quoteIndex + 1) % quotes.length;
        footerQuote.textContent = quotes[quoteIndex];

        // Fade back in
        footerQuote.classList.remove("fade-out");
    }, 1000); // matches transition time in CSS
}

setInterval(changeQuote, 5000); // change every 5 seconds


// Theme toggle (sync with footer button)
function toggleTheme() {
    document.body.classList.toggle("dark");
    let mode = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", mode);
    document.getElementById("themeToggle").textContent = mode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    document.getElementById("footerThemeToggle").textContent = "Toggle Theme";
}


// Theme toggle
let themeToggle = document.getElementById("themeToggle");
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light Mode";
}
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    let mode = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", mode);
    themeToggle.textContent = mode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
});
