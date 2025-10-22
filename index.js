/* ========================================
   MATAFUEGOS DAR SODA SRL - JAVASCRIPT
   Funcionalidades interactivas y animaciones
========================================= */

// Variables globales
let isScrolling = false;
let animatedElements = [];

// ========================================
// INICIALIZACIÓN DEL DOM
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar todas las funcionalidades
  initPreloader();
  initNavigation();
  initScrollAnimations();
  initCounters();
  initServiceModals();
  initContactForm();
  initSmoothScroll();

  // Ocultar preloader después de que todo esté cargado
  window.addEventListener("load", function () {
    hidePreloader();
  });
});

// ========================================
// PRELOADER
// ========================================
function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    // Mostrar preloader por al menos 1 segundo
    setTimeout(() => {
      hidePreloader();
    }, 1000);
  }
}

function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("fade-out");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }
}

// ========================================
// NAVEGACIÓN Y HEADER
// ========================================
function initNavigation() {
  const header = document.querySelector(".header");
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Scroll effect en header
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Actualizar navegación activa
    updateActiveNavigation();
  });

  // Hamburger menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  }
}

// Actualizar navegación activa basada en scroll
function updateActiveNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const scrollPosition = window.scrollY;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      const id = section.getAttribute("id");

      // Remover active de todos los enlaces
      navLinks.forEach((link) => link.classList.remove("active"));

      // Agregar active al enlace correspondiente
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  });
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 100;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// ========================================
// ANIMACIONES AL SCROLL
// ========================================
function initScrollAnimations() {
  // Obtener todos los elementos que necesitan animación
  const elementsToAnimate = document.querySelectorAll(`
        .hero-title,
        .hero-subtitle,
        .hero-buttons,
        .hero-image,
        .about-text,
        .about-image,
        .stat-item,
        .service-card,
        .cert-item,
        .contact-info,
        .contact-form,
        .info-item
    `);

  // Configurar IntersectionObserver
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateElement(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar todos los elementos
  elementsToAnimate.forEach((element) => {
    element.classList.add("fade-in");
    observer.observe(element);
  });
}

function animateElement(element) {
  element.classList.add("visible");

  // Animación especial para tarjetas de servicio
  if (element.classList.contains("service-card")) {
    setTimeout(() => {
      element.style.transform = "translateY(0)";
      element.style.opacity = "1";
    }, Math.random() * 200);
  }

  // Animación especial para estadísticas
  if (element.classList.contains("stat-item")) {
    const counter = element.querySelector(".stat-number");
    if (counter && !counter.hasAttribute("data-animated")) {
      animateCounter(counter);
    }
  }
}

// ========================================
// CONTADORES ANIMADOS
// ========================================
function initCounters() {
  const yearsCounter = document.getElementById("years-counter");
  if (yearsCounter) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateYearsCounter(yearsCounter);
          observer.unobserve(yearsCounter);
        }
      });
    });
    observer.observe(yearsCounter);
  }
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-count"));
  const increment = target / 100;
  let current = 0;

  element.setAttribute("data-animated", "true");

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (target === 100 ? "" : "");
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 20);
}

function animateYearsCounter(element) {
  let current = 0;
  const target = 30;
  const increment = 1;

  const timer = setInterval(() => {
    current += increment;
    element.textContent = current;

    if (current >= target) {
      clearInterval(timer);
    }
  }, 50);
}

