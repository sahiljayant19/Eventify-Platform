// Variables are defined in variables.js (loaded before this file)
import { toggleNav, menu, nav, myBookingLink, homeLink, aboutLink, supportLink, authModal, registerView, loginView, toLogin, toRegister, closeModal, signInBtn, signOutBtn, userDisplayName, authBox, registerName, registerEmail, registerBtn, registerPassword, loginEmail, loginPassword, loginBtn, show_el, hide_el } from './variables.js';


let menuClicked = false;

// Clear all authentication form fields for security
function clearAuthFields() {
    // Clear login fields
    if (loginEmail) loginEmail.value = '';
    if (loginPassword) loginPassword.value = '';

    // Clear registration fields
    if (registerName) registerName.value = '';
    if (registerEmail) registerEmail.value = '';
    if (registerPassword) {
        registerPassword.forEach(field => field.value = '');
    }
}

// Show elements to prevent showing elements in mobile screen during click like search box and sign in button
function showElements(element) {
    element.style.display = 'block';
}

function hideElements(element) { // hide elements to prevent showing elements in mobile screen during click like search box and sign in button
    element.style.display = 'none';
}

// Helper to sync navbar auth UI with stored user
function applyStoredUserToNavbar() {
    try {
        const stored = localStorage.getItem('eventifyUser');
        if (stored) {
            const user = JSON.parse(stored);
            const displayName = user.username || user.email;
            if (displayName) {
                signInBtn.style.display = 'none';
                userDisplayName.textContent = displayName;
                userDisplayName.style.display = 'inline-block';
                userIcon.style.display = 'inline-block';
                signOutBtn.style.display = 'inline-block';
                return;
            }
        }
        // Default state when no user stored or invalid user data
        userDisplayName.textContent = '';
        userDisplayName.style.display = 'none';
        userIcon.style.display = 'none';
        signOutBtn.style.display = 'none';
        signInBtn.style.display = 'inline-block';
    } catch (e) {
        console.error('Failed to read stored user', e);
        // Default state on error
        userDisplayName.textContent = '';
        userDisplayName.style.display = 'none';
        userIcon.style.display = 'none';
        signOutBtn.style.display = 'none';
        signInBtn.style.display = 'inline-block';
    }
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 600) { // Runtime condition
        nav.style.height = '64px';
        toggleNav.style.display = 'flex';
        show_el.map(showElements);
        // Re-apply auth UI state so sign in doesn't reappear when logged in
        applyStoredUserToNavbar();
        menuClicked = false; // prevent to disappear showing elements in mobile screen during click like search box and sign in button
        menu.innerHTML = `<img src="Resource/img/menu.png" alt="" width="30px" id="menuImg">`;
    }
    else if (window.innerWidth <= 600 && menuClicked == false) { // Runtime condition
        hide_el.map(hideElements);
    }
});

menu.addEventListener('click', () => {
    menuClicked = true; // menuClicked will be true if user clicks on menu button
    if (toggleNav.style.display == 'flex') { // Condition for hide elements
        menu.innerHTML = `<img src="Resource/img/menu.png" alt="" width="30px" id="menuImg">`
        nav.style.height = '64px';
        setTimeout(() => {
            hide_el.map(hideElements);
        }, 50);
    }
    else { // Condition for show elements
        menu.innerHTML = `<img src="Resource/img/close.png" alt="" width="25px" id="menuImg">`
        nav.style.transition = '0.5s';
        nav.style.height = '400px';
        setTimeout(() => {
            toggleNav.style.display = 'flex';
            show_el.map(showElements);
            // Ensure auth UI stays consistent when menu opens in mobile view
            applyStoredUserToNavbar();
        }, 100);
    }
});

signInBtn.addEventListener('click', () => { // show authentication modal when user clicks on sign in button
    clearAuthFields();
    authModal.style.display = 'flex';

});

// Switch to Login
toLogin.addEventListener('click', () => { // switch to login view when user clicks on login button
    clearAuthFields(); // Clear fields for security when switching
    authBox.style.height = "430px";
    switchView(loginView, registerView);
});

// Switch to Register
toRegister.addEventListener('click', () => { // switch to register view when user clicks on register button
    clearAuthFields(); // Clear fields for security when switching
    authBox.style.height = "580px";
    switchView(registerView, loginView);
});


// For animation
function switchView(showView, hideView) { // switch view from login to register and vice versa but with animation
    // 1. Hide the current view immediately
    hideView.style.display = 'none';
    hideView.classList.remove('animate-view');

    // 2. Show the new view
    showView.style.display = 'block';

    // 3. Trigger the animation
    showView.classList.add('animate-view');
}


// Close Modal
closeModal.addEventListener('click', () => { // close authentication modal when user clicks on close button
    authModal.style.display = 'none';
});

window.addEventListener('click', (e) => { // close authentication modal / booking modal when user clicks outside the modal
    if (e.target === authModal) authModal.style.display = 'none';
    if (e.target === bookingModal) bookingModal.style.display = 'none';
});



