// Active nav highlighting on scroll
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('nav a');
  const setActive = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY + 120 >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', setActive);
  setActive();

  // Contact form — opens the visitor's email app with the message pre-filled
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const YOUR_EMAIL = 'pvns1108@gmail.com';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const subject = `Portfolio contact form — message from ${name}`;
    const body = `${message}\n\n—\n${name}\n${email}`;

    const mailtoLink = `mailto:${YOUR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    status.textContent = 'Opening your email app to send this message…';
    status.style.display = 'block';
    form.reset();
  });