// ========================================
// MODALES DE SERVICIOS
// ========================================
function initServiceModals() {
  const serviceCards = document.querySelectorAll(".service-card");
  const modal = document.getElementById("serviceModal");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.querySelector(".modal-close");

  // Contenido de los modales
  const modalData = {
    extintores: {
      title: "Control y Recarga de Extintores",
      content: `
                <h3>Control y Recarga de Extintores</h3>
                <p>Ofrecemos servicios integrales de mantenimiento y recarga de extintores portátiles, siguiendo estrictamente las normativas IRAM 3517.</p>
                
                <h4>Nuestros servicios incluyen:</h4>
                <ul>
                    <li>Inspección visual y control de pesos</li>
                    <li>Verificación de presión y componentes</li>
                    <li>Recarga con agente extintor certificado</li>
                    <li>Prueba hidráulica cuando corresponde</li>
                    <li>Certificación y etiquetado oficial</li>
                    <li>Registro detallado de mantenimiento</li>
                </ul>
                
                <h4>Tipos de extintores que atendemos:</h4>
                <ul>
                    <li>Polvo Químico Seco (ABC, BC)</li>
                    <li>Agua y Espuma (AFFF)</li>
                    <li>Dióxido de Carbono (CO2)</li>
                    <li>Agentes Limpios (FM200, etc.)</li>
                </ul>
                
                <p><strong>Garantía de calidad:</strong> Todos nuestros trabajos están respaldados por certificación IRAM y garantía de funcionamiento.</p>
            `,
    },
    redes: {
      title: "Instalación y Mantenimiento de Redes de Incendio",
      content: `
                <h3>Redes de Incendio</h3>
                <p>Diseñamos, instalamos y mantenemos sistemas completos de protección contra incendios para edificios comerciales, industriales y residenciales.</p>
                
                <h4>Servicios de instalación:</h4>
                <ul>
                    <li>Diseño de sistemas según normativas</li>
                    <li>Instalación de cañerías y accesorios</li>
                    <li>Montaje de gabinetes y mangueras</li>
                    <li>Conexión a red de agua potable</li>
                    <li>Pruebas de presión y funcionamiento</li>
                    <li>Documentación técnica completa</li>
                </ul>
                
                <h4>Mantenimiento preventivo:</h4>
                <ul>
                    <li>Inspección de componentes</li>
                    <li>Verificación de presión de agua</li>
                    <li>Control de válvulas y conexiones</li>
                    <li>Reemplazo de mangueras vencidas</li>
                    <li>Actualización según normativas</li>
                </ul>
                
                <p><strong>Cumplimiento normativo:</strong> Trabajamos según normas IRAM, reglamentaciones municipales y códigos de edificación.</p>
            `,
    },
    asesoria: {
      title: "Asesoramiento Técnico Especializado",
      content: `
                <h3>Asesoramiento Técnico</h3>
                <p>Brindamos consultoría especializada en seguridad industrial y protección contra incendios para empresas que buscan cumplir con las normativas vigentes.</p>
                
                <h4>Servicios de consultoría:</h4>
                <ul>
                    <li>Evaluación de riesgos de incendio</li>
                    <li>Auditorías de seguridad industrial</li>
                    <li>Planes de evacuación y emergencia</li>
                    <li>Capacitación del personal</li>
                    <li>Asesoramiento en normativas</li>
                    <li>Gestión de habilitaciones</li>
                </ul>
                
                <h4>Sectores que atendemos:</h4>
                <ul>
                    <li>Industria manufacturera</li>
                    <li>Comercios y oficinas</li>
                    <li>Establecimientos educativos</li>
                    <li>Centros de salud</li>
                    <li>Sector gastronómico</li>
                    <li>Depósitos y logística</li>
                </ul>
                
                <p><strong>Experiencia comprobada:</strong> Más de 30 años asesorando empresas en cumplimiento normativo y mejores prácticas de seguridad.</p>
            `,
    },
    insumos: {
      title: "Venta de Insumos y Equipamiento",
      content: `
                <h3>Venta de Insumos</h3>
                <p>Comercializamos equipos de seguridad industrial y materiales para protección contra incendios de primeras marcas.</p>
                
                <h4>Productos disponibles:</h4>
                <ul>
                    <li>Extintores nuevos (todas las capacidades)</li>
                    <li>Gabinetes para extintores</li>
                    <li>Mangueras contra incendio</li>
                    <li>Lanzas y accesorios</li>
                    <li>Válvulas y conexiones</li>
                    <li>Señalización de emergencia</li>
                    <li>Luces de emergencia</li>
                    <li>Detectores de humo</li>
                </ul>
                
                <h4>Marcas que representamos:</h4>
                <ul>
                    <li>Extintores certificados IRAM</li>
                    <li>Accesorios de primeras marcas</li>
                    <li>Productos con garantía de fábrica</li>
                    <li>Repuestos originales</li>
                </ul>
                
                <p><strong>Garantía y calidad:</strong> Todos nuestros productos cuentan con certificaciones de calidad y garantía de funcionamiento.</p>
                
                <p><strong>Entrega:</strong> Servicio de entrega en Rosario y zona de influencia.</p>
            `,
    },
  };

  // Event listeners para las tarjetas de servicio
  serviceCards.forEach((card) => {
    const button = card.querySelector(".btn-outline");
    if (button) {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const serviceType = card.getAttribute("data-service");
        openServiceModal(serviceType);
      });
    }

    // También permitir click en toda la tarjeta
    card.addEventListener("click", () => {
      const serviceType = card.getAttribute("data-service");
      openServiceModal(serviceType);
    });
  });

  // Función para abrir modal
  function openServiceModal(serviceType) {
    if (modalData[serviceType] && modal && modalContent) {
      modalContent.innerHTML = modalData[serviceType].content;
      modal.classList.add("show");
      document.body.style.overflow = "hidden";

      // Focus en el modal para accesibilidad
      modal.focus();
    }
  }

  // Cerrar modal
  function closeModal() {
    if (modal) {
      modal.classList.remove("show");
      document.body.style.overflow = "auto";
    }
  }

  // Event listeners para cerrar modal
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    // Cerrar al hacer click en el overlay
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Cerrar con tecla ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });
  }
}

