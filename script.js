// DOM Elements
const mobileMenuButton = document.getElementById('mobileMenuButton');
const closeMenuButton = document.getElementById('closeMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const cartButton = document.getElementById('cartButton');
const closeCartButton = document.getElementById('closeCartButton');
const cartDrawer = document.getElementById('cartDrawer');
const cartContent = document.getElementById('cartContent');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const coursesGrid = document.getElementById('coursesGrid');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const testimonialsSlider = document.getElementById('testimonialsSlider');
const contactForm = document.getElementById('contactForm');
const videosGrid = document.getElementById('videosGrid');

// API Base URL
const API_BASE_URL = '/api';

// YouTube Channel URL and ID
const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@ebook_chronicle?si=I9T9G6M9Ou4SJ2BE';
const YOUTUBE_CHANNEL_ID = 'UCeSzNMnm2XtY_y4ZvnBz9KQ';

// BKash merchant number
const BKASH_MERCHANT_NUMBER = '01910327701';

// WhatsApp number
const WHATSAPP_NUMBER = '+8801745872364';

// State
let cart = [];
let currentUser = null;
let currentSlide = 0;
let testimonials = [];
let courses = [];

// Mobile Menu Toggle
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.add('open');
    });
}

if (closeMenuButton) {
    closeMenuButton.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
}

// Cart Drawer Toggle
if (cartButton) {
    cartButton.addEventListener('click', () => {
        cartDrawer.classList.add('open');
    });
}

if (closeCartButton) {
    closeCartButton.addEventListener('click', () => {
        cartDrawer.classList.remove('open');
    });
}

// Outside Click to Close
document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open') && 
        !mobileMenu.contains(e.target) && 
        e.target !== mobileMenuButton) {
        mobileMenu.classList.remove('open');
    }
    
    if (cartDrawer && cartDrawer.classList.contains('open') && 
        !cartDrawer.contains(e.target) && 
        e.target !== cartButton) {
        cartDrawer.classList.remove('open');
    }
});

// Fetch and Initialize Data
document.addEventListener('DOMContentLoaded', () => {
    // Check Authentication Status
    checkAuth();
    
    // Load Cart
    loadCart();
    
    // Load Courses
    if (coursesGrid) {
        fetchCourses();
    }
    
    // Load Testimonials
    if (testimonialsSlider) {
        fetchTestimonials();
    }
    
    // Initialize YouTube Videos
    if (videosGrid) {
        fetchYouTubeVideos();
    }
    
    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Testimonial Slider Controls
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', previousSlide);
        nextButton.addEventListener('click', nextSlide);
    }
});

// Authentication Functions
function checkAuth() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authButtons = document.querySelector('.header-buttons');
    if (authButtons && currentUser) {
        authButtons.innerHTML = `
            <a href="my-courses.html" class="btn btn-outline">My Courses</a>
            <button class="btn btn-primary" onclick="logout()">Logout</button>
            <button class="cart-button" id="cartButton">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count" id="cartCount">${cart.length}</span>
            </button>
            <button class="mobile-menu-button" id="mobileMenuButton">
                <i class="fas fa-bars"></i>
            </button>
        `;
        
        // Reinitialize event listeners after changing the DOM
        document.getElementById('cartButton').addEventListener('click', () => {
            document.getElementById('cartDrawer').classList.add('open');
        });
        
        document.getElementById('mobileMenuButton').addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.add('open');
        });
    }
}

function login(username, password) {
    return fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'Login failed');
            });
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('user', JSON.stringify(data));
        currentUser = data;
        updateAuthUI();
        return data;
    });
}

function register(userData) {
    return fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'Registration failed');
            });
        }
        return response.json();
    });
}

function logout() {
    fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST'
    })
    .then(() => {
        localStorage.removeItem('user');
        currentUser = null;
        cart = [];
        updateCartUI();
        window.location.href = 'index.html';
    });
}

// Cart Functions
function loadCart() {
    if (!currentUser) {
        cart = [];
        updateCartUI();
        return;
    }
    
    fetch(`${API_BASE_URL}/cart`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    // Not authenticated
                    return [];
                }
                throw new Error('Failed to load cart');
            }
            return response.json();
        })
        .then(data => {
            cart = data;
            updateCartUI();
        })
        .catch(error => {
            console.error('Error loading cart:', error);
        });
}

function updateCartUI() {
    // Update cart count
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
    
    // Update cart drawer content
    if (cartContent) {
        if (cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                    <p>Your cart is empty</p>
                    <a href="#courses" class="btn btn-primary">Browse Courses</a>
                </div>
            `;
        } else {
            let cartItemsHTML = '';
            let totalAmount = 0;
            
            cart.forEach(item => {
                const course = item.course;
                cartItemsHTML += `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${course.imageUrl}" alt="${course.title}">
                        </div>
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${course.title}</h4>
                            <div class="cart-item-price">৳${course.price.toFixed(2)}</div>
                        </div>
                        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                totalAmount += course.price;
            });
            
            cartContent.innerHTML = cartItemsHTML;
            
            // Update total
            if (cartTotal) {
                cartTotal.textContent = `৳${totalAmount.toFixed(2)}`;
            }
        }
    }
}

