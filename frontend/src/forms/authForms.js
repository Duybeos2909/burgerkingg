export function createAuthForms({
  apiFetch,
  saveAuthSession,
  loginForm,
  rewardsForm,
  loginError,
  formError,
  authModal,
  cartSidebar,
  loginEmail,
  loginPassword,
  onAuthenticated
}) {
  function showError(element, message) {
    element.style.display = 'block';
    element.textContent = message;
  }

  function openAuthModal() {
    loginError.style.display = 'none';
    authModal.style.display = 'flex';
    authModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => loginEmail.focus(), 20);
  }

  function closeAuthModal() {
    authModal.style.display = 'none';
    authModal.setAttribute('aria-hidden', 'true');
    if (!cartSidebar.classList.contains('open')) document.body.style.overflow = '';
  }

  async function handleRegister(event) {
    event.preventDefault();
    formError.style.display = 'none';

    const payload = {
      first_name: document.getElementById('firstName').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value.trim(),
      dob: document.getElementById('dob').value,
      postcode: document.getElementById('postcode').value.trim(),
      marketing_emails: document.getElementById('offers').checked
    };

    if (!payload.first_name || !payload.email || !payload.password || !payload.dob || !payload.postcode) {
      return showError(formError, 'Please complete all required fields.');
    }
    if (payload.password.length < 8) {
      return showError(formError, 'Password must be at least 8 characters long.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return showError(formError, 'Please enter a valid email address.');
    }

    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      saveAuthSession(data.token, data.user);
      rewardsForm.reset();
      await onAuthenticated('account created');
    } catch (error) {
      showError(formError, error.message || 'Could not create account.');
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    loginError.style.display = 'none';

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    if (!email || !password) {
      return showError(loginError, 'Please enter your email and password.');
    }

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      saveAuthSession(data.token, data.user);
      closeAuthModal();
      await onAuthenticated('signed in');
    } catch (error) {
      showError(loginError, error.message || 'Could not sign in.');
    }
  }

  function bind() {
    loginForm.addEventListener('submit', handleLogin);
    rewardsForm.addEventListener('submit', handleRegister);
    document.getElementById('open-login').addEventListener('click', openAuthModal);
    document.getElementById('close-auth-modal').addEventListener('click', closeAuthModal);
    authModal.addEventListener('click', (event) => {
      if (event.target === authModal) closeAuthModal();
    });
  }

  return { openAuthModal, bind };
}
