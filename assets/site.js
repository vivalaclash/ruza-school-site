const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
}

menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});
matchMedia('(max-width: 900px)').addEventListener('change', () => setMenu(false));

document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) setMenu(false);
});

const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sectionObserver = new IntersectionObserver(entries => {
  const visible = entries.find(entry => entry.isIntersecting);
  if (!visible) return;
  sectionLinks.forEach(link => {
    if (link.hash === '#' + visible.target.id) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}, { rootMargin: '-15% 0px -65% 0px' });

sectionLinks.forEach(link => {
  sectionObserver.observe(document.querySelector(link.hash));
});

const dialog = document.querySelector('#photo-dialog');
const largePhoto = document.querySelector('#large-photo');
const photoCaption = document.querySelector('#photo-caption');

document.querySelectorAll('[data-photo]').forEach(button => {
  button.addEventListener('click', () => {
    largePhoto.src = button.dataset.photo;
    largePhoto.alt = button.querySelector('img').alt;
    photoCaption.textContent = button.dataset.caption;
    dialog.showModal();
  });
});

document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const {left, right, top, bottom} = dialog.getBoundingClientRect();
  if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) {
    dialog.close();
  }
});

const copy = document.querySelector('#copy');
const address = document.querySelector('address');
const copyLabel = copy.textContent;
let resetCopyLabel;

copy.addEventListener('click', async () => {
  clearTimeout(resetCopyLabel);
  try {
    await navigator.clipboard.writeText(address.innerText.replace(/\s+/g, ' ').trim());
    copy.textContent = 'Адрес скопирован ✓';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(address);
    selection.removeAllRanges();
    selection.addRange(range);
    copy.textContent = 'Адрес выделен для копирования';
  }
  resetCopyLabel = setTimeout(() => { copy.textContent = copyLabel; }, 3000);
});
