import 'regenerator-runtime';
import '../styles/main.scss';
import App from './app';

const app = new App({
  content: document.querySelector('#mainContent'),
  button: document.querySelector('#hamburgerButton'),
  drawer: document.querySelector('#navigationDrawer'),
});

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  app.renderPage();
});

// Close drawer when clicking outside
document.addEventListener('click', (event) => {
  const drawer = document.querySelector('#navigationDrawer');
  const hamburger = document.querySelector('#hamburgerButton');

  if (!drawer.contains(event.target) && !hamburger.contains(event.target)) {
    drawer.classList.remove('open');
  }
});