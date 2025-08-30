const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const submitBtn = document.getElementById('submit');
// const nameInput = document.getElementById('name');
const messageDiv = document.getElementById('message');

// Request camera stream
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
    } catch (err) {
        messageDiv.textContent = '⚠️ Unable to access camera.';
        console.error(err);
    }
}

// Capture photo as blob
function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png');
    });
}

// Handle submit click
submitBtn.addEventListener('click', async () => {
    
    messageDiv.textContent = '';
    submitBtn.disabled = true;

    // if (!name) {
    //     messageDiv.textContent = 'Please enter your name.';
    //     submitBtn.disabled = false;
    //     nameInput.focus();
    //     return;
    // }

    
    try {
        const type = document.querySelector('input[name="type"]:checked').value;
        console.debug("Here!", type)

        const photoBlob = await capturePhoto();

        const formData = new FormData();
        formData.append('type', type);
        formData.append('photo', photoBlob, 'photo.png');

        messageDiv.textContent = 'Submitting...';

        const res = await fetch('/api/clock', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            messageDiv.textContent = '✅ Logged successfully!';
        } else {
            const errorData = await res.json();
            messageDiv.textContent = `❌ Error: ${errorData.error || 'Failed to log.'}`;
        }
    } catch (err) {
        console.error(err);
        messageDiv.textContent = '❌ Unexpected error occurred.';
    } finally {
        submitBtn.disabled = false;
        const radios = document.querySelectorAll('input[name="type"]');
        radios.forEach(radio => radio.checked = false);
        setTimeout(()=>{
            messageDiv.textContent = ""
        }, 2000)
    }
});

// Start camera on page load
startCamera();
