const createRestaurantItem = (restaurant) => {
    const { id, name, description, pictureId, city, rating, favorite } = restaurant;
    
    return `
      <article class="restaurant-item">
        <div class="restaurant-item__header">
          <img src="${pictureId}"
               alt="${name}"
               crossorigin="anonymous">
          <div class="restaurant-item__header__rating">
            <i class="fa fa-star"></i>
            <span>${rating}</span>
          </div>
          <button class="favorite-btn ${favorite ? 'active' : ''}" 
                  aria-label="${favorite ? 'remove from favorite' : 'add to favorite'}"
                  data-id="${id}">
            <i class="fa fa-heart"></i>
          </button>
        </div>
        <div class="restaurant-item__content">
          <h3>
            <a href="#/detail/${id}" class="restaurant-item__title">
              ${name}
            </a>
          </h3>
          <p class="restaurant-item__content__city">
            <i class="fa fa-map-marker"></i>
            ${city}
          </p>
          <p class="restaurant-item__content__description">
            ${description}
          </p>
        </div>
      </article>
    `;
  };
  
  const createRestaurantDetail = (restaurant) => {
    const { name, description, pictureId, city, rating, comments = [], favorite } = restaurant;
    
    const reviewsHtml = comments && comments.length > 0 
      ? comments
          .map(
            (comment) => `
              <div class="review">
                <div class="review__header">
                  <p class="review__name">${comment.user}</p>
                  <p class="review__date">${comment.date}</p>
                </div>
                <p class="review__content">${comment.content}</p>
              </div>
            `
          )
          .join('')
      : '<p class="review review--empty">No reviews yet</p>';
  
    return `
      <article class="restaurant-detail">
        <div class="restaurant-detail__header">
          <img src="${pictureId}" 
               alt="${name}"
               class="restaurant-detail__image">
          <div class="restaurant-detail__info">
            <h2>${name}</h2>
            <p class="restaurant-detail__city">
              <i class="fa fa-map-marker"></i>
              ${city}
            </p>
            <div class="restaurant-detail__rating">
              <i class="fa fa-star"></i>
              <span>${rating}</span>
            </div>
          </div>
        </div>
        
        <div class="restaurant-detail__content">
          <section class="restaurant-detail__description">
            <h3>About</h3>
            <p>${description}</p>
          </section>
          
          <section class="restaurant-detail__reviews">
            <h3>Customer Reviews</h3>
            <div class="reviews">
              ${reviewsHtml}
            </div>
          </section>
        </div>
      </article>
    `;
  };
  
  export { createRestaurantItem, createRestaurantDetail };