// Book data
const books = [
  {
    id: 1,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "A psychological thriller about a woman's act of violence against her husband.",
    price: 450,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Fiction",
    isBestseller: true,
    isNew: false
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    description: "An easy and proven way to build good habits and break bad ones.",
    price: 380,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Non-Fiction",
    isBestseller: false,
    isNew: false
  },
  {
    id: 3,
    title: "Educated",
    author: "Tara Westover",
    description: "A memoir about a woman who leaves her survivalist family and goes on to earn a PhD.",
    price: 420,
    image: "https://images.unsplash.com/photo-1603289851468-80a97c5e8a6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Non-Fiction",
    isBestseller: false,
    isNew: true
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    description: "A brief history of humankind.",
    price: 500,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Non-Fiction",
    isBestseller: false,
    isNew: false
  },
  {
    id: 5,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    description: "A murder mystery about an isolated girl who becomes the prime suspect.",
    price: 490,
    image: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Fiction",
    isBestseller: true,
    isNew: false
  },
  {
    id: 6,
    title: "The Dutch House",
    author: "Ann Patchett",
    description: "A novel about a brother and sister over the course of five decades.",
    price: 460,
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Fiction",
    isBestseller: true,
    isNew: false
  },
  {
    id: 7,
    title: "Becoming",
    author: "Michelle Obama",
    description: "A memoir by the former First Lady of the United States.",
    price: 550,
    image: "https://images.unsplash.com/photo-1610882648335-eda27ee1b9af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Non-Fiction",
    isBestseller: true,
    isNew: false
  },
  {
    id: 8,
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A philosophical novel about a shepherd boy's journey to find a treasure.",
    price: 400,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Fiction",
    isBestseller: true,
    isNew: false
  }
];

// Constants
const WHATSAPP_NUMBER = "+8801745872364";
const CONTACT_NUMBER = "+8801745872364";
const BKASH_NUMBER = "01910327701";

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const shoppingCart = document.getElementById('shoppingCart');
const overlay = document.getElementById('overlay');
const shopNowBtn = document.getElementById('shopNowBtn');
const shopNowBtnEmpty = document.getElementById('shopNowBtnEmpty');
const bestsellersBtn = document.getElementById('bestsellersBtn');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const viewAllBtn = document.getElementById('viewAllBtn');
const featuredBooksContainer = document.getElementById('featuredBooks');
const bestsellerBooksContainer = document.getElementById('bestsellerBooks');
const cartItemsContainer = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

// Cart state
let cart = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Load books
  displayFeaturedBooks();
  displayBestsellerBooks();
  
  // Cart toggle
  cartBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  
  // Buttons
  shopNowBtn.addEventListener('click', openCart);
  shopNowBtnEmpty.addEventListener('click', closeCart);
  bestsellersBtn.addEventListener('click', () => scrollToSection('bestsellers'));
  continueShoppingBtn.addEventListener('click', closeCart);
  checkoutBtn.addEventListener('click', checkout);
  viewAllBtn.addEventListener('click', openCart);
  
  // Load cart from localStorage
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartDisplay();
  }
});

// Functions
function displayFeaturedBooks() {
  featuredBooksContainer.innerHTML = '';
  
  const featuredBooks = books.slice(0, 4);
  featuredBooks.forEach(book => {
    featuredBooksContainer.appendChild(createBookCard(book));
  });
}

function displayBestsellerBooks() {
  bestsellerBooksContainer.innerHTML = '';
  
  const bestsellerBooks = books.filter(book => book.isBestseller);
  bestsellerBooks.forEach(book => {
    bestsellerBooksContainer.appendChild(createBookCard(book));
  });
}

function createBookCard(book) {
  const bookCard = document.createElement('div');
  bookCard.className = 'book-card';
  
  const badgeHTML = book.isBestseller 
    ? '<div class="book-badge bestseller-badge">Bestseller</div>'
    : book.isNew 
      ? '<div class="book-badge new-badge">New</div>'
      : '';
  
  bookCard.innerHTML = `
    <div class="book-image">
      <img src="${book.image}" alt="${book.title}">
      ${badgeHTML}
    </div>
    <div class="book-details">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">${book.author}</p>
      <div class="book-footer">
        <span class="book-price">৳${book.price}</span>
        <button class="add-to-cart-btn" data-id="${book.id}">Add to Cart</button>
      </div>
    </div>
  `;
  
  // Add click event for Add to Cart button
  bookCard.querySelector('.add-to-cart-btn').addEventListener('click', function() {
    const bookId = parseInt(this.getAttribute('data-id'));
    addToCart(bookId);
  });
  
  return bookCard;
}

function addToCart(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  
  const existingItem = cart.find(item => item.id === bookId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...book,
      quantity: 1
    });
  }
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart display
  updateCartDisplay();
  
  // Open cart
  openCart();
}

function removeFromCart(bookId) {
  cart = cart.filter(item => item.id !== bookId);
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart display
  updateCartDisplay();
}

function increaseQuantity(bookId) {
  const item = cart.find(item => item.id === bookId);
  if (item) {
    item.quantity += 1;
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
  }
}

function decreaseQuantity(bookId) {
  const item = cart.find(item => item.id === bookId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      removeFromCart(bookId);
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
  }
}

function updateCartDisplay() {
  // Update cart count
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = itemCount;
  
  // Show/hide empty cart message and footer
  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    cartItems.style.display = 'none';
    cartFooter.style.display = 'none';
  } else {
    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    cartFooter.style.display = 'block';
    
    // Clear cart items
    cartItemsContainer.innerHTML = '';
    
    // Add cart items
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <p class="cart-item-price">৳${item.price}</p>
          <div class="cart-item-actions">
            <button class="quantity-btn decrease" data-id="${item.id}">
              <i class="fas fa-minus"></i>
            </button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn increase" data-id="${item.id}">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
        <div class="cart-item-total">
          <p class="cart-item-subtotal">৳${item.price * item.quantity}</p>
          <button class="remove-item-btn" data-id="${item.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
      
      cartItemsContainer.appendChild(cartItem);
      
      // Add event listeners
      cartItem.querySelector('.decrease').addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        decreaseQuantity(id);
      });
      
      cartItem.querySelector('.increase').addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        increaseQuantity(id);
      });
      
      cartItem.querySelector('.remove-item-btn').addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        removeFromCart(id);
      });
    });
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `৳${total}`;
  }
}

function openCart() {
  shoppingCart.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeCart() {
  shoppingCart.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = ''; // Restore scroll
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function checkout() {
  if (cart.length === 0) return;
  
  let message = "Hello, I'd like to place an order for the following books:\n\n";
  
  cart.forEach(item => {
    message += `${item.title} - ৳${item.price} x ${item.quantity} = ৳${item.price * item.quantity}\n`;
  });
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  message += `\nTotal: ৳${total}\n\nPlease provide delivery details. Thank you!`;
  
  // Encode the message for WhatsApp
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`, '_blank');
}

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener('click', function() {
    navMenu.classList.toggle('active');
  });
}