document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const cvForm = document.querySelector('.cv-form');
    const fileInput = document.querySelector('#cv-file');
    const fileName = document.querySelector('.file-name');
    const uploadButton = document.querySelector('.upload-button');
    const fileUpload = document.querySelector('.file-upload');

    // Mobile Menu Handling
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuItems = document.querySelector('.mobile-menu-items');
    
    // Clone navigation items for mobile menu
    const navLinks = document.querySelector('.nav-links').cloneNode(true);
    mobileMenuItems.appendChild(navLinks);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a link
    mobileMenuItems.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // File upload handling
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                const allowedTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ];
                
                if (!allowedTypes.includes(file.type)) {
                    showNotification('Please upload PDF or Word documents only', 'error');
                    fileInput.value = '';
                    return;
                }
                
                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('File size should not exceed 5MB', 'error');
                    fileInput.value = '';
                    return;
                }

                fileName.style.display = 'block';
                fileName.textContent = file.name;
                fileUpload.classList.add('active');
            }
        });

        // Drag and drop functionality
        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.classList.add('drag-over');
        });

        fileUpload.addEventListener('dragleave', () => {
            fileUpload.classList.remove('drag-over');
        });

        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUpload.classList.remove('drag-over');
            
            const file = e.dataTransfer.files[0];
            if (file) {
                fileInput.files = e.dataTransfer.files;
                fileName.style.display = 'block';
                fileName.textContent = file.name;
                fileUpload.classList.add('active');
            }
        });
    }

    // Form submission
    if (cvForm) {
        cvForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(cvForm);
            const file = fileInput.files[0];
            
            // Validate required fields
            if (!formData.get('name') || !formData.get('email') || !formData.get('position') || !file) {
                showNotification('Please fill in all required fields and upload your CV', 'error');
                return;
            }

            // Show loading state
            uploadButton.disabled = true;
            uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            try {
                // Convert file to base64
                const base64File = await convertFileToBase64(file);
                
                // Send to server
                const response = await fetch('/api/submit-cv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        position: formData.get('position'),
                        cv: base64File,
                        fileName: file.name
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to submit application');
                }

                showNotification('Application submitted successfully!', 'success');
                cvForm.reset();
                fileName.style.display = 'none';
                fileUpload.classList.remove('active');
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error submitting application. Please try again.', 'error');
            } finally {
                uploadButton.disabled = false;
                uploadButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
            }
        });
    }

    // Utility functions
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    // Smooth scroll for apply buttons
    document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll to Top Button
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

    // Create and append menu overlay
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);

    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}); 