// ========================================
// FORMULARIO DE CONTACTO
// ========================================
function initContactForm() {
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", handleFormSubmit);

    // Validación en tiempo real
    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => clearFieldError(input));
    });
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Validar todos los campos
  if (validateForm(form)) {
    // Simular envío de formulario
    submitForm(formData);
  }
}

function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll(
    "input[required], textarea[required]"
  );

  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  const fieldGroup = field.closest(".form-group");
  const errorElement = fieldGroup.querySelector(".error-message");

  // Limpiar errores previos
  fieldGroup.classList.remove("error");
  errorElement.textContent = "";

  // Validaciones específicas
  if (field.hasAttribute("required") && !value) {
    showFieldError(fieldGroup, errorElement, "Este campo es obligatorio");
    return false;
  }

  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(
        fieldGroup,
        errorElement,
        "Por favor ingresa un email válido"
      );
      return false;
    }
  }

  if (field.type === "tel" && value) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value)) {
      showFieldError(
        fieldGroup,
        errorElement,
        "Por favor ingresa un teléfono válido"
      );
      return false;
    }
  }

  return true;
}

function showFieldError(fieldGroup, errorElement, message) {
  fieldGroup.classList.add("error");
  errorElement.textContent = message;
}

function clearFieldError(field) {
  const fieldGroup = field.closest(".form-group");
  fieldGroup.classList.remove("error");
  fieldGroup.querySelector(".error-message").textContent = "";
}

function submitForm(formData) {
  // Mostrar indicador de carga
  const submitBtn = document.querySelector(
    '#contactForm button[type="submit"]'
  );
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Enviando...";
  submitBtn.disabled = true;

  // Simular envío (aquí conectarías con tu backend)
  setTimeout(() => {
    // Simular éxito
    showFormSuccess();

    // Resetear formulario
    document.getElementById("contactForm").reset();

    // Restaurar botón
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 2000);
}

function showFormSuccess() {
  // Crear mensaje de éxito
  const successMessage = document.createElement("div");
  successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
  successMessage.innerHTML = `
        <strong>¡Mensaje enviado!</strong><br>
        Te contactaremos pronto.
    `;

  document.body.appendChild(successMessage);

  // Remover mensaje después de 5 segundos
  setTimeout(() => {
    successMessage.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 300);
  }, 5000);

  // Agregar estilos de animación si no existen
  if (!document.getElementById("success-animations")) {
    const style = document.createElement("style");
    style.id = "success-animations";
    style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
    document.head.appendChild(style);
  }
}

// ========================================
// EFECTOS ADICIONALES
// ========================================

// Efecto parallax sutil en hero
function initParallaxEffect() {
  const hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    });
  }
}