function checkEmail(email) { // check if the email is valid
    const invalidChars = ` !&*"'\\,:;<>()[]{}|/`;

    for (const ch of invalidChars) { // it will check whether the given registerEmailhas invalid character or not.
        if (email.includes(ch)) {
            return false;
        }
    }
    let emailValidCondition_1 = (email.includes('@googlemail.com') || email.includes('@gmail.com' || email.includes('@email.com')))
    let emailValidCondition_2 = (email.endsWith('.com'));

    if (emailValidCondition_1 === true && emailValidCondition_2 === true) {
        return true
    }
    return false;
}


registerEmail.addEventListener('input', () => {

})


registerBtn.addEventListener('click', () => {
    const name = registerName.value.trim();
    const register_email = registerEmail.value.trim();
    const passwords = Array.from(registerPassword).map(p => p.value);

    if (!name || !register_email || passwords.some(p => !p)) {
        alert("Please fill up the details");
        return;
    }

    if (passwords[0] !== passwords[1]) {
        alert("Passwords do not match");
        return;
    }

    const emailOk = checkEmail(register_email);
    if (!emailOk) {
        alert("Invalid Email");
        return;
    }

    const payload = {
        username: name,
        email: register_email,
        password: passwords[0]
    };

    fetch('https://eventify-backend.railway.app/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(async (res) => {
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const msg = data.error || 'Registration failed';
                throw new Error(msg);
            }
            return res.json();
        })
        .then((data) => {
            alert('Registration successful! You can now log in.');
            // Clear fields
            registerName.value = "";
            registerEmail.value = "";
            registerPassword.forEach(p => p.value = "");
            // Switch to login view
            authBox.style.height = "430px";
            switchView(loginView, registerView);
        })
        .catch((err) => {
            console.error(err);
            alert(err.message || 'Could not register. Make sure backend is running.');
        });
})

// Login
loginBtn.addEventListener('click', () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    const payload = { email, password };

    fetch('https://eventify-backend.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(async (res) => {
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const msg = data.error || 'Login failed';
                throw new Error(msg);
            }
            return res.json();
        })
        .then((data) => {
            const displayName = data.username || data.email;
            showPopupMessage('Login Successful!', `Welcome back, ${displayName}!`, 'success');
            // store basic user info in localStorage (no JWT yet)
            localStorage.setItem('eventifyUser', JSON.stringify(data));
            // update navbar: hide sign in, show name + sign out + user icon
            signInBtn.style.display = 'none';
            userDisplayName.textContent = displayName;
            userDisplayName.style.display = 'inline-block';
            userIcon.style.display = 'inline-block';
            signOutBtn.style.display = 'inline-block';
            authModal.style.display = 'none';

            // Force immediate display update
            setTimeout(() => {
                userDisplayName.style.display = 'inline-block';
                userIcon.style.display = 'inline-block';
            }, 100);
        })
        .catch((err) => {
            console.error(err);
            alert(err.message || 'Could not login. Make sure backend is running.');
        });
});

// On page load, keep user logged-in display if info exists
window.addEventListener('DOMContentLoaded', () => {
    applyStoredUserToNavbar();
});

// Sign out: clear local storage and restore Sign in button
signOutBtn.addEventListener('click', () => {
    showSignOutConfirmation();
});

// ---------------- BOOKING FLOW ----------------

const bookButtons = document.querySelectorAll('.book-btn');
const bookingModal = document.getElementById('bookingModal');
const closeBookingModal = document.getElementById('closeBookingModal');
const bookingForm = document.getElementById('bookingForm');
const bookingEventName = document.getElementById('bookingEventName');
const bookingEventMeta = document.getElementById('bookingEventMeta');
const bookingTickets = document.getElementById('bookingTickets');
const bookingPricePerTicket = document.getElementById('bookingPricePerTicket');
const bookingTotalAmount = document.getElementById('bookingTotalAmount');

function parsePrice(text) {
    // Expect formats like "₹999 onwards"
    const match = text.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
    if (!match) return 0;
    return Number(match[1]);
}

function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

bookButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.event-card');
        if (!card) return;

        const titleEl = card.querySelector('h3');
        const metaEl = card.querySelector('.location');
        const priceEl = card.querySelector('.price');


        const eventName = titleEl ? titleEl.textContent.trim() : 'Event';
        const eventMeta = metaEl ? metaEl.textContent.replace(/\s+/g, ' ').trim() : '';

        const priceText = priceEl ? priceEl.textContent.trim() : '';

        const price = parsePrice(priceText);

        bookingEventName.value = eventName;
        bookingEventMeta.value = eventMeta;
        bookingTickets.value = 1;
        bookingPricePerTicket.value = formatCurrency(price);
        bookingTotalAmount.value = formatCurrency(price);

        bookingModal.style.display = 'flex';
    });
});

closeBookingModal.addEventListener('click', () => {
    bookingModal.style.display = 'none';
});

