// Cart functionality
let cart = []
let cartCount = 0

// DOM elements
const cartToggle = document.querySelector(".cart-toggle")
const cartModal = document.querySelector(".cart-modal")
const cartItems = document.getElementById("cartItems")
const cartCountElement = document.getElementById("cartCount")
const cartTotal = document.querySelector(".cart-total")
const imageModal = document.querySelector(".image-modal")
const modalImg = imageModal.querySelector("img")
const modalClose = document.querySelector(".modal-close")
const menuToggle = document.querySelector(".menu-toggle")
const navMenu = document.querySelector(".nav-menu")

// Initialize functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeQuantityControls()
  initializeCartButtons()
  initializeImageModal()
  initializeMobileMenu()
  initializeSmoothScrolling()
})

// Initialize quantity controls (+ and - buttons)
function initializeQuantityControls() {
  const quantityControls = document.querySelectorAll(".quantity-control")

  quantityControls.forEach((control) => {
    const minusBtn = control.querySelector(".minus")
    const plusBtn = control.querySelector(".plus")
    const input = control.querySelector("input")
    const step = Number.parseFloat(input.getAttribute("step")) || 1
    const min = Number.parseFloat(input.getAttribute("min")) || 1

    // Minus button functionality
    minusBtn.addEventListener("click", () => {
      const currentValue = Number.parseFloat(input.value) || min
      const newValue = currentValue - step

      if (newValue >= min) {
        input.value = newValue
        // Add visual feedback
        minusBtn.style.transform = "scale(0.9)"
        setTimeout(() => {
          minusBtn.style.transform = "scale(1)"
        }, 150)
      }
    })

    // Plus button functionality
    plusBtn.addEventListener("click", () => {
      const currentValue = Number.parseFloat(input.value) || min
      const newValue = currentValue + step

      input.value = newValue
      // Add visual feedback
      plusBtn.style.transform = "scale(0.9)"
      setTimeout(() => {
        plusBtn.style.transform = "scale(1)"
      }, 150)
    })

    // Input validation
    input.addEventListener("change", () => {
      const value = Number.parseFloat(input.value)
      if (isNaN(value) || value < min) {
        input.value = min
      }
    })

    // Prevent negative values on input
    input.addEventListener("input", () => {
      if (Number.parseFloat(input.value) < min) {
        input.value = min
      }
    })
  })
}

// Initialize cart buttons
function initializeCartButtons() {
  const cartButtons = document.querySelectorAll(".btn-cart")

  cartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const menuItem = button.closest(".menu-item")
      const name = button.getAttribute("data-name")
      const price = Number.parseFloat(button.getAttribute("data-price"))
      const quantityInput = menuItem.querySelector(".quantity-control input")
      const quantity = Number.parseFloat(quantityInput.value) || 1

      // Check for selected options (like "com farofa" or "sem farofa")
      let selectedOption = ""
      const optionButtons = menuItem.querySelectorAll(".option")
      optionButtons.forEach((opt) => {
        if (opt.classList.contains("selected")) {
          selectedOption = ` (${opt.textContent})`
        }
      })

      addToCart(name + selectedOption, price, quantity)

      // Fire effect animation
      createFireEffect(button, e)

      // Visual feedback
      button.classList.add("cart-added")
      setTimeout(() => {
        button.classList.remove("cart-added")
      }, 500)
    })
  })

  // Option buttons functionality
  const optionButtons = document.querySelectorAll(".option")
  optionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const menuItem = button.closest(".menu-item")
      const allOptions = menuItem.querySelectorAll(".option")

      // Remove selected class from all options in this item
      allOptions.forEach((opt) => opt.classList.remove("selected"))

      // Add selected class to clicked option
      button.classList.add("selected")

      // Add visual feedback
      button.style.transform = "scale(0.95)"
      setTimeout(() => {
        button.style.transform = "scale(1)"
      }, 150)
    })
  })
}

// Add item to cart
function addToCart(name, price, quantity) {
  const existingItem = cart.find((item) => item.name === name)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ name, price, quantity })
  }

  updateCartDisplay()
}

