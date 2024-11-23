import { createRestaurantItem } from './restaurant-item';

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
    } else if (url === '/favorite') {
      heroElement.style.display = 'block';
      this._renderFavoritePage();
    }
  }

  async _renderHomePage() {
    try {
      this._content.innerHTML = '<div class="loading"></div>';
      const [restaurants, topPicks] = await Promise.all([
        this._fetchRestaurants(),
        this._fetchTopPicks()
      ]);
      
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
          ${this._createTopPicksSection(topPicks)}
          ${this._createDynamicSwiper(restaurants)}
          
          <div class="content__header">
            <h2 class="content__title">Explore All Restaurants</h2>
          </div>
          <div class="restaurants">
            ${restaurants.map((restaurant) => 
              createRestaurantItem(restaurant)
            ).join('')}
          </div>

          ${this._createCarouselSection(restaurants)}
        </section>
      `;

      // Initialize swiper setelah content dirender
      setTimeout(() => {
        this._initializeSwiper();
      }, 100);
    } catch (error) {
      this._content.innerHTML = `
        <div class="error">
          <h2>Error loading restaurants</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  _renderFavoritePage() {
    this._content.innerHTML = `
      <section class="content">
        <div class="content__header">
          <h2 class="content__title">Your Favorite Restaurants</h2>
        </div>
        <div class="coming-soon">
          <i class="fa fa-clock-o"></i>
          <h3>Coming Soon!</h3>
          <p>We're working hard to bring you this feature.</p>
        </div>
      </section>
    `;
  }

  _createTopPicksSection(topPicks) {
    const topPicksList = topPicks
      .map(restaurant => `
        <div class="favorite-item">
          <div class="favorite-item__info">
            <h3>${restaurant.name}</h3>
            <p><i class="fa fa-map-marker"></i> ${restaurant.city}</p>
            <div class="favorite-item__rating">
              <i class="fa fa-star"></i>
              <span>${restaurant.rating}</span>
            </div>
          </div>
        </div>
      `)
      .join('');

    return `
      <div class="favorite-section">
        <div class="content__header">
          <h2 class="content__title">Top Picks For You</h2>
        </div>
        <div class="favorite-list">
          ${topPicksList}
        </div>
      </div>
    `;
  }

  _createDynamicSwiper(restaurants) {
    const slides = restaurants
      .map(restaurant => `
        <div class="swiper-slide">
          <div class="swiper-restaurant">
            <img src="${restaurant.pictureId}" alt="${restaurant.name}">
            <div class="swiper-restaurant__info">
              <h3>${restaurant.name}</h3>
            </div>
          </div>
        </div>
      `)
      .join('');

    return `
      <div class="dynamic-swiper">
        <div class="content__header">
          <h2 class="content__title">Popular Restaurants</h2>
        </div>
        <div class="swiper">
          <div class="swiper-wrapper">
            ${slides}
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>
    `;
  }

  _createCarouselSection(restaurants) {
    const testimonials = restaurants
      .filter(restaurant => restaurant.comments && restaurant.comments.length > 0)
      .map(restaurant => {
        const latestComment = restaurant.comments[restaurant.comments.length - 1];
        return `
          <div class="testimonial-card">
            <div class="testimonial-card__content">
              <p class="testimonial-card__quote">${latestComment.content}</p>
            </div>
            <div class="testimonial-card__footer">
              <div class="testimonial-card__user">
                <div class="testimonial-card__avatar">
                  <i class="fa fa-user-circle"></i>
                </div>
                <div class="testimonial-card__info">
                  <p class="testimonial-card__name">${latestComment.user}</p>
                  <p class="testimonial-card__date">${latestComment.date}</p>
                </div>
              </div>
              <div class="testimonial-card__restaurant">
                <div class="testimonial-card__restaurant-info">
                  <p class="testimonial-card__restaurant-name">${restaurant.name}</p>
                  <div class="testimonial-card__meta">
                    <span class="testimonial-card__location">
                      <i class="fa fa-map-marker"></i> ${restaurant.city}
                    </span>
                    <span class="testimonial-card__rating">
                      <i class="fa fa-star"></i> ${restaurant.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <div class="testimonials-section">
        <div class="content__header">
          <h2 class="content__title">What Our Customers Say</h2>
          <p class="content__subtitle">Real experiences from our valued customers</p>
        </div>
        <div class="testimonials-grid">
          ${testimonials}
        </div>
      </div>
    `;
  }

  _initializeSwiper() {
    const swiperElement = document.querySelector('.swiper');
    if (swiperElement) {
      new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          }
        }
      });
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

  async _fetchTopPicks() {
    try {
      const response = await fetch('./data/top-picks.json');
      const data = await response.json();
      return data.topPicks;
    } catch (error) {
      throw new Error('Failed to fetch top picks');
    }
  }
}

export default App;