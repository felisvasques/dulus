/**
 * FUNCIONALIDAD PRINCIPAL DEL SITIO
 * 
 * Este script maneja:
 * - Navegación responsive
 * - Carruseles de videos
 * - Carruseles infinitos
 * - Efectos de scroll
 */

document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // NAVEGACIÓN RESPONSIVE
    // ======================
    const hamburger = document.querySelector('.hamburger-menu');
    const navItems = document.querySelector('.nav-items');
    
    // Toggle del menú hamburguesa
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navItems.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navItems.classList.remove('active');
        });
    });
    
    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ======================
    // CARRUSEL DE VIDEOS
    // ======================
    const carousels = document.querySelectorAll('.carousel-wrapper');
    
    carousels.forEach(carousel => {
        const container = carousel.querySelector('.video-container');
        const slides = carousel.querySelectorAll('.video-slide');
        const indicatorsContainer = carousel.querySelector('.indicators');
        let currentSlide = 0;
        let autoplayInterval;

        // Crear indicadores
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = carousel.querySelectorAll('.indicator');

        // Función para cambiar de slide
        function goToSlide(index) {
            if (index === currentSlide) return;

            // Desactivar slide actual
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            slides[currentSlide].querySelector('video').pause();

            // Activar nuevo slide
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            const video = slides[currentSlide].querySelector('video');
            video.currentTime = 0;
            video.play();
        }

        // Configurar evento "ended" para cada video
        slides.forEach(slide => {
            const video = slide.querySelector('video');
            video.addEventListener('ended', () => {
                const nextSlide = (currentSlide + 1) % slides.length;
                goToSlide(nextSlide);
            });
        });

        // Iniciar autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                const nextSlide = (currentSlide + 1) % slides.length;
                goToSlide(nextSlide);
            }, 5000);
        }

        // Pausar autoplay al interactuar
        container.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        container.addEventListener('mouseleave', startAutoplay);

        // Iniciar
        startAutoplay();
    });

    // ======================
    // CARRUSEL INFINITO
    // ======================
    function setupInfiniteCarousel(carouselContainer) {
        const track = carouselContainer.querySelector('.infinite-track');
        const prevBtn = carouselContainer.querySelector('.prev-btn');
        const nextBtn = carouselContainer.querySelector('.next-btn');
        const slides = carouselContainer.querySelectorAll('.infinite-slide');
        
        if (!track || !slides.length) return;

        const slideWidth = slides[0].offsetWidth + 20; // Ancho + margen
        const visibleSlides = Math.min(5, Math.floor(window.innerWidth / 250));
        let currentPosition = 0;
        let autoplayInterval;

        // Clonar slides para efecto infinito
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            track.appendChild(clone);
        });

        // Función para mover el carrusel
        function moveCarousel(direction) {
            if (direction === 'next') {
                currentPosition -= slideWidth;
                if (currentPosition < -slideWidth * (slides.length - visibleSlides)) {
                    currentPosition = 0;
                    track.style.transition = 'none';
                    track.style.transform = `translateX(${currentPosition}px)`;
                    setTimeout(() => {
                        track.style.transition = 'transform 0.5s ease';
                        currentPosition = -slideWidth;
                        track.style.transform = `translateX(${currentPosition}px)`;
                    }, 10);
                } else {
                    track.style.transform = `translateX(${currentPosition}px)`;
                }
            } else {
                currentPosition += slideWidth;
                if (currentPosition > 0) {
                    currentPosition = -slideWidth * (slides.length - visibleSlides);
                    track.style.transition = 'none';
                    track.style.transform = `translateX(${currentPosition}px)`;
                    setTimeout(() => {
                        track.style.transition = 'transform 0.5s ease';
                        currentPosition += slideWidth;
                        track.style.transform = `translateX(${currentPosition}px)`;
                    }, 10);
                } else {
                    track.style.transform = `translateX(${currentPosition}px)`;
                }
            }
        }

        // Event listeners para botones
        nextBtn.addEventListener('click', () => moveCarousel('next'));
        prevBtn.addEventListener('click', () => moveCarousel('prev'));

        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                moveCarousel('next');
            }, 3000);
        }

        // Pausar autoplay al interactuar
        track.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        track.addEventListener('mouseleave', startAutoplay);

        // Iniciar autoplay
        startAutoplay();

        // Actualizar en resize
        window.addEventListener('resize', function() {
            const newSlideWidth = slides[0].offsetWidth + 20;
            if (newSlideWidth !== slideWidth) {
                track.style.transition = 'none';
                track.style.transform = `translateX(0px)`;
                currentPosition = 0;
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease';
                }, 10);
            }
        });
    }

    // Inicializar todos los carruseles infinitos
    document.querySelectorAll('.infinite-carousel-container').forEach(setupInfiniteCarousel);

    // ======================
    // MANEJO RESPONSIVE
    // ======================
    function handleResponsive() {
        const carouselsContainer = document.querySelector('.carousels-container');
        if (!carouselsContainer) return;

        // Combinar carruseles en móvil
        if (window.innerWidth <= 992 && !carouselsContainer.classList.contains('combined')) {
            const firstCarousel = carouselsContainer.children[0];
            const secondCarousel = carouselsContainer.children[1];
            
            if (firstCarousel && secondCarousel) {
                const firstVideoContainer = firstCarousel.querySelector('.video-container');
                const secondVideoContainer = secondCarousel.querySelector('.video-container');
                
                // Mover slides al primer carrusel
                Array.from(secondVideoContainer.children).forEach(slide => {
                    firstVideoContainer.appendChild(slide);
                });
                
                // Actualizar indicadores
                const indicatorsContainer = firstCarousel.querySelector('.indicators');
                indicatorsContainer.innerHTML = '';
                
                const totalSlides = firstVideoContainer.querySelectorAll('.video-slide').length;
                for (let i = 0; i < totalSlides; i++) {
                    const indicator = document.createElement('div');
                    indicator.classList.add('indicator');
                    if (i === 0) indicator.classList.add('active');
                    indicatorsContainer.appendChild(indicator);
                }
                
                // Marcar como combinado
                carouselsContainer.classList.add('combined');
                carouselsContainer.removeChild(secondCarousel);
                
                // Reiniciar el carrusel
                initCombinedCarousel(firstCarousel);
            }
        }
    }

    // Función para inicializar carrusel combinado
    function initCombinedCarousel(carousel) {
        const container = carousel.querySelector('.video-container');
        const slides = carousel.querySelectorAll('.video-slide');
        const indicators = carousel.querySelectorAll('.indicator');
        let currentIndex = 0;
        let autoplayInterval;
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            
            // Control de video
            document.querySelectorAll('.video-slide video').forEach(video => {
                if (video.parentElement.classList.contains('active')) {
                    video.play();
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        }
        
        // Configurar indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                showSlide(currentIndex);
            });
        });
        
        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            }, 5000);
        }
        
        // Pausar autoplay al interactuar
        container.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        container.addEventListener('mouseleave', startAutoplay);
        
        // Iniciar
        startAutoplay();
        showSlide(0);
    }

    // Ejecutar al cargar y en resize
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
});

// ANIMACIONES AL SCROLL
// Observador de intersección para animaciones
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});