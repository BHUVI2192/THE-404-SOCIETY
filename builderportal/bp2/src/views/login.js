import { icon, brandMark } from '../lib/icons.js';
import { login, COMMON_PASSWORD, getSession } from '../auth.js';

export function loginView(container) {
  // If already logged in, redirect immediately to dashboard
  if (getSession()) {
    location.hash = '#/';
    return;
  }

  let errorMsg = '';
  let isSubmitting = false;

  function render() {
    container.innerHTML = `
      <div class="login-wrapper">
        <div class="login-decor-bg"></div>
        <div class="login-box">
          <div class="login-header">
            <div class="login-brand">
              <span class="brand-mark">${brandMark}</span>
              <div>
                <div class="login-app-title">builderportal</div>
                <div class="login-app-sub">The 404 Society · Internal Platform</div>
              </div>
            </div>
            <div class="login-badge-pill">Member Only</div>
          </div>

          <div class="login-card">
            <div class="login-card-header">
              <div class="login-welcome-title">Welcome, Builder</div>
              <p class="login-welcome-desc">
                Sign in using the unique Member ID sent to your email upon community acceptance.
              </p>
            </div>

            ${errorMsg ? `<div class="login-alert error">${errorMsg}</div>` : ''}

            <form id="signin-form" class="login-form">
              <div class="form-group">
                <div class="form-label-row">
                  <label for="member-id">Unique Member ID</label>
                  <span class="id-hint">Check your acceptance mail</span>
                </div>
                <div class="input-wrap login-input-wrap">
                  ${icon('badge')}
                  <input
                    type="text"
                    id="member-id"
                    name="memberId"
                    class="input login-input"
                    placeholder="e.g. 404-9F82"
                    autocomplete="username"
                    required
                    autofocus
                    spellcheck="false"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="form-label-row">
                  <label for="password">Password</label>
                  <span class="password-hint">Common: <code>${COMMON_PASSWORD}</code></span>
                </div>
                <div class="input-wrap login-input-wrap">
                  ${icon('lock')}
                  <input
                    type="password"
                    id="password"
                    name="password"
                    class="input login-input"
                    value="${COMMON_PASSWORD}"
                    autocomplete="current-password"
                    required
                  />
                  <button type="button" class="btn-toggle-pass" id="btn-toggle-pass" title="Toggle password visibility">
                    👁
                  </button>
                </div>
              </div>

              <button type="submit" class="btn primary btn-login-submit" ${isSubmitting ? 'disabled' : ''}>
                <span>${isSubmitting ? 'Authenticating...' : 'Enter Portal'}</span>
                ${icon('back', 'icon-flip')}
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Toggle password visibility
    const togglePassBtn = container.querySelector('#btn-toggle-pass');
    const passInput = container.querySelector('#password');
    if (togglePassBtn && passInput) {
      togglePassBtn.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        togglePassBtn.textContent = isPass ? '🔒' : '👁';
      });
    }

    // Sign in form submit
    const signinForm = container.querySelector('#signin-form');
    if (signinForm) {
      signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const memberId = container.querySelector('#member-id')?.value?.trim() || '';
        const password = container.querySelector('#password')?.value?.trim() || '';

        errorMsg = '';
        isSubmitting = true;
        render();

        try {
          await login(memberId, password);
          location.hash = '#/';
        } catch (err) {
          errorMsg = err.message || 'Login failed';
          isSubmitting = false;
          render();
        }
      });
    }
  }

  render();

  return () => {
    // cleanup
  };
}
