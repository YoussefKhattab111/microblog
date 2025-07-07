// Login page functionality

function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem("microblog_users") || "[]")
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password)
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
      <div class="notification-content">
          <span>${message}</span>
          <button class="notification-close">&times;</button>
      </div>
  `

  // Add notification styles if not exist
  if (!document.querySelector(".notification-styles")) {
    const style = document.createElement("style")
    style.className = "notification-styles"
    style.textContent = `
          .notification {
              position: fixed;
              top: 20px;
              right: 20px;
              background: rgba(15, 23, 42, 0.95);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 0.5rem;
              padding: 1rem;
              color: white;
              z-index: 10000;
              min-width: 300px;
              animation: slideIn 0.3s ease-out;
          }
          .notification-success { border-color: #10b981; }
          .notification-error { border-color: #ef4444; }
          .notification-info { border-color: #3b82f6; }
          .notification-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 1rem;
          }
          .notification-close {
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              font-size: 1.2rem;
          }
          @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
          }
      `
    document.head.appendChild(style)
  }

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 5000)

  // Manual close
  notification.querySelector(".notification-close").addEventListener("click", () => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  })
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

document.addEventListener("DOMContentLoaded", () => {
  // Redirect if already logged in
  const currentUser = localStorage.getItem("microblog_current_user")
  if (currentUser) {
    window.location.href = "index.html"
    return
  }

  initializeLoginPage()
})

function initializeLoginPage() {
  const loginForm = document.getElementById("loginForm")
  const togglePasswordBtn = document.querySelector(".toggle-password")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", togglePasswordVisibility)
  }

  // Social login buttons (demo only)
  initializeSocialLogin()
}

function handleLogin(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const email = formData.get("email")
  const password = formData.get("password")

  // Validate inputs
  if (!email || !password) {
    showNotification("Please fill in all fields", "error")
    return
  }

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address", "error")
    return
  }

  const submitBtn = e.target.querySelector('button[type="submit"]')
  const btnText = submitBtn.querySelector(".btn-text")
  const btnLoading = submitBtn.querySelector(".btn-loading")

  // Show loading state
  btnText.style.display = "none"
  btnLoading.style.display = "inline-flex"
  submitBtn.disabled = true

  // Simulate API call delay
  setTimeout(() => {
    try {
      const user = loginUser(email, password)
      if (user) {
        localStorage.setItem("microblog_current_user", JSON.stringify(user))
        showNotification("Login successful", "success")

        // Redirect to home page
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1000)
      } else {
        throw new Error("Invalid email or password")
      }
    } catch (error) {
      showNotification(error.message, "error")

      // Reset button state
      btnText.style.display = "inline"
      btnLoading.style.display = "none"
      submitBtn.disabled = false
    }
  }, 1500)
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password")
  const toggleIcon = document.querySelector(".toggle-password i")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    toggleIcon.className = "fas fa-eye-slash"
  } else {
    passwordInput.type = "password"
    toggleIcon.className = "fas fa-eye"
  }
}

function initializeSocialLogin() {
  const googleBtn = document.querySelector(".btn-google")
  const githubBtn = document.querySelector(".btn-github")

  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      showNotification("Google login not available currently", "info")
    })
  }

  if (githubBtn) {
    githubBtn.addEventListener("click", () => {
      showNotification("GitHub login not available currently", "info")
    })
  }
}