bookingTickets.addEventListener('input', () => {
    const tickets = Math.max(1, Number(bookingTickets.value) || 1);
    bookingTickets.value = tickets;

    const priceText = bookingPricePerTicket.value;
    const price = parsePrice(priceText);
    const total = tickets * price;
    bookingTotalAmount.value = formatCurrency(total);
});

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('eventifyUser'));
    if (!user) {
        alert('Please sign in to make a booking');
        return;
    }

    const tickets = Number(bookingTickets.value) || 1;
    const pricePerTicket = parsePrice(bookingPricePerTicket.value);
    const totalAmount = tickets * pricePerTicket;

    const bookingData = {
        eventName: bookingEventName.value,
        eventMeta: bookingEventMeta.value,
        tickets,
        pricePerTicket,
        totalAmount,
        userId: user.id
    };

    // Save booking data to localStorage for payment page
    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

    // Redirect to payment page
    window.location.href = 'payment.html';
});

// ---------------- POPUP FUNCTIONS ----------------

// Show themed popup message
function showPopupMessage(title, message, type = 'success', callback = null) {
    // Remove any existing popup and overlay
    const existingPopup = document.querySelector('.payment-popup');
    const existingOverlay = document.querySelector('.popup-overlay');
    if (existingPopup) {
        existingPopup.remove();
    }
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // Create blur overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;

    const popup = document.createElement('div');
    popup.className = 'payment-popup';

    const bgColor = type === 'success'
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

    const icon = type === 'success'
        ? '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>'
        : '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>';

    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 47%;
        transform: translate(-50%, -50%);
        background: ${bgColor};
        color: white;
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        text-align: center;
        min-width: 280px;
        animation: slideIn 0.3s ease-out;
    `;

    popup.innerHTML = `
        <div style="margin-bottom: 25px;">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="white" style="margin-bottom: 20px;">
                ${icon}
            </svg>
            <h3 style="margin: 0; font-size: 1.8em; font-weight: 600;">${title}</h3>
        </div>
        <p style="margin: 20px 0; line-height: 1.6; font-size: 1.2em;">
            ${message}
        </p>
        <button class="popup-ok-btn" style="
            margin-top: 25px;
            padding: 15px 30px;
            background: linear-gradient(45deg, #f4385d, #e03452);
            color: white;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            font-size: 1.2em;
            box-shadow: 0 5px 15px rgba(244, 56, 93, 0.3);
            transition: all 0.3s ease;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(244, 56, 93, 0.4)'" 
           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(244, 56, 93, 0.3)'">OK</button>
    `;

    // Add click handler to OK button
    const okButton = popup.querySelector('.popup-ok-btn');
    okButton.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
        if (callback) {
            callback();
        }
    });

    // Add animation style if not already added
    if (!document.getElementById('popup-animation-style')) {
        const style = document.createElement('style');
        style.id = 'popup-animation-style';
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add overlay and popup to body
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
}

// Show sign out confirmation popup
function showSignOutConfirmation() {
    // Remove any existing popup and overlay
    const existingPopup = document.querySelector('.payment-popup');
    const existingOverlay = document.querySelector('.popup-overlay');
    if (existingPopup) {
        existingPopup.remove();
    }
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // Create blur overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;

    const popup = document.createElement('div');
    popup.className = 'payment-popup';

    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 47%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        text-align: center;
        min-width: 280px;
        animation: slideIn 0.3s ease-out;
    `;

    popup.innerHTML = `
        <div style="margin-bottom: 25px;">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="white" style="margin-bottom: 20px;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <h3 style="margin: 0; font-size: 1.8em; font-weight: 600;">Sign Out</h3>
        </div>
        <p style="margin: 20px 0; line-height: 1.6; font-size: 1.2em;">
            Do you really want to sign out? You'll need to log in again to access your account.
        </p>
        <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
            <button class="cancel-signout-btn" style="
                padding: 15px 30px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                font-size: 1.2em;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" 
               onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">Cancel</button>
            <button class="confirm-signout-btn" style="
                padding: 15px 30px;
                background: linear-gradient(45deg, #f4385d, #e03452);
                color: white;
                border: none;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                font-size: 1.2em;
                box-shadow: 0 5px 15px rgba(244, 56, 93, 0.3);
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(244, 56, 93, 0.4)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(244, 56, 93, 0.3)'">Sign Out</button>
        </div>
    `;

    // Add click handlers
    const cancelBtn = popup.querySelector('.cancel-signout-btn');
    const confirmBtn = popup.querySelector('.confirm-signout-btn');

    cancelBtn.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });

    confirmBtn.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
        proceedWithSignOut();
    });

    // Add animation style if not already added
    if (!document.getElementById('popup-animation-style')) {
        const style = document.createElement('style');
        style.id = 'popup-animation-style';
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add overlay and popup to body
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
}

// Proceed with sign out
function proceedWithSignOut() {
    localStorage.removeItem('eventifyUser');
    userDisplayName.textContent = '';
    userDisplayName.style.display = 'none';
    userIcon.style.display = 'none';
    signOutBtn.style.display = 'none';
    signInBtn.style.display = 'inline-block';

    // Show success message
    showPopupMessage('Signed Out', 'You have been successfully signed out.', 'success');
}