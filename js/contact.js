const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('.form-status');

const messages = {
  name: 'Please enter at least two characters for your name.',
  email: 'Please enter a valid email address.',
  message: 'Please write a message of at least ten characters.',
};

function validateField(field) {
  const error = document.querySelector(`#${field.id}-error`);
  const isValid = field.validity.valid;
  error.textContent = isValid ? '' : messages[field.id];
  field.setAttribute('aria-invalid', String(!isValid));
  field.setAttribute('aria-describedby', `${field.id}-error`);
  return isValid;
}

form.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validateField(field);
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll('input, textarea')];
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    formStatus.textContent = 'Please check the highlighted fields and try again.';
    formStatus.className = 'form-status is-error';
    fields.find((field) => !field.validity.valid)?.focus();
    return;
  }
  formStatus.textContent =
    'The form validation worked. This demonstration form has not sent your message because it is not connected to a submission service.';
  formStatus.className = 'form-status is-success';
  form.reset();
  fields.forEach((field) => field.removeAttribute('aria-invalid'));
});
