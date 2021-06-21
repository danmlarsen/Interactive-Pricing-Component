import prices from './prices';

const middlePrice = Math.trunc((prices.length - 1) / 2);

// 
// State
// 
let selectedPageViews = middlePrice;
let yearlyBilling = false;

// 
// DOM Selections
// 
const sliderElement = document.querySelector('.pricing__pageviews-slider');
const pageViewsElement = document.querySelector('.pricing__pageviews');
const priceElement = document.querySelector('.pricing__price-value');
const toggleElement = document.querySelector('.toggle__checkbox');
const formElement = document.querySelector('.pricing__form');

// 
// Helper functions
// 
const getPageViews = () => prices[selectedPageViews].pageViews;

const calcPrice = function() {
    const {pricePerMonth} = prices[selectedPageViews];
    return !yearlyBilling ? pricePerMonth : pricePerMonth - (pricePerMonth * .25);
};

// https://css-tricks.com/animating-number-counters/
function animateValue(renderCallback, start, end, duration, element) {
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // obj.innerHTML = Math.floor(progress * (end - start) + start);
            const num = Math.floor(progress * (end - start) + start);
            renderCallback(num);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            if (element) {
                element.style.transform = '';
            }
        }
    };

    if (element) {
        element.style.transition = `transform ${duration}ms `;
        element.style.transform = 'scale(1.05)';
    }

    window.requestAnimationFrame(step);
}


// 
// DOM
// 
const renderPrice = function(price) {
    priceElement.textContent = `$${price.toFixed(2)}`;
} 

const renderPageViews = function(pageViews) {
    const unit = pageViews >= 1000 ? 'M' : 'K';
    const views = pageViews >= 1000 ? pageViews / 1000 : pageViews;
    pageViewsElement.textContent = `${views}${unit} Pageviews`;
}

// https://stackoverflow.com/a/57153340/16279194
const renderSliderBar = function() {
    const value = (this.value - this.min) / (this.max - this.min) * 100;
    this.style.background = `linear-gradient(
                                to right, var(--full-slider-bar) 0%, 
                                var(--full-slider-bar) ${value}%, 
                                var(--empty-slider-bar) ${value}%, 
                                var(--empty-slider-bar) 100%)`;
};

// 
// Event handlers
// 
const handleSlider = function(e) {
    if (e.target.value < 0 || e.target.value >= prices.length) return; 
    
    const prevPageViews = getPageViews();
    const prevPrice = calcPrice();
    selectedPageViews = e.target.value;
    
    renderSliderBar.call(this);   
    animateValue(renderPageViews, prevPageViews, getPageViews(), 500);
    animateValue(renderPrice, prevPrice, calcPrice(), 500, priceElement);
}

const handleToggle = function(e) {
    const prevPrice = calcPrice();
    yearlyBilling = e.target.checked ? true : false;

    animateValue(renderPrice, prevPrice, calcPrice(), 500, priceElement);
}

const handleSubmit = function(e) {
    e.preventDefault();
}

// 
// Events
// 
sliderElement.addEventListener('input', handleSlider);
toggleElement.addEventListener('change', handleToggle);
formElement.addEventListener('submit', handleSubmit);


// 
// Initial setup
// 
sliderElement.setAttribute('min', 0);
sliderElement.setAttribute('max', prices.length - 1);

sliderElement.value = selectedPageViews;
toggleElement.checked = yearlyBilling;

renderSliderBar.call(sliderElement);
renderPageViews(getPageViews());
renderPrice(calcPrice());