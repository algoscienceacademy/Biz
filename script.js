document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');

    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });

    mobileMenuClose?.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });

    // Clone navigation items for mobile menu
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuItems = document.querySelector('.mobile-menu-items');

    if (navLinks && mobileMenuItems) {
        mobileMenuItems.innerHTML = navLinks.innerHTML;
    }

    // Enhanced File Upload Handling
    const fileUpload = document.querySelector('.file-upload-input');
    const fileName = document.querySelector('.file-name');
    const fileUploadWrapper = document.querySelector('.file-upload-wrapper');
    const maxFileSize = 5 * 1024 * 1024; // 5MB max file size

    function handleFileUpload(file) {
        if (!file) return;

        // Check file size
        if (file.size > maxFileSize) {
            alert('File size should not exceed 5MB');
            return;
        }

        // Check file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload PDF or Word documents only');
            return;
        }

        fileName.textContent = file.name;
        fileName.style.display = 'block';
    }

    fileUpload?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFileUpload(file);
    });

    // Enhanced Form Submission
    const cvForm = document.getElementById('cvForm');
    cvForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = cvForm.querySelector('.upload-button');
        const originalButtonText = submitButton.innerHTML;
        
        // Form validation
        const name = document.getElementById('applicantName').value;
        const email = document.getElementById('applicantEmail').value;
        const file = document.getElementById('cvFile').files[0];
        
        if (!name || !email || !file) {
            alert('Please fill in all required fields and upload your CV');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            // Create FormData object
            const formData = new FormData(cvForm);

            // Here you would typically send the formData to your server
            // For demonstration, we'll simulate an API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            submitButton.innerHTML = '<i class="fas fa-check"></i> Submitted Successfully';
            submitButton.style.backgroundColor = '#10B981';

            // Reset form after success
            setTimeout(() => {
                cvForm.reset();
                fileName.textContent = '';
                fileName.style.display = 'none';
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                submitButton.style.backgroundColor = '';
            }, 3000);

        } catch (error) {
            console.error('Error submitting form:', error);
            submitButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> Submission Failed';
            submitButton.style.backgroundColor = '#EF4444';

            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                submitButton.style.backgroundColor = '';
            }, 3000);
        }
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                mobileMenu?.classList.remove('active');
            }
        });
    });

    // Initialize Charts if they exist
    if (typeof Chart !== 'undefined') {
        const billChart = document.getElementById('billChart');
        if (billChart) {
            new Chart(billChart.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Monthly Bills',
                        data: [1200, 1900, 1500, 2200, 1800, 1600],
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#fff'
                            }
                        }
                    },
                    scales: {
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#fff'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#fff'
                            }
                        }
                    }
                }
            });
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.team-member, .contact-item').forEach(el => {
        observer.observe(el);
    });

    // Add active class to current section in navigation
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // File drag and drop enhancement
    const dropZone = document.querySelector('.file-upload-wrapper');

    if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropZone.classList.add('drag-over');
        }

        function unhighlight(e) {
            dropZone.classList.remove('drag-over');
        }

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            const fileInput = document.querySelector('.file-upload-input');
            const fileName = document.querySelector('.file-name');

            if (fileInput && files.length > 0) {
                fileInput.files = files;
                fileName.textContent = files[0].name;
            }
        }
    }

    // Progress bar functionality
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.background = `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(255, 255, 255, 0.1) 0%,
                    rgba(255, 255, 255, 0.05) 50%,
                    rgba(255, 255, 255, 0.02) 100%
                )
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = 'rgba(255, 255, 255, 0.05)';
        });
    });

    // Smooth reveal for sections
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });

    // Add this CSS for the section reveal animation
    const style = document.createElement('style');
    style.textContent = `
        .section-hidden {
            opacity: 0;
            transform: translateY(50px);
            transition: all 1s;
        }
        
        .revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Add particle background
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        document.body.appendChild(particle);

        const size = Math.random() * 5 + 2;
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}px;
            top: ${startY}px;
            animation: float ${duration}s ${delay}s infinite linear;
        `;

        setTimeout(() => {
            document.body.removeChild(particle);
        }, (duration + delay) * 1000);
    };

    // Create particles periodically
    setInterval(createParticle, 1000);

    // Scroll to Top functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Image loading animation
    document.querySelectorAll('img').forEach(img => {
        img.classList.add('loading-image');
        img.addEventListener('load', () => {
            img.classList.remove('loading-image');
        });
    });

    // Add parallax effect to gradient orbs
    window.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.gradient-orb');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Add ripple effect to buttons
    document.querySelectorAll('button, .nav-item').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add this CSS for the ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}); 