function addToCart(courseId) {
    if (!currentUser) {
        alert('Please login to add courses to your cart');
        window.location.href = 'login.html';
        return;
    }
    
    fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add course to cart');
        }
        return response.json();
    })
    .then(data => {
        cart.push(data);
        updateCartUI();
        showNotification('Course added to cart!');
    })
    .catch(error => {
        console.error('Error adding to cart:', error);
        showNotification('Failed to add course to cart', 'error');
    });
}

function removeFromCart(cartItemId) {
    fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove course from cart');
        }
        cart = cart.filter(item => item.id !== cartItemId);
        updateCartUI();
        showNotification('Course removed from cart');
    })
    .catch(error => {
        console.error('Error removing from cart:', error);
        showNotification('Failed to remove course from cart', 'error');
    });
}

function clearCart() {
    fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to clear cart');
        }
        cart = [];
        updateCartUI();
        showNotification('Cart cleared');
    })
    .catch(error => {
        console.error('Error clearing cart:', error);
        showNotification('Failed to clear cart', 'error');
    });
}

// Fetch Courses
function fetchCourses() {
    fetch(`${API_BASE_URL}/courses`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            return response.json();
        })
        .then(data => {
            courses = data;
            renderCourses();
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
            coursesGrid.innerHTML = `
                <div class="error-message">
                    <p>Failed to load courses. Please try again later.</p>
                </div>
            `;
        });
}

function renderCourses() {
    if (!coursesGrid) return;
    
    let coursesHTML = '';
    
    courses.forEach(course => {
        // Generate rating stars
        const fullStars = Math.floor(course.rating / 10);
        const hasHalfStar = course.rating % 10 >= 5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star star"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt star"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star star empty"></i>';
        }
        
        coursesHTML += `
            <div class="course-card">
                <div class="course-image">
                    <img src="${course.imageUrl}" alt="${course.title}">
                    ${course.isBestseller ? '<span class="course-badge bestseller-badge">Bestseller</span>' : ''}
                    ${course.isNew ? '<span class="course-badge new-badge">New</span>' : ''}
                </div>
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${truncateText(course.description, 100)}</p>
                    <div class="course-rating">
                        <div class="stars">
                            ${starsHTML}
                        </div>
                        <span class="rating-count">(${course.reviewCount})</span>
                    </div>
                </div>
                <div class="course-footer">
                    <span class="course-price">৳${course.price.toFixed(2)}</span>
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${course.id})">Add to Cart</button>
                </div>
            </div>
        `;
    });
    
    coursesGrid.innerHTML = coursesHTML;
}

// Fetch Testimonials
function fetchTestimonials() {
    fetch(`${API_BASE_URL}/testimonials`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch testimonials');
            }
            return response.json();
        })
        .then(data => {
            testimonials = data;
            renderTestimonials();
        })
        .catch(error => {
            console.error('Error fetching testimonials:', error);
        });
}

