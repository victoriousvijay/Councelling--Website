/* 
 * Professional Booking Form and Scheduling Script
 * Counselor: Mrs. Preeti Pareek
 * Technology: Vanilla JavaScript
 */

import { saveLead } from './firebase-service.js';

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('bookingForm');
  const dateInput = document.getElementById('preferredDate');
  const concernTextarea = document.getElementById('mainConcern');
  const charCounter = document.getElementById('charCounter');
  const modalOverlay = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const serviceSelect = document.getElementById('preferredService');

  if (!bookingForm) return;

  // --------------------------------------------------------------------------
  // 1. Minimum Date Control (Prevent selecting past dates)
  // --------------------------------------------------------------------------
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;
    dateInput.setAttribute('min', minDateStr);
  }

  // --------------------------------------------------------------------------
  // 2. Character Counter for the Main Concern Textarea
  // --------------------------------------------------------------------------
  if (concernTextarea && charCounter) {
    const maxLength = parseInt(concernTextarea.getAttribute('maxlength') || '500');
    
    const updateCharCount = () => {
      const currentLength = concernTextarea.value.length;
      const remaining = maxLength - currentLength;
      charCounter.textContent = `${remaining} characters remaining`;
    };

    concernTextarea.addEventListener('input', updateCharCount);
    updateCharCount(); // Initial count
  }

  // --------------------------------------------------------------------------
  // 3. Service Card Pre-Selector Interaction
  // --------------------------------------------------------------------------
  // Checks if there's a service parameter in the URL (e.g. index.html?service=career#booking)
  const preSelectServiceFromQuery = () => {
    if (!serviceSelect) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    
    if (serviceParam) {
      // Map short names to form select values
      const serviceMap = {
        'career': 'Career Counselling',
        'education': 'Education Counselling',
        'stress': 'Stress and Depression Support',
        'relationship': 'Relationship and Personal Counselling'
      };
      
      const mappedValue = serviceMap[serviceParam.toLowerCase()];
      if (mappedValue) {
        serviceSelect.value = mappedValue;
        
        // If there's #booking in hash, scroll to booking section
        if (window.location.hash === '#booking') {
          setTimeout(() => {
            const bookingSection = document.getElementById('booking');
            if (bookingSection) {
              bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 400);
        }
      }
    }
  };

  // Run on load
  preSelectServiceFromQuery();

  // --------------------------------------------------------------------------
  // 4. Client-Side Form Validation & Submission
  // --------------------------------------------------------------------------
  let isSubmitting = false;

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent duplicate submissions

    let isValid = true;

    // Helper functions for showing/hiding errors
    const showError = (inputEl, errorId) => {
      inputEl.classList.add('error');
      const errorMsg = document.getElementById(errorId);
      if (errorMsg) errorMsg.style.display = 'block';
      isValid = false;
    };

    const clearError = (inputEl, errorId) => {
      inputEl.classList.remove('error');
      const errorMsg = document.getElementById(errorId);
      if (errorMsg) errorMsg.style.display = 'none';
    };

    // Name Validation
    const nameInput = document.getElementById('fullName');
    if (nameInput) {
      if (nameInput.value.trim() === '') {
        showError(nameInput, 'fullNameError');
      } else {
        clearError(nameInput, 'fullNameError');
      }
    }

    // Phone Validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      const phoneRegex = /^[+]?[0-9]{8,15}$/;
      if (phoneInput.value.trim() === '' || !phoneRegex.test(phoneInput.value.replace(/\s/g, ''))) {
        showError(phoneInput, 'phoneError');
      } else {
        clearError(phoneInput, 'phoneError');
      }
    }

    // Email Validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value.trim() === '' || !emailRegex.test(emailInput.value)) {
        showError(emailInput, 'emailError');
      } else {
        clearError(emailInput, 'emailError');
      }
    }

    // Date Validation
    if (dateInput) {
      if (dateInput.value === '') {
        showError(dateInput, 'preferredDateError');
      } else {
        clearError(dateInput, 'preferredDateError');
      }
    }

    // Consent Validation
    const consentCheckbox = document.getElementById('consent');
    if (consentCheckbox) {
      if (!consentCheckbox.checked) {
        showError(consentCheckbox, 'consentError');
      } else {
        clearError(consentCheckbox, 'consentError');
      }
    }

    // If form is valid, trigger submission loading state
    if (isValid) {
      isSubmitting = true;
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const submitBtnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
      const originalText = submitBtnText ? submitBtnText.textContent : 'Book Session';

      if (submitBtnText) submitBtnText.textContent = 'Scheduling, please wait...';
      if (submitBtn) submitBtn.disabled = true;

      // Collect data
      const formData = {
        fullName: nameInput ? nameInput.value.trim() : '',
        ageGroup: document.getElementById('ageGroup') ? document.getElementById('ageGroup').value : '',
        phone: phoneInput ? phoneInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim() : '',
        preferredService: serviceSelect ? serviceSelect.value : '',
        preferredSessionMode: document.getElementById('sessionMode') ? document.getElementById('sessionMode').value : '',
        preferredDate: dateInput ? dateInput.value : '',
        preferredTime: document.getElementById('preferredTime') ? document.getElementById('preferredTime').value : '',
        mainConcern: concernTextarea ? concernTextarea.value.trim() : '',
        timestamp: new Date().toISOString()
      };

      try {
        // Save to Firestore Database
        const leadId = await saveLead('booking', formData);
        
        // Also save to LocalStorage for local redundancy/backup
        const existingBookings = JSON.parse(localStorage.getItem('counsellor_bookings') || '[]');
        existingBookings.push({ id: leadId, ...formData });
        localStorage.setItem('counsellor_bookings', JSON.stringify(existingBookings));

        // Reset submit button state
        isSubmitting = false;
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = originalText;

        // Reset Form
        bookingForm.reset();
        if (charCounter) charCounter.textContent = '500 characters remaining';

        // Show toast notification
        showToast(leadId ? 'Appointment request saved to database!' : 'Saved locally (offline mode)', 'success');

        // Display Success Modal
        if (modalOverlay) {
          modalOverlay.classList.add('active');
          document.body.style.overflow = 'hidden'; // Lock scrolling
        }
      } catch (err) {
        console.error("Submission failed:", err);
        isSubmitting = false;
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = originalText;
        showToast('Submission error. Please try again.', 'error');
      }
    }
  });

  // --------------------------------------------------------------------------
  // 5. Modal Close Action
  // --------------------------------------------------------------------------
  if (closeModalBtn && modalOverlay) {
    const closeModal = () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    };

    closeModalBtn.addEventListener('click', closeModal);
    
    // Close on clicking outside the modal card
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Helper for generating custom toast notifications
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' 
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

    toast.innerHTML = `
      ${icon}
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('active'), 50);

    // Remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
});
