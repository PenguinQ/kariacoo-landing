const debounce = (callback: (...args: any) => void, delay = 300) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: any) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  /**
   * -------------------
   * Header menu scripts
   * -------------------
   */
  const navToggle       = document.getElementsByClassName('header-nav-toggle')[0];
  const navColumn       = document.getElementsByClassName('header-nav--col')[0];
  const navLinks        = document.querySelectorAll('.header-nav a');
  const navButtons      = document.querySelectorAll('.header-nav .button');

  const toggleMenuState = (state: boolean) => {
    if (state) {
      navToggle.removeAttribute('data-active');
      navColumn.removeAttribute('data-active');
    } else {
      navToggle.setAttribute('data-active', '');
      navColumn.setAttribute('data-active', '');
    }
  };

  const handleWindowResize = debounce(() => {
    if (window.innerWidth >= 768) {
      const isNavToggleActive = navToggle.hasAttribute('data-active');
      const isNavColumnActive = navColumn.hasAttribute('data-active');

      if (isNavToggleActive && isNavColumnActive) toggleMenuState(true);
    }
  });

  window.addEventListener('resize', handleWindowResize);

  navToggle?.addEventListener('click', () => {
    const isActive = navToggle.hasAttribute('data-active');

    toggleMenuState(isActive);
  });

  for (const link of navLinks) {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const target        = e.target as HTMLAnchorElement;
      const targetHref    = target.getAttribute('href') as string;
      const targetElement = document.querySelector(targetHref) as HTMLElement;

      targetElement?.scrollIntoView({ behavior: 'smooth' });
      toggleMenuState(true);
    });
  }

  for (const button of navButtons) {
    button.addEventListener('click', () => {
      toggleMenuState(true);
    });
  }

  /**
   * ---------------------
   * Intro section scripts
   * ---------------------
   */
   const introNextButton  = document.getElementById('intro-next');
   const introChatElement = document.getElementById('intro-chat-text');
   const introTexts = [
    'Sure, I think we can do it!',
    'Well, I think this one better...',
    'I guess so? Why don\'t you contact Tono first for confirmation?',
    'Probably, but looks like the product isn\'t available right now.',
  ];

   const animateTexts = (texts: string[], element: HTMLElement) => {
    let textIndex  = 0;
    let typingText = '';
    let isTyping   = true;

    const animate = () => {
      if (isTyping) {
        if (typingText.length < texts[textIndex].length) {
          typingText = texts[textIndex].slice(0, typingText.length + 1);
          element.textContent = typingText;

          setTimeout(animate, 50);
        } else {
          setTimeout(() => {
            isTyping = false;
            animate();
          }, 1500);
        }
      } else {
        if (typingText.length > 0) {
          typingText = typingText.slice(0, -1);
          element.textContent = typingText;

          setTimeout(animate, 50);
        } else {
          isTyping  = true;
          textIndex = (textIndex + 1) % texts.length;

          setTimeout(animate, 300);
        }
      }
    }

    animate();
  };

  // @ts-ignore
  VANTA.DOTS({
    el: "#intro-container",
    mouseControls  : false,
    touchControls  : false,
    gyroControls   : false,
    minHeight      : 400.00,
    minWidth       : 400.00,
    scale          : 1.00,
    scaleMobile    : 1.00,
    showLines      : false,
    color          : 0xFFFFFF,
    backgroundAlpha: 0,
  });

  if (introChatElement) animateTexts(introTexts, introChatElement);

  introNextButton?.addEventListener('click', () => {
    const target = introNextButton.getAttribute('data-target');

    if (target) {
      const targetElement = document.querySelector(target) as HTMLElement;

      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });

  /**
   * Pricing section
   */
  // @ts-ignore
  new Swiper('.pricing-list', {
    slidesPerView : 1,
    spaceBetween  : 24,
    centeredSlides: false,
    breakpoints   : {
      320: {
        slidesPerView : 1.2,
        centeredSlides: true,
      },
      768: {
        slidesPerView : 2.2,
        centeredSlides: false,
      },
      1024: {
        slidesPerView : 4,
        centeredSlides: false,
      }
    },
  });

  /**
   * Testimonial section
   */
  // @ts-ignore
  new Swiper('.testimonial-list', {
    slidesPerView: 1,
    effect: 'cards',
    cardsEffect: {
      slideShadows: false,
    },
  });
});