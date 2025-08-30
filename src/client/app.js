const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const submitBtn = document.getElementById('submit');
const messageDiv = document.getElementById('message');
const currentTimeElement = document.getElementById('current-time');
const currentDateElement = document.getElementById('current-date');
const actionButtons = document.querySelectorAll('.action-btn');

// State variables
let selectedType = null;

// Initialize clock
function updateDateTime() {
    const now = new Date();

    // Update time
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    currentTimeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);

    // Update date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
}

// Update time immediately and set interval
updateDateTime();
setInterval(updateDateTime, 1000);

// Action selection
actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove selected class from all buttons
        actionButtons.forEach(b => b.classList.remove('selected'));

        // Add selected class to clicked button
        btn.classList.add('selected');

        // Update selected type
        selectedType = btn.getAttribute('data-type');

        // Enable submit button if it was disabled
        submitBtn.disabled = false;
    });
});

// Request camera stream
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        video.srcObject = stream;
    } catch (err) {
        showMessage('⚠️ Unable to access camera. Please check permissions.', 'error');
        console.error('Camera error:', err);
    }
}

// Capture photo as blob
function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
    });
}

// Show message with type
function showMessage(text, type = 'processing') {
    messageDiv.textContent = text;
    messageDiv.className = '';

    switch (type) {
        case 'success':
            messageDiv.classList.add('message-success');
            break;
        case 'error':
            messageDiv.classList.add('message-error');
            break;
        default:
            messageDiv.classList.add('message-processing');
    }
}

// Handle submit click
submitBtn.addEventListener('click', async () => {
    // Validate selection
    if (!selectedType) {
        showMessage('Please select Clock In or Clock Out first.', 'error');
        return;
    }

    // Update UI state
    showMessage('Capturing image...', 'processing');
    submitBtn.disabled = true;

    try {
        // Capture photo
        const photoBlob = await capturePhoto();

        // Update message
        showMessage('Submitting...', 'processing');

        // Prepare form data
        const formData = new FormData();
        formData.append('type', selectedType);
        formData.append('photo', photoBlob, 'photo.jpg');

        // Submit to server
        const res = await fetch('/api/clock', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            showMessage('✅ Successfully logged!', 'success');
            submitBtn.classList.add('success-pulse');
            setTimeout(() => {
                submitBtn.classList.remove('success-pulse');
            }, 500);
        } else {
            const errorData = await res.json();
            showMessage(`❌ Error: ${errorData.error || 'Failed to log time.'}`, 'error');
        }
    } catch (err) {
        console.error('Submission error:', err);
        showMessage('❌ Network error. Please try again.', 'error');
    } finally {
        // Reset after delay
        setTimeout(() => {
            actionButtons.forEach(b => b.classList.remove('selected'));
            selectedType = null;
            submitBtn.disabled = false;
            messageDiv.textContent = '';
            messageDiv.className = '';
        }, 3000);
    }
});

// Start camera on page load
startCamera();