document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        once: true,
        offset: 80
    });

    const initTypingEffect = () => {
        const changingText = document.getElementById('changing-text');
        if (!changingText) return;

        const texts = ['Frontend Developer', 'Web Developer', 'Backend Developer'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                changingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                changingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 2000;
            } 
            else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        };

        type();
    };

    initTypingEffect();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const highlightActiveNav = () => {
        const currentFile = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (currentFile === linkHref || 
                (currentFile === '' && linkHref === 'index.html') ||
                (currentFile && currentFile.includes(linkHref.replace('.html', '')))) {
                link.classList.add('active');
            }
        });
    };

    highlightActiveNav();

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            const showError = (fieldId, errorMessage) => {
                const field = document.getElementById(fieldId);
                const formGroup = field.parentElement;
                
                field.classList.remove('is-invalid');
                const existingError = formGroup.querySelector('.invalid-feedback');
                if (existingError) existingError.remove();
                
                field.classList.add('is-invalid');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'invalid-feedback';
                errorDiv.textContent = errorMessage;
                formGroup.appendChild(errorDiv);
            };

            const clearError = (fieldId) => {
                const field = document.getElementById(fieldId);
                const formGroup = field.parentElement;
                
                field.classList.remove('is-invalid');
                const errorMessage = formGroup.querySelector('.invalid-feedback');
                if (errorMessage) errorMessage.remove();
            };

            const isValidEmail = (email) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            };

            if (name === '') {
                showError('name', 'Nama harus diisi');
                isValid = false;
            } else {
                clearError('name');
            }
            
            if (email === '') {
                showError('email', 'Email harus diisi');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Format email tidak valid');
                isValid = false;
            } else {
                clearError('email');
            }
            
            if (message === '') {
                showError('message', 'Pesan harus diisi');
                isValid = false;
            } else if (message.length < 10) {
                showError('message', 'Pesan minimal 10 karakter');
                isValid = false;
            } else {
                clearError('message');
            }
            
            if (isValid) {
                const showSuccessMessage = () => {
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
                    alertDiv.innerHTML = `
                        <strong>Sukses!</strong> Pesan Anda telah terkirim. Saya akan membalas dalam 1-2 hari kerja.
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    `;
                    
                    const form = document.getElementById('contactForm');
                    form.parentNode.insertBefore(alertDiv, form.nextSibling);
                    
                    setTimeout(() => {
                        if (alertDiv.parentNode) alertDiv.remove();
                    }, 5000);
                };

                showSuccessMessage();
                contactForm.reset();
            }
        });
    }

    const themeToggle = document.getElementById('themeToggle');
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    const applyTheme = () => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                icon.className = 'fas fa-sun';
                themeToggle.setAttribute('title', 'Switch to Light Mode');
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                icon.className = 'fas fa-moon';
                themeToggle.setAttribute('title', 'Switch to Dark Mode');
            }
        }
    };

    applyTheme();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);
            applyTheme();
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.textContent);
                    let start = 0;
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= target) {
                            counter.textContent = target + '+';
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(start) + '+';
                        }
                    }, 16);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);
});