declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('signup-form') as HTMLFormElement | null;
  const emailInput = document.getElementById('signup-email') as HTMLInputElement | null;
  const submitBtn  = document.getElementById('signup-submit') as HTMLButtonElement | null;
  const errorEl    = document.getElementById('signup-error') as HTMLElement | null;
  const errorText  = document.getElementById('signup-error-text');
  const msg        = document.getElementById('signup-message');
  const ACTION     = 'https://68016909.sibforms.com/serve/MUIFAOKmiBTPtGKnUQZqJcWtOyceYOhPu_Ts6_7I4T5EzdKNz9Dk7tD4y1z-tl0qVnCp3nvGxp_bgnjniEAgeHnKAo-pwqXeUnmDYV1H1Dr7sTfP3HZzDmlit56E7Vi15h6As3__Wu8dGUePciyn-kvYDsyymlb7cG0BwTTVpZIlULKuQUolVpJZjSh45zVyta8zx0EPJGSbRIOYVg==';
  const SITE_KEY   = '6Lc-IOwsAAAAAJpOsmiW6jTMmTj_s2gfqzeRPgAp';

  const getRecaptchaToken = (): Promise<string> => new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error('reCAPTCHA belum siap'));

      return;
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha!
        .execute(SITE_KEY, { action: 'submit' })
        .then(resolve)
        .catch(reject);
    });
  });

  const showError = (text: string) => {
    if (!errorEl || !errorText || !emailInput) return;

    errorText.textContent = text;
    errorEl.hidden        = false;

    emailInput.setAttribute('aria-invalid', 'true');
  };

  const clearError = () => {
    if (!errorEl || !emailInput) return;

    errorEl.hidden = true;

    emailInput.removeAttribute('aria-invalid');
  };

  const originalLabel = submitBtn?.textContent?.trim() ?? 'Daftar';

  const setLoading = (loading: boolean) => {
    if (!submitBtn) return;

    submitBtn.disabled    = loading;
    submitBtn.textContent = loading ? 'Mengirim...' : originalLabel;

    if (loading) {
      submitBtn.setAttribute('aria-busy', 'true');
    } else {
      submitBtn.removeAttribute('aria-busy');
    }
  };

  if (form && emailInput && msg) {
    emailInput.addEventListener('input', clearError);

    let submitting = false;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (submitting) return;

      clearError();

      msg.hidden = true;

      const honeypot = form.elements.namedItem('email_address_check') as HTMLInputElement | null;

      if (honeypot && honeypot.value) {
        submitting = true;

        setLoading(true);

        const delay = 600 + Math.random() * 900;

        setTimeout(() => {
          msg.hidden      = false;
          msg.textContent = 'Terima kasih! Kalau emailmu valid, kami akan kabari saat Kariacoo hadir.';

          form.reset();

          submitting = false;

          setLoading(false);
        }, delay);

        return;
      }

      const value = emailInput.value.trim();

      if (!value) {
        showError('Email tidak boleh kosong.');

        emailInput.focus();

        return;
      }

      if (!emailInput.validity.valid) {
        showError('Masukkan alamat email seperti contoh@domain.com.');

        emailInput.focus();

        return;
      }

      submitting = true;

      setLoading(true);

      try {
        const token    = await getRecaptchaToken();
        const formData = new FormData(form);

        formData.set('g-recaptcha-response', token);

        await fetch(ACTION, {
          method: 'POST',
          mode  : 'no-cors',
          body  : formData
        });

        msg.hidden      = false;
        msg.textContent = 'Terima kasih! Kalau emailmu valid, kami akan kabari saat Kariacoo hadir.';

        form.reset();
      } catch {
        msg.hidden      = false;
        msg.textContent = 'Gagal mengirim. Coba lagi nanti.';
      } finally {
        submitting = false;

        setLoading(false);
      }
    });
  }
});