// Update cart display
function updateCartDisplay() {
  cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  cartCountElement.textContent = cartCount

  // Update cart items
  cartItems.innerHTML = ""
  let total = 0

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity
    total += itemTotal

    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">R$ ${itemTotal.toFixed(2)}</div>
            <div class="cart-item-quantity">
                <button onclick="decreaseCartItem(${index})">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseCartItem(${index})">+</button>
                <button class="cart-item-remove" onclick="removeCartItem(${index})">×</button>
            </div>
        `
    cartItems.appendChild(cartItem)
  })

  cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`
}

// Create fire effect animation
function createFireEffect(button, event) {
  // Add fire effect to button
  button.classList.add("fire-effect")
  setTimeout(() => {
    button.classList.remove("fire-effect")
  }, 800)

  // Create fire particles
  const rect = button.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // Create multiple fire particles
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div")
    particle.className = "fire-particle"

    // Random position around the button
    const angle = (i / 8) * Math.PI * 2
    const radius = 20 + Math.random() * 10
    const startX = centerX + Math.cos(angle) * radius
    const startY = centerY + Math.sin(angle) * radius

    particle.style.left = startX + "px"
    particle.style.top = startY + "px"

    // Random size variation
    const size = 3 + Math.random() * 3
    particle.style.width = size + "px"
    particle.style.height = size + "px"

    document.body.appendChild(particle)

    // Animate particle
    setTimeout(() => {
      particle.classList.add("animate")
    }, i * 50) // Stagger the animation

    // Remove particle after animation
    setTimeout(
      () => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      },
      800 + i * 50,
    )
  }
}

// Cart item controls
function increaseCartItem(index) {
  cart[index].quantity += 0.5
  updateCartDisplay()
}

function decreaseCartItem(index) {
  if (cart[index].quantity > 0.5) {
    cart[index].quantity -= 0.5
    updateCartDisplay()
  }
}

function removeCartItem(index) {
  cart.splice(index, 1)
  updateCartDisplay()
}

// Initialize image modal
function initializeImageModal() {
  const images = document.querySelectorAll(".menu-item-img img, .gallery-item img")

  images.forEach((img) => {
    img.addEventListener("click", () => {
      modalImg.src = img.src
      modalImg.alt = img.alt
      imageModal.classList.add("active")
    })
  })

  // Close modal
  modalClose.addEventListener("click", () => {
    imageModal.classList.remove("active")
  })

  imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) {
      imageModal.classList.remove("active")
    }
  })
}

// Initialize mobile menu
function initializeMobileMenu() {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
  })

  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-menu a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
    })
  })
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      const targetId = link.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetElement.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

// Cart modal functionality
if (cartToggle) {
  cartToggle.addEventListener("click", () => {
    cartModal.classList.add("active")
  })
}

if (cartModal) {
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove("active")
    }
  })
}

// Finalize order functionality
const finalizeOrderBtn = document.querySelector(".finalize-order")
if (finalizeOrderBtn) {
  finalizeOrderBtn.addEventListener("click", (e) => {
    e.preventDefault()

    if (cart.length === 0) {
      alert("Seu carrinho está vazio!")
      return
    }

    // Create WhatsApp message
    let message = "Olá! Gostaria de fazer o seguinte pedido:\n\n"
    let total = 0

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity
      total += itemTotal
      message += `• ${item.name}: ${item.quantity} x R$ ${item.price.toFixed(2)} = R$ ${itemTotal.toFixed(2)}\n`
    })

    message += `\n*Total: R$ ${total.toFixed(2)}*\n\nObrigado!`

    const whatsappUrl = `https://wa.me/5541988738707?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    // Clear cart
    cart = []
    updateCartDisplay()
    cartModal.classList.remove("active")
  })
}

// Add some visual enhancements
document.addEventListener("scroll", () => {
  const header = document.querySelector("header")
  if (window.scrollY > 100) {
    header.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
    header.style.backdropFilter = "blur(10px)"
  } else {
    header.style.backgroundColor = "var(--light)"
    header.style.backdropFilter = "none"
  }
})
