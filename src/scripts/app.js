import { createRestaurantItem, createRestaurantDetail } from './restaurant-item';

class App {
  constructor({ content, button, drawer }) {
    this._content = content;
    this._button = button;
    this._drawer = drawer;
    this._initialAppShell();
  }

  _initialAppShell() {
    this._button.addEventListener('click', (event) => {
      this._toggleDrawer(event);
    });
  }

  _toggleDrawer(event) {
    event.stopPropagation();
    this._drawer.classList.toggle('open');
  }

  _closeDrawer(event) {
    event.stopPropagation();
    this._drawer.classList.remove('open');
  }

  async renderPage() {
    const url = window.location.hash.slice(1).toLowerCase();
    const heroElement = document.querySelector('.hero');
    
    if (url === '') {
      heroElement.style.display = 'block';
      this._renderHomePage();
    } else if (url.startsWith('/detail/')) {
      heroElement.style.display = 'none';
      this._renderDetailPage(url.split('/')[2]);
    } else if (url === '/favorite') {
      heroElement.style.display = 'block';
      this._renderFavoritePage();
    }
  }

  async _renderHomePage() {
    try {
      this._content.innerHTML = '<div class="loading"></div>';
      const restaurants = await this._fetchRestaurants();
      const favoriteRestaurants = restaurants.filter(restaurant => restaurant.favorite);
      
      if (restaurants.length === 0) {
        this._content.innerHTML = `
          <div class="error">
            <h2>No restaurants found</h2>
            <p>Please try again later</p>
          </div>
        `;
        return;
      }

      this._content.innerHTML = `
        <section class="content">
          ${this._createFavoriteSection(favoriteRestaurants)}
          
          <div class="content__header">
            <h2 class="content__title">Explore All Restaurants</h2>
          </div>
          <div class="restaurants">
            ${restaurants.map((restaurant) => 
              createRestaurantItem(restaurant)
            ).join('')}
          </div>
        </section>
      `;

      this._initializeFavoriteButtons();
    } catch (error) {
      this._content.innerHTML = `
        <div class="error">
          <h2>Error loading restaurants</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  _createFavoriteSection(favoriteRestaurants) {
    if (favoriteRestaurants.length === 0) return '';

    const favoriteList = favoriteRestaurants
      .map(restaurant => `
        <div class="favorite-item">
          <div class="favorite-item__info">
            <h3><i class="fa fa-map-marker"></i> ${restaurant.city}</h3>
            <p>${restaurant.name}</p>
          </div>
          <a href="#/detail/${restaurant.id}" class="favorite-item__map-btn" aria-label="View restaurant details">
            <i class="fa fa-map"></i> View Detail
          </a>
        </div>
      `)
      .join('');

    return `
      <div class="favorite-section">
        <div class="content__header">
          <h2 class="content__title">Popular Restaurant in Citites</h2>
        </div>
        <div class="favorite-list">
          ${favoriteList}
        </div>
      </div>
    `;
  }

  async _renderDetailPage(id) {
    try {
      this._content.innerHTML = '<div class="loading"></div>';
      const restaurants = await this._fetchRestaurants();
      const restaurant = restaurants.find(r => r.id === id);

      if (!restaurant) {
        this._content.innerHTML = `
          <div class="error">
            <h2>Restaurant not found</h2>
            <p>The restaurant you're looking for doesn't exist</p>
          </div>
        `;
        return;
      }

      this._content.innerHTML = createRestaurantDetail(restaurant);
    } catch (error) {
      this._content.innerHTML = `
        <div class="error">
          <h2>Error loading restaurant detail</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  async _renderFavoritePage() {
    try {
      this._content.innerHTML = '<div class="loading"></div>';
      const restaurants = await this._fetchRestaurants();
      const favoriteRestaurants = restaurants.filter(restaurant => restaurant.favorite);

      if (favoriteRestaurants.length === 0) {
        this._content.innerHTML = `
          <section class="content">
            <div class="content__header">
              <h2 class="content__title">Your Favorite Restaurants</h2>
            </div>
            <div class="error">
              <h2>No favorites yet</h2>
              <p>Start adding restaurants to your favorites!</p>
            </div>
          </section>
        `;
        return;
      }

      this._content.innerHTML = `
        <section class="content">
          <div class="content__header">
            <h2 class="content__title">Your Favorite Restaurants</h2>
          </div>
          <div class="restaurants">
            ${favoriteRestaurants.map((restaurant) => 
              createRestaurantItem(restaurant)
            ).join('')}
          </div>
        </section>
      `;

      this._initializeFavoriteButtons();
    } catch (error) {
      this._content.innerHTML = `
        <div class="error">
          <h2>Error loading favorite restaurants</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  async _fetchRestaurants() {
    try {
      const response = await fetch('./data/DATA.json');
      const data = await response.json();
      return data.restaurants;
    } catch (error) {
      throw new Error('Failed to fetch restaurants');
    }
  }

  async _toggleFavorite(id) {
    try {
      const restaurants = await this._fetchRestaurants();
      const restaurant = restaurants.find(r => r.id === id);
      if (restaurant) {
        restaurant.favorite = !restaurant.favorite;
        // In a real application, you would update this to the server
        this.renderPage(); // Re-render the current page
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  _initializeFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach((button) => {
      const restaurantId = button.dataset.id;
      button.addEventListener('click', async (event) => {
        event.stopPropagation();
        await this._toggleFavorite(restaurantId);
      });
    });
  }
}

export default App;