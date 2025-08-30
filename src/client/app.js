const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const submitBtn = document.getElementById('submit');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream);

submitBtn.addEventListener('click', async () => {
    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('photo', blob, 'photo.png');

        await fetch('/api/clock', {
            method: 'POST',
            body: formData
        });

        alert('Logged successfully!');
    }, 'image/png');
});
