// Zmienne globalne
let selectedPlan = '';
let selectedPrice = 0;

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
    });

    // Zamknij menu po kliknięciu w link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
      });
    });
  }

  // Smooth scroll dla linków
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Obsługa formularza zakupu
  const purchaseForm = document.getElementById('purchaseForm');
  if (purchaseForm) {
    purchaseForm.addEventListener('submit', handlePurchase);
  }

  // Formatowanie numeru karty
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', formatCardNumber);
  }

  // Formatowanie daty ważności
  const expiryInput = document.getElementById('expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', formatExpiry);
  }

  // Formatowanie CVV
  const cvvInput = document.getElementById('cvv');
  if (cvvInput) {
    cvvInput.addEventListener('input', formatCVV);
  }
});

// Otwórz modal zakupu
function openPurchaseModal(planName, price) {
  selectedPlan = planName;
  selectedPrice = price;

  const modal = document.getElementById('purchaseModal');
  const planInfo = document.getElementById('modalPlanInfo');

  planInfo.innerHTML = `
    <h3>Plan: ${planName}</h3>
    <div class="price-display">€${price}/miesiąc</div>
  `;

  // Reset formularza
  const form = document.getElementById('purchaseForm');
  if (form) {
    form.reset();
    form.style.display = 'flex';
  }

  // Ukryj komunikat sukcesu
  const successMessage = document.getElementById('successMessage');
  if (successMessage) {
    successMessage.style.display = 'none';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Zamknij modal
function closePurchaseModal() {
  const modal = document.getElementById('purchaseModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Zamknij modal po kliknięciu poza nim
window.addEventListener('click', function(event) {
  const modal = document.getElementById('purchaseModal');
  if (event.target === modal) {
    closePurchaseModal();
  }
});

// Formatowanie numeru karty (4 grupy po 4 cyfry)
function formatCardNumber(e) {
  let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
  e.target.value = formattedValue.substring(0, 19); // Max 16 cyfr + 3 spacje
}

// Formatowanie daty ważności (MM/RR)
function formatExpiry(e) {
  let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }

  e.target.value = value.substring(0, 5);
}

// Formatowanie CVV (max 3 cyfry)
function formatCVV(e) {
  let value = e.target.value.replace(/[^0-9]/gi, '');
  e.target.value = value.substring(0, 3);
}

// Walidacja numeru karty (algorytm Luhna)
function validateCardNumber(cardNumber) {
  const digits = cardNumber.replace(/\s+/g, '');

  if (digits.length !== 16) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Walidacja daty ważności
function validateExpiry(expiry) {
  const parts = expiry.split('/');

  if (parts.length !== 2) {
    return false;
  }

  const month = parseInt(parts[0]);
  const year = parseInt('20' + parts[1]);

  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
}

// Obsługa formularza zakupu
function handlePurchase(e) {
  e.preventDefault();

  const formData = {
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    company: document.getElementById('company').value,
    phone: document.getElementById('phone').value,
    cardNumber: document.getElementById('cardNumber').value,
    expiry: document.getElementById('expiry').value,
    cvv: document.getElementById('cvv').value,
    terms: document.getElementById('terms').checked,
    plan: selectedPlan,
    price: selectedPrice
  };

  // Walidacja
  if (!formData.fullName || !formData.email || !formData.phone) {
    alert('Proszę wypełnić wszystkie wymagane pola.');
    return;
  }

  if (!validateEmail(formData.email)) {
    alert('Proszę podać prawidłowy adres email.');
    return;
  }

  if (!validateCardNumber(formData.cardNumber)) {
    alert('Numer karty jest nieprawidłowy.');
    return;
  }

  if (!validateExpiry(formData.expiry)) {
    alert('Data ważności karty jest nieprawidłowa lub karta wygasła.');
    return;
  }

  if (formData.cvv.length !== 3) {
    alert('CVV musi zawierać 3 cyfry.');
    return;
  }

  if (!formData.terms) {
    alert('Musisz zaakceptować regulamin i politykę prywatności.');
    return;
  }

  // Symulacja procesu płatności
  processPurchase(formData);
}

// Walidacja email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Przetwarzanie zakupu
function processPurchase(formData) {
  const submitBtn = document.querySelector('#purchaseForm button[type="submit"]');
  const originalText = submitBtn.textContent;

  // Pokaż loader
  submitBtn.textContent = 'Przetwarzanie...';
  submitBtn.disabled = true;

  // Symulacja opóźnienia API
  setTimeout(() => {
    // W prawdziwej aplikacji tutaj byłoby wywołanie API do backendu
    console.log('Dane zakupu:', {
      ...formData,
      cardNumber: '****' + formData.cardNumber.slice(-4), // Maskowanie numeru karty
      cvv: '***' // Maskowanie CVV
    });

    // Ukryj formularz i pokaż komunikat sukcesu
    document.getElementById('purchaseForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';

    // Reset przycisku
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    // Wysyłka email potwierdzającego (symulacja)
    sendConfirmationEmail(formData);

    // Automatyczne zamknięcie modala po 5 sekundach
    setTimeout(() => {
      closePurchaseModal();
    }, 5000);

  }, 2000); // 2 sekundy symulacji przetwarzania
}

// Symulacja wysyłki emaila potwierdzającego
function sendConfirmationEmail(formData) {
  console.log(`Email potwierdzający wysłany do: ${formData.email}`);
  console.log(`Plan: ${formData.plan} - €${formData.price}/miesiąc`);

  // W prawdziwej aplikacji tutaj byłoby wywołanie API do wysyłki emaila
  // np. przez SendGrid, Mailgun, AWS SES, itp.
}

// Animacja scroll reveal dla sekcji
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Obserwuj sekcje dla animacji
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.features, .pricing, .about, .contact');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
});

// Obsługa ESC dla zamknięcia modala
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('purchaseModal');
    if (modal.classList.contains('active')) {
      closePurchaseModal();
    }
  }
});
