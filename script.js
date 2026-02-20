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
  initializeCartModal()          // ← nova função para evitar conflito
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

    minusBtn.addEventListener("click", () => {
      const currentValue = Number.parseFloat(input.value) || min
      const newValue = currentValue - step
      if (newValue >= min) input.value = newValue
    })

    plusBtn.addEventListener("click", () => {
      const currentValue = Number.parseFloat(input.value) || min
      input.value = currentValue + step
    })

    input.addEventListener("change", () => {
      let value = Number.parseFloat(input.value)
      if (isNaN(value) || value < min) input.value = min
    })
  })
}

// Initialize cart buttons (APENAS os botões dentro dos itens do cardápio)
function initializeCartButtons() {
  const cartButtons = document.querySelectorAll(".menu-item .btn-cart")   // ← CORRIGIDO: só os do menu

  cartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const menuItem = button.closest(".menu-item")
      const name = button.getAttribute("data-name")
      const price = Number.parseFloat(button.getAttribute("data-price"))
      const quantityInput = menuItem.querySelector(".quantity-control input")
      const quantity = Number.parseFloat(quantityInput.value) || 1

      let selectedOption = ""
      const optionButtons = menuItem.querySelectorAll(".option")
      optionButtons.forEach((opt) => {
        if (opt.classList.contains("selected")) {
          selectedOption = ` (${opt.textContent})`
        }
      })

      addToCart(name + selectedOption, price, quantity)

      // Fire effect
      createFireEffect(button, e)

      button.classList.add("cart-added")
      setTimeout(() => button.classList.remove("cart-added"), 500)
    })
  })

  // Option buttons
  const optionButtons = document.querySelectorAll(".option")
  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const menuItem = button.closest(".menu-item")
      menuItem.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"))
      button.classList.add("selected")
    })
  })
}

// Add item to cart
function addToCart(name, price, quantity) {
  const existingItem = cart.find(item => item.name === name)
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

// Fire effect
function createFireEffect(button, event) {
  button.classList.add("fire-effect")
  setTimeout(() => button.classList.remove("fire-effect"), 800)

  const rect = button.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div")
    particle.className = "fire-particle"
    const angle = (i / 8) * Math.PI * 2
    const radius = 20 + Math.random() * 10
    particle.style.left = (centerX + Math.cos(angle) * radius) + "px"
    particle.style.top = (centerY + Math.sin(angle) * radius) + "px"
    const size = 3 + Math.random() * 3
    particle.style.width = size + "px"
    particle.style.height = size + "px"
    document.body.appendChild(particle)

    setTimeout(() => particle.classList.add("animate"), i * 50)
    setTimeout(() => {
      if (particle.parentNode) particle.parentNode.removeChild(particle)
    }, 800 + i * 50)
  }
}

// Cart item controls
window.increaseCartItem = function(index) {
  cart[index].quantity += 0.5
  updateCartDisplay()
}
window.decreaseCartItem = function(index) {
  if (cart[index].quantity > 0.5) {
    cart[index].quantity -= 0.5
    updateCartDisplay()
  }
}
window.removeCartItem = function(index) {
  cart.splice(index, 1)
  updateCartDisplay()
}

// Image modal
function initializeImageModal() {
  const images = document.querySelectorAll(".menu-item-img img, .gallery-item img")
  images.forEach(img => {
    img.addEventListener("click", () => {
      modalImg.src = img.src
      modalImg.alt = img.alt
      imageModal.classList.add("active")
    })
  })

  modalClose.addEventListener("click", () => imageModal.classList.remove("active"))
  imageModal.addEventListener("click", e => {
    if (e.target === imageModal) imageModal.classList.remove("active")
  })
}

// Mobile menu
function initializeMobileMenu() {
  menuToggle.addEventListener("click", () => navMenu.classList.toggle("active"))
  document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("active"))
  })
}

// Smooth scrolling
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault()
      const target = document.querySelector(link.getAttribute("href"))
      if (target) {
        const headerHeight = document.querySelector("header").offsetHeight
        window.scrollTo({
          top: target.offsetTop - headerHeight - 20,
          behavior: "smooth"
        })
      }
    })
  })
}

// Cart modal (separado para não conflitar)
function initializeCartModal() {
  if (cartToggle) {
    cartToggle.addEventListener("click", () => {
      cartModal.classList.add("active")
    })
  }

  if (cartModal) {
    cartModal.addEventListener("click", e => {
      if (e.target === cartModal) cartModal.classList.remove("active")
    })
  }

  // Finalizar pedido
  const finalizeOrderBtn = document.querySelector(".finalize-order")
  if (finalizeOrderBtn) {
    finalizeOrderBtn.addEventListener("click", e => {
      e.preventDefault()
      if (cart.length === 0) {
        alert("Seu carrinho está vazio!")
        return
      }

      let message = "Olá! Gostaria de fazer o seguinte pedido:\n\n"
      let total = 0

      cart.forEach(item => {
        const itemTotal = item.price * item.quantity
        total += itemTotal
        message += `• ${item.name}: ${item.quantity} x R$ ${item.price.toFixed(2)} = R$ ${itemTotal.toFixed(2)}\n`
      })

      message += `\n*Total: R$ ${total.toFixed(2)}*\n\nObrigado!`

      const whatsappUrl = `https://wa.me/5541988738707?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")

      cart = []
      updateCartDisplay()
      cartModal.classList.remove("active")
    })
  }
}

// Visual enhancements
document.addEventListener("scroll", () => {
  const header = document.querySelector("header")
  if (header) {
    if (window.scrollY > 100) {
      header.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
      header.style.backdropFilter = "blur(10px)"
    } else {
      header.style.backgroundColor = "var(--light)"
      header.style.backdropFilter = "none"
    }
  }
})

// === FORÇAR ÁUDIO NO VÍDEO HERO ===
document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('heroVideo')
  if (!video) return

  video.muted = true
  video.play().catch(() => {})

  const unmuteAndPlay = () => {
    video.muted = false
    video.volume = 0.4
    video.play().catch(() => { video.muted = true })

    document.removeEventListener('touchstart', unmuteAndPlay)
    document.removeEventListener('click', unmuteAndPlay)
    document.removeEventListener('keydown', unmuteAndPlay)
  }

  document.addEventListener('touchstart', unmuteAndPlay, { once: true })
  document.addEventListener('click', unmuteAndPlay, { once: true })
  document.addEventListener('keydown', unmuteAndPlay, { once: true })

  setTimeout(() => {
    if (video.muted) {
      video.muted = false
      video.play()
    }
  }, 2000)
})