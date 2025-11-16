const images = [
    '1foto.jpeg',
    '2foto.jpeg', 
    '3foto.jpeg',
    '4foto.jpeg',
    '5foto.jpeg',
    '6foto.jpeg',
    '7foto.jpeg',
    '8foto.jpeg'
];

const slider = document.querySelector('.gallery-slider');
const prevBtn = document.querySelector('.arrow-left');
const nextBtn = document.querySelector('.arrow-right');
const currentPageEl = document.getElementById('current-page');
const totalPagesEl = document.getElementById('total-pages');

let currentSlide = 0;
let slidesPerView = 3;

function checkScreenSize() {
    if (window.innerWidth <= 768) {
        slidesPerView = 1;
    } else {
        slidesPerView = 3;
    }
    updateSlider();
}

function createSlides() {
    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.innerHTML = `<img src="${image}" alt="Изображение ${index + 1}">`;
        slider.appendChild(slide);
    });
}

function updateSlider() {
    const slideWidth = 100 / slidesPerView;
    const translateX = -currentSlide * slideWidth;
    slider.style.transform = `translateX(${translateX}%)`;
    
    const totalPages = Math.ceil(images.length / slidesPerView);
    const currentPage = Math.floor(currentSlide / slidesPerView) + 1;
    
    currentPageEl.textContent = currentPage;
    totalPagesEl.textContent = totalPages;
}

function nextSlide() {
    const maxSlide = images.length - slidesPerView;
    if (currentSlide < maxSlide) {
        currentSlide++;
        updateSlider();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createSlides();
    checkScreenSize();
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    window.addEventListener('resize', checkScreenSize);
});