function renderTestimonials() {
    if (!testimonialsSlider) return;
    
    let testimonialsHTML = '<div class="testimonials-wrapper">';
    
    testimonials.forEach(testimonial => {
        testimonialsHTML += `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <p class="testimonial-text">${testimonial.testimonial}</p>
                    <div class="testimonial-author">
                        <div class="author-image">
                            <img src="${testimonial.avatarUrl}" alt="${testimonial.name}">
                        </div>
                        <div class="author-info">
                            <h4>${testimonial.name}</h4>
                            <p>${testimonial.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    testimonialsHTML += '</div>';
    testimonialsSlider.innerHTML = testimonialsHTML;
    
    // Initialize slider
    updateSlider();
}

function updateSlider() {
    const wrapper = testimonialsSlider.querySelector('.testimonials-wrapper');
    if (wrapper) {
        wrapper.style.transform = `translateX(${-currentSlide * 100}%)`;
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
    }
}

function nextSlide() {
    if (currentSlide < testimonials.length - 1) {
        currentSlide++;
        updateSlider();
    }
}

// Auto-advance slider every 5 seconds
setInterval(() => {
    if (testimonialsSlider) {
        if (currentSlide < testimonials.length - 1) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateSlider();
    }
}, 5000);

// YouTube Videos
function fetchYouTubeVideos() {
    if (!videosGrid) return;
    
    // Sample videos data (in a real application, this would come from the YouTube API)
    const channelVideos = [
        {
            id: "vGcZuUs9VKk",
            title: "Lecture-1 Full Stack Web Development(Youtube)",
            description: "In this video, we'll explore the foundations of full-stack web development with a focus on modern technologies.",
            thumbnail: "https://i.ytimg.com/vi/vGcZuUs9VKk/maxresdefault.jpg",
            publishedAt: "2023-11-14T12:00:00Z"
        },
        {
            id: "SLW4GnVt_Ik",
            title: "Session 2: How to make Blog Website Part 2",
            description: "Continue building your blog website with advanced features and styling techniques.",
            thumbnail: "https://i.ytimg.com/vi/SLW4GnVt_Ik/maxresdefault.jpg",
            publishedAt: "2023-10-24T15:30:00Z"
        },
        {
            id: "oCYlCIHiDvM",
            title: "Session 1: How to make Blog Website Part 1",
            description: "Start your journey to create a professional blog website from scratch.",
            thumbnail: "https://i.ytimg.com/vi/oCYlCIHiDvM/maxresdefault.jpg",
            publishedAt: "2023-10-17T14:45:00Z"
        },
        {
            id: "pK56RpT8veM",
            title: "Introducing Our Web Development Course",
            description: "Learn about our comprehensive web development course and what you'll gain from it.",
            thumbnail: "https://i.ytimg.com/vi/pK56RpT8veM/maxresdefault.jpg",
            publishedAt: "2023-09-30T10:15:00Z"
        },
        {
            id: "FQdaUVOXoj0",
            title: "JavaScript DOM Manipulation Tutorial",
            description: "Master the Document Object Model with practical JavaScript examples.",
            thumbnail: "https://i.ytimg.com/vi/FQdaUVOXoj0/maxresdefault.jpg",
            publishedAt: "2023-09-22T08:30:00Z"
        },
        {
            id: "JZQgj3y24XI",
            title: "How to Host Your Website for Free",
            description: "Discover free hosting options to get your website online without spending a penny.",
            thumbnail: "https://i.ytimg.com/vi/JZQgj3y24XI/maxresdefault.jpg",
            publishedAt: "2023-09-15T09:45:00Z"
        }
    ];
    
    renderYouTubeVideos(channelVideos);
}

function renderYouTubeVideos(videos) {
    if (!videosGrid) return;
    
    let videosHTML = '';
    
    videos.forEach(video => {
        const publishDate = new Date(video.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        videosHTML += `
            <div class="video-card" onclick="openVideo('${video.id}')">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="video-overlay">
                        <div class="play-icon">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="video-date">${publishDate}</div>
                </div>
                <div class="video-content">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-description">${video.description}</p>
                </div>
            </div>
        `;
    });
    
    videosGrid.innerHTML = videosHTML;
}

function openVideo(videoId) {
    // Create modal for video viewing
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <button class="close-video-modal">&times;</button>
            <div class="video-wrapper">
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal on click
    const closeButton = modal.querySelector('.close-video-modal');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    });
    
    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }
    });
    
    // Add style for modal
    const style = document.createElement('style');
    style.textContent = `
        .video-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .video-modal-content {
            position: relative;
            width: 90%;
            max-width: 800px;
        }
        
        .close-video-modal {
            position: absolute;
            top: -40px;
            right: 0;
            background: transparent;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
        }
        
        .video-modal .video-wrapper {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
        }
        
        .video-modal iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    `;
    
    document.head.appendChild(style);
}

// Contact Form Submission
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit form');
        }
        return response.json();
    })
    .then(() => {
        showNotification('Message sent successfully! We will get back to you soon.');
        contactForm.reset();
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        showNotification('Failed to send message. Please try again later.', 'error');
    });
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add style for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out forwards;
            max-width: 300px;
        }
        
        .notification.success {
            background-color: #10b981;
            color: white;
        }
        
        .notification.error {
            background-color: #ef4444;
            color: white;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
        }
        
        .notification i {
            margin-right: 10px;
            font-size: 1.25rem;
        }
        
        .notification p {
            margin: 0;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

// Create specific page functions
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            login(username, password)
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch(error => {
                    showNotification(error.message, 'error');
                });
        });
    }
}

function initRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const userData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                email: document.getElementById('email').value,
                fullName: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value
            };
            
            if (userData.password !== userData.confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            register(userData)
                .then(() => {
                    showNotification('Registration successful! Please login.');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                })
                .catch(error => {
                    showNotification(error.message, 'error');
                });
        });
    }
}

// Initialize page-specific functionality
function initPage() {
    const pagePath = window.location.pathname;
    
    if (pagePath.includes('login.html')) {
        initLoginPage();
    } else if (pagePath.includes('register.html')) {
        initRegisterPage();
    }
}

// Call page initialization
initPage();
