document.addEventListener('DOMContentLoaded', () => {
   const animatedEl    = document.getElementById('hero-typing-text');
   const animatedTexts = ['Cari', 'Temukan', 'Beli', 'Jual'];

   const animateText = (texts: string[], element: HTMLElement) => {
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
          }, 2000);
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
    el             : "#main",
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

  if (animatedEl) animateText(animatedTexts, animatedEl);
});
