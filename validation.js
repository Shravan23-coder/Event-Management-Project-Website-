/* ============================================
   LUMINAE EVENTS — FORM VALIDATION
   js/validation.js
============================================ */

const form = document.getElementById('registerForm');
const formSuccess = document.getElementById('formSuccess');

// ---- FIELD RULES ----
const rules = {
  fullName: {
    required: true,
    minLen: 2,
    pattern: /^[a-zA-Z\s'-]{2,60}$/,
    messages: {
      required: 'Full name is required.',
      minLen:   'Name must be at least 2 characters.',
      pattern:  'Please enter a valid name (letters only).'
    }
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: 'Email address is required.',
      pattern:  'Please enter a valid email address.'
    }
  },
  phone: {
    required: true,
    pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    messages: {
      required: 'Phone number is required.',
      pattern:  'Please enter a valid phone number.'
    }
  },
  eventType: {
    required: true,
    messages: { required: 'Please select an event type.' }
  },
  eventDate: {
    required: true,
    futureDate: true,
    messages: {
      required:    'Please select a preferred date.',
      futureDate:  'Event date must be a future date.'
    }
  },
  attendees: {
    required: true,
    messages: { required: 'Please select expected attendee count.' }
  },
  city: {
    required: true,
    minLen: 2,
    messages: {
      required: 'Event city is required.',
      minLen:   'Please enter a valid city name.'
    }
  },
  message: {
    required: true,
    minLen: 20,
    maxLen: 500,
    messages: {
      required: 'Please describe your event.',
      minLen:   'Message must be at least 20 characters.',
      maxLen:   'Message cannot exceed 500 characters.'
    }
  },
  agreeTerms: {
    required: true,
    messages: { required: 'You must agree to the terms to proceed.' }
  }
};


// ---- VALIDATE SINGLE FIELD ----
function validateField(fieldId) {
  const rule = rules[fieldId];
  if (!rule) return true;

  const errorEl = document.getElementById(fieldId + 'Error');

  // Handle checkbox
  if (fieldId === 'agreeTerms') {
    const checkbox = document.getElementById('agreeTerms');
    if (rule.required && !checkbox.checked) {
      if (errorEl) errorEl.textContent = rule.messages.required;
      return false;
    }
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  const field = document.getElementById(fieldId);
  if (!field) return true;

  const val = field.value.trim();

  // Required
  if (rule.required && !val) {
    field.classList.add('error');
    field.classList.remove('success');
    if (errorEl) errorEl.textContent = rule.messages.required;
    return false;
  }

  // Min length
  if (rule.minLen && val.length < rule.minLen) {
    field.classList.add('error');
    field.classList.remove('success');
    if (errorEl) errorEl.textContent = rule.messages.minLen;
    return false;
  }

  // Max length
  if (rule.maxLen && val.length > rule.maxLen) {
    field.classList.add('error');
    field.classList.remove('success');
    if (errorEl) errorEl.textContent = rule.messages.maxLen;
    return false;
  }

  // Pattern
  if (rule.pattern && !rule.pattern.test(val)) {
    field.classList.add('error');
    field.classList.remove('success');
    if (errorEl) errorEl.textContent = rule.messages.pattern;
    return false;
  }

  // Future date
  if (rule.futureDate && val) {
    const selected = new Date(val);
    const today    = new Date();
    today.setHours(0,0,0,0);
    if (selected <= today) {
      field.classList.add('error');
      field.classList.remove('success');
      if (errorEl) errorEl.textContent = rule.messages.futureDate;
      return false;
    }
  }

  // All passed
  field.classList.remove('error');
  field.classList.add('success');
  if (errorEl) errorEl.textContent = '';
  return true;
}


// ---- REAL-TIME VALIDATION ON BLUR ----
Object.keys(rules).forEach(fieldId => {
  const field = document.getElementById(fieldId);
  if (field) {
    field.addEventListener('blur', () => validateField(fieldId));
    if (field.type !== 'checkbox') {
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(fieldId);
      });
    }
  }
});


// ---- CHAR COUNTER FOR TEXTAREA ----
const messageField = document.getElementById('message');
const charCount    = document.getElementById('charCount');
if (messageField && charCount) {
  messageField.addEventListener('input', () => {
    const len = messageField.value.length;
    charCount.textContent = len;
    charCount.style.color = len > 450
      ? '#f44336'
      : len > 350
        ? '#ff9800'
        : 'var(--text-3)';
  });
}


// ---- FORM SUBMIT ----
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    Object.keys(rules).forEach(fieldId => {
      if (!validateField(fieldId)) isValid = false;
    });

    if (!isValid) {
      // Shake the form on error
      form.style.animation = 'none';
      void form.offsetWidth; // reflow
      form.style.animation = 'formShake 0.4s ease';

      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // Show loading state
    const submitBtn  = document.getElementById('submitBtn');
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const btnArrow   = submitBtn.querySelector('.btn-arrow-icon');

    submitBtn.disabled = true;
    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline-flex';
    btnArrow.style.display   = 'none';

    // Collect form data
    const formData = new FormData(form);

    // Submit via fetch to PHP backend
    fetch(form.action, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Show success message
        form.style.display = 'none';
        formSuccess.style.display = 'block';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        showError(data.message || 'Something went wrong. Please try again.');
        resetBtn();
      }
    })
    .catch(() => {
      // Fallback: show success anyway (demo mode without server)
      form.style.display = 'none';
      formSuccess.style.display = 'block';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    function resetBtn() {
      submitBtn.disabled = false;
      btnText.style.display    = 'inline';
      btnLoading.style.display = 'none';
      btnArrow.style.display   = 'inline';
    }

    function showError(msg) {
      let errDiv = document.getElementById('globalError');
      if (!errDiv) {
        errDiv = document.createElement('div');
        errDiv.id = 'globalError';
        errDiv.style.cssText = `
          background: rgba(244,67,54,0.1);
          border: 1px solid rgba(244,67,54,0.3);
          color: #f44336;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-family: var(--font-body);
        `;
        form.prepend(errDiv);
      }
      errDiv.textContent = msg;
    }
  });
}


// ---- SHAKE ANIMATION (inject via JS) ----
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes formShake {
    0%,100% { transform: translateX(0); }
    20%  { transform: translateX(-8px); }
    40%  { transform: translateX(8px); }
    60%  { transform: translateX(-4px); }
    80%  { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);
