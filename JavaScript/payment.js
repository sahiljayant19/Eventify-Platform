// Payment Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('Payment page loaded');
    loadBookingDetails();
    setupPaymentTabs();
    // Add a small delay to ensure booking details are loaded before generating QR code
    setTimeout(() => {
        generateQRCode();
    }, 500);
    startPaymentStatusCheck();
    setupCardFormatting();
});

// Load booking details from localStorage or URL parameters
function loadBookingDetails() {
    console.log('Loading booking details...');
    const bookingData = JSON.parse(localStorage.getItem('pendingBooking'));
    
    console.log('Booking data:', bookingData);
    
    if (!bookingData) {
        showPopupMessage('No Booking Data', 'No booking data found. Please start your booking again.', 'error');
        window.location.href = 'index.html';
        return;
    }

    // Update summary with error handling
    try {
        const eventNameEl = document.getElementById('summaryEventName');
        const eventMetaEl = document.getElementById('summaryEventMeta');
        const ticketsEl = document.getElementById('summaryTickets');
        const pricePerTicketEl = document.getElementById('summaryPricePerTicket');
        const totalAmountEl = document.getElementById('summaryTotalAmount');
        const qrAmountEl = document.getElementById('qrAmount');
        const cardAmountEl = document.getElementById('cardAmount');
        const bankAmountEl = document.getElementById('bankAmount');
        const bookingIdEl = document.getElementById('bookingId');

        if (eventNameEl) eventNameEl.textContent = bookingData.eventName || 'Event Name';
        if (eventMetaEl) eventMetaEl.textContent = bookingData.eventMeta || 'Event Details';
        if (ticketsEl) ticketsEl.textContent = bookingData.tickets || 1;
        if (pricePerTicketEl) pricePerTicketEl.textContent = formatCurrency(bookingData.pricePerTicket || 0);
        if (totalAmountEl) totalAmountEl.textContent = formatCurrency(bookingData.totalAmount || 0);
        if (qrAmountEl) qrAmountEl.textContent = formatCurrency(bookingData.totalAmount || 0);
        if (cardAmountEl) cardAmountEl.textContent = formatCurrency(bookingData.totalAmount || 0);
        if (bankAmountEl) bankAmountEl.textContent = formatCurrency(bookingData.totalAmount || 0);
        
        // Generate booking ID
        const bookingId = 'EVT' + Date.now().toString().slice(-8);
        if (bookingIdEl) bookingIdEl.textContent = bookingId;
        
        // Store booking data for payment processing
        localStorage.setItem('currentBookingId', bookingId);
        
        console.log('Booking details loaded successfully');
    } catch (error) {
        console.error('Error loading booking details:', error);
        showPopupMessage('Error', 'Error loading booking details. Please try again.', 'error');
    }
}

