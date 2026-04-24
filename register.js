const registerForm = document.getElementById('registerform');
const message = document.getElementById('message');

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // تجميع كل البيانات في Object واحد
    const newUser = {
        name: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value.trim(),
        governorate: document.getElementById('gov').value,
        gender: document.getElementById('gender').value
    };

    message.style.color = "#4a90e2";
    message.textContent = "Processing...";

    // إرسال البيانات للسيرفر
    fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(res => {
        if (res.ok) {
            message.style.color = "green";
            message.textContent = "Success! Redirecting to login...";
            setTimeout(() => {
                window.location.href = "Login.html";
            }, 2000);
        } else {
            throw new Error("Failed to register");
        }
    })
    .catch(error => {
        console.error(error);
        message.style.color = "red";
        message.textContent = "Error connecting to server!";
    });
});