// Efecto de partículas en el fondo (opcional)
function createParticleEffect() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  // Crear contenedor de partículas
  const particlesContainer = document.createElement("div");
  particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    `;

  hero.appendChild(particlesContainer);

  // Crear partículas
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(192, 57, 43, 0.3);
            border-radius: 50%;
            animation: float ${5 + Math.random() * 10}s infinite linear;
        `;

    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 10 + "s";

    particlesContainer.appendChild(particle);
  }

  // Agregar animación CSS
  if (!document.getElementById("particle-animation")) {
    const style = document.createElement("style");
    style.id = "particle-animation";
    style.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
    document.head.appendChild(style);
  }
}

// ========================================
// OPTIMIZACIÓN DE RENDIMIENTO
// ========================================

// Throttle para eventos de scroll
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounce para eventos de resize
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========================================
// UTILIDADES ADICIONALES
// ========================================

// Función para detectar si un elemento está en viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Función para scroll suave a elemento
function scrollToElement(element, offset = 100) {
  const elementPosition = element.offsetTop - offset;
  window.scrollTo({
    top: elementPosition,
    behavior: "smooth",
  });
}

// Función para animar números
function animateNumber(element, start, end, duration = 2000) {
  const startTime = performance.now();
  const range = end - start;

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (easeOutCubic)
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const current = Math.floor(start + range * easedProgress);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = end;
    }
  }

  requestAnimationFrame(updateNumber);
}

// ========================================
// EASTER EGG (Opcional)
// ========================================

// Konami code para mostrar mensaje especial
function initEasterEgg() {
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  let userSequence = [];

  document.addEventListener("keydown", (e) => {
    userSequence.push(e.code);

    if (userSequence.length > konamiCode.length) {
      userSequence.shift();
    }

    if (userSequence.length === konamiCode.length) {
      const match = userSequence.every(
        (key, index) => key === konamiCode[index]
      );

      if (match) {
        showEasterEgg();
        userSequence = [];
      }
    }
  });
}

function showEasterEgg() {
  const message = document.createElement("div");
  message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #c0392b, #e74c3c);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        z-index: 9999;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        animation: bounceIn 0.8s ease;
    `;

  message.innerHTML = `
        <h3>🎉 ¡Felicitaciones! 🎉</h3>
        <p>Has encontrado nuestro easter egg.<br>
        ¡Eres un verdadero explorador!</p>
        <button onclick="this.parentElement.remove()" style="
            background: white;
            color: #c0392b;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 1rem;
            font-weight: bold;
        ">Cerrar</button>
    `;

  document.body.appendChild(message);

  // Agregar animación
  if (!document.getElementById("easter-egg-animation")) {
    const style = document.createElement("style");
    style.id = "easter-egg-animation";
    style.textContent = `
            @keyframes bounceIn {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.3);
                }
                50% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.05);
                }
                70% {
                    transform: translate(-50%, -50%) scale(0.9);
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        `;
    document.head.appendChild(style);
  }

  // Auto-remover después de 10 segundos
  setTimeout(() => {
    if (message.parentElement) {
      message.remove();
    }
  }, 10000);
}

// ========================================
// EVENTOS DE RESIZE Y ORIENTACIÓN
// ========================================

// Manejar cambios de orientación en móviles
window.addEventListener(
  "orientationchange",
  debounce(() => {
    // Recalcular animaciones y posiciones
    setTimeout(() => {
      initScrollAnimations();
    }, 500);
  }, 300)
);

// Manejar resize de ventana
window.addEventListener(
  "resize",
  debounce(() => {
    // Recalcular elementos que dependan del tamaño de ventana
    updateActiveNavigation();
  }, 250)
);

// ========================================
// INICIALIZACIÓN FINAL
// ========================================

// Inicializar efectos adicionales cuando el documento esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar easter egg (opcional)
  // initEasterEgg();

  // Inicializar efecto de partículas (opcional)
  // createParticleEffect();

  console.log("🔥 Matafuegos Dar Soda SRL - Website cargado correctamente");
  console.log("💼 Desarrollado con HTML5, CSS3 y JavaScript puro");
  console.log("📱 Diseño responsivo y optimizado para SEO");
});