// Setup payment method tabs
function setupPaymentTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const paymentSections = document.querySelectorAll('.payment-content-section');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const method = button.dataset.method;
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding payment section
            paymentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${method}-payment`).classList.add('active');
        });
    });
}

// Generate QR Code for UPI payment using real QR code library
function generateQRCode() {
    console.log('Generating QR code...');
    const bookingData = JSON.parse(localStorage.getItem('pendingBooking'));
    const bookingId = document.getElementById('bookingId')?.textContent;
    
    if (!bookingData) {
        console.error('No booking data for QR code');
        return;
    }
    
    // UPI payment string format
    const upiId = '9079184709@ybl';
    const amount = bookingData.totalAmount;
    const transactionNote = `Eventify Booking - ${bookingId}`;
    
    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=Eventify&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    
    console.log('UPI URL:', upiUrl);
    
    // Check if QRCode library is available
    if (typeof QRCode === 'undefined') {
        console.error('QRCode library not loaded');
        // Fallback to Google Charts API
        generateQRCodeGoogleCharts(upiUrl);
        return;
    }
    
    try {
        // Clear any existing QR code
        const qrContainer = document.getElementById('qrcode');
        if (qrContainer) {
            qrContainer.innerHTML = '';
            
            // Generate QR code using the library
            new QRCode(qrContainer, {
                text: upiUrl,
                width: 200,
                height: 200,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
            
            // Add instructions
            const instructions = document.createElement('p');
            instructions.style.cssText = 'font-size: 0.8em; color: #666; margin-top: 10px;';
            instructions.textContent = 'Scan with any UPI app';
            qrContainer.appendChild(instructions);
            
            console.log('QR code generated successfully');
        }
    } catch (error) {
        console.error('Error generating QR code:', error);
        // Fallback to Google Charts API
        generateQRCodeGoogleCharts(upiUrl);
    }
}

// Generate QR Code using Google Charts API as fallback
function generateQRCodeGoogleCharts(text) {
    console.log('Using Google Charts API fallback...');
    
    const qrContainer = document.getElementById('qrcode');
    if (!qrContainer) return;
    
    qrContainer.innerHTML = '';
    
    // Create img element for Google Charts QR code
    const img = document.createElement('img');
    img.src = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(text)}&choe=UTF-8`;
    img.alt = 'Payment QR Code';
    img.style.border = '1px solid #ddd';
    img.borderRadius = '8px';
    
    img.onload = function() {
        console.log('Google Charts QR code loaded successfully');
        // Add instructions
        const instructions = document.createElement('p');
        instructions.style.cssText = 'font-size: 0.8em; color: #666; margin-top: 10px;';
        instructions.textContent = 'Scan with any UPI app';
        qrContainer.appendChild(instructions);
    };
    
    img.onerror = function() {
        console.error('Google Charts QR code failed to load');
        // Final fallback - show manual instructions
        qrContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; border: 2px dashed #ccc; border-radius: 10px; background: #f9f9f9;">
                <p style="color: #666; margin-bottom: 15px; font-weight: bold;">QR Code temporarily unavailable</p>
                <p style="font-size: 0.9em; color: #888; margin-bottom: 15px;">Please use the UPI ID below to pay:</p>
                <p style="font-size: 1.1em; color: #333; font-weight: bold;">9079184709@ybl</p>
                <p style="font-size: 0.9em; color: #666; margin-top: 10px;">Amount: ₹${JSON.parse(localStorage.getItem('pendingBooking'))?.totalAmount || 0}</p>
            </div>
        `;
    };
    
    qrContainer.appendChild(img);
}

// Copy UPI ID to clipboard
function copyUpiId() {
    const upiId = '9079184709@ybl';
    
    navigator.clipboard.writeText(upiId).then(() => {
        // Show success message
        const button = event.target.closest('.copy-btn');
        const originalText = button.innerHTML;
        button.innerHTML = '<img src="Resource/svg/check.svg" alt="Copied"> Copied!';
        button.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = 'linear-gradient(45deg, #007bff, #0056b3)';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showPopupMessage('Copy Failed', 'Failed to copy UPI ID. Please copy manually: 9079184709@ybl', 'error');
    });
}

// Start payment status checking
function startPaymentStatusCheck() {
    const statusElement = document.getElementById('paymentStatus');
    
    if (!statusElement) return;
    
    // Show waiting status indefinitely until manual confirmation
    statusElement.innerHTML = `
        <div class="status-pending">
            <div class="spinner"></div>
            <p>Waiting for payment...</p>
            <small style="color: #666; display: block; margin-top: 10px;">
                Please complete the payment using your UPI app.<br>
                This page will update automatically once payment is received.
            </small>
        </div>
    `;
    
    // Add manual confirmation button for testing
    setTimeout(() => {
        const manualConfirmBtn = document.createElement('button');
        manualConfirmBtn.textContent = 'I have completed the payment';
        manualConfirmBtn.style.cssText = `
            margin-top: 15px;
            padding: 10px 20px;
            background: linear-gradient(45deg, #28a745, #20c997);
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9em;
        `;
        manualConfirmBtn.onclick = confirmPayment;
        statusElement.appendChild(manualConfirmBtn);
    }, 5000);
}

// Confirm payment and redirect
function confirmPayment() {
    confirmPaymentWithMethod('UPI');
}

// Save booking to backend
async function saveBookingToBackend(bookingData, bookingId) {
    try {
        const user = JSON.parse(localStorage.getItem('eventifyUser'));
        
        // Log user info for debugging
        console.log('Current user:', user);
        
        const payload = {
            eventName: bookingData.eventName,
            eventMeta: bookingData.eventMeta,
            tickets: bookingData.tickets,
            pricePerTicket: bookingData.pricePerTicket,
            totalAmount: bookingData.totalAmount,
            bookingId: bookingId,
            userId: user ? user.id : null,
            paymentMethod: bookingData.paymentMethod || 'UPI',
            paymentStatus: 'completed',
            timestamp: new Date().toISOString()
        };
        
        console.log('Saving booking to backend:', payload);
        console.log('Backend URL: https://eventify-backend.railway.app/api/bookings');
        
        const response = await fetch('https://eventify-backend.railway.app/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        console.log('Backend response status:', response.status);
        console.log('Backend response ok:', response.ok);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to save booking to backend. Status:', response.status);
            console.error('Error response:', errorText);
            
            try {
                const errorData = JSON.parse(errorText);
                console.error('Parsed error data:', errorData);
                showPopupMessage('Backend Error', `Booking confirmed but failed to save to server: ${errorData.error || 'Unknown error'}`, 'error');
            } catch {
                showPopupMessage('Backend Error', `Booking confirmed but failed to save to server. Status: ${response.status}`, 'error');
            }
            return;
        }
        
        const result = await response.json();
        console.log('Booking saved successfully:', result);
        
    } catch (error) {
        console.error('Network error saving booking:', error);
        showPopupMessage('Network Error', 'Booking confirmed but failed to save to server. Please check your internet connection and ensure the backend is running on localhost:8080.', 'error');
    }
}

// Setup card input formatting
function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    
    if (cardNumber) {
        // Format card number (add spaces every 4 digits)
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    if (expiryDate) {
        // Format expiry date (MM/YY)
        expiryDate.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    if (cvv) {
        // Only allow numbers for CVV
        cvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
        });
    }
}

// Process card payment
function processCardPayment() {
    const cardNumber = document.getElementById('cardNumber')?.value;
    const expiryDate = document.getElementById('expiryDate')?.value;
    const cvv = document.getElementById('cvv')?.value;
    const cardholderName = document.getElementById('cardholderName')?.value;
    
    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        showPopupMessage('Missing Information', 'Please fill in all card details', 'error');
        return;
    }
    
    if (cardNumber.replace(/\s/g, '').length < 16) {
        showPopupMessage('Invalid Card', 'Please enter a valid card number', 'error');
        return;
    }
    
    // Simulate card processing
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Processing...';
    
    setTimeout(() => {
        confirmPaymentWithMethod('Credit/Debit Card');
    }, 2000);
}

// Process net banking payment
function processNetBanking() {
    const bankSelect = document.getElementById('bankSelect');
    
    if (!bankSelect?.value) {
        showPopupMessage('Bank Required', 'Please select your bank', 'error');
        return;
    }
    
    // Simulate redirect to bank
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Redirecting to bank...';
    
    setTimeout(() => {
        confirmPaymentWithMethod('Net Banking');
    }, 2000);
}

// Confirm payment with specific method
function confirmPaymentWithMethod(paymentMethod) {
    const bookingData = JSON.parse(localStorage.getItem('pendingBooking'));
    const bookingId = document.getElementById('bookingId')?.textContent;
    
    if (!bookingData || !bookingId) {
        showPopupMessage('Booking Error', 'Booking information not found', 'error');
        return;
    }
    
    // Update status
    const statusElement = document.getElementById('paymentStatus');
    if (statusElement) {
        statusElement.innerHTML = `
            <div style="color: #28a745;">
                <img src="Resource/svg/check.svg" alt="Success" style="width: 24px; height: 24px;">
                <p>Payment Successful!</p>
            </div>
        `;
        statusElement.style.borderColor = 'rgba(40, 167, 69, 0.3)';
        statusElement.style.background = 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)';
    }
    
    // Store booking data for confirmation page
    const confirmationData = {
        ...bookingData,
        bookingId: bookingId,
        paymentMethod: paymentMethod,
        paymentStatus: 'completed'
    };
    localStorage.setItem('pendingBooking', JSON.stringify(confirmationData));
    
    // Save booking to backend
    saveBookingToBackend(confirmationData, bookingId);
    
    // Show success message and redirect to home
    setTimeout(() => {
        showPopupMessage(
            'Payment Successful!', 
            'Your booking has been confirmed. Click OK to go to the home page.',
            'success',
            () => {
                localStorage.removeItem('pendingBooking');
                window.location.href = 'index.html';
            }
        );
    }, 2000);
}

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
        left: 50%;
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
    
    // Add animation styles if not already added
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

// Format currency
function formatCurrency(amount) {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
}
