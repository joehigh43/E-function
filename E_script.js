// Login Form System
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const emailValue = emailInput.value.trim().toLowerCase();
    const passwordValue = passwordInput.value.trim();

    message.style.color = "#4a90e2";
    message.textContent = "Checking your credentials...";

    fetch(`http://localhost:3001/users?email=${emailValue}`)
        .then(res => res.json())
        .then(data => {

            if (data.length > 0 && data[0].password === passwordValue) {

                localStorage.setItem("user", JSON.stringify(data[0]));

                message.style.color = "green";
                message.textContent = "Login Successful! 🔥";

                setTimeout(() => {
                    window.location.href = "products.html";
                }, 1000);

            } else {
                message.style.color = "red";
                message.textContent = "Invalid email or password ❌";
            }

        })
        .catch(error => {
            console.log(error);
            message.style.color = "red";
            message.textContent = "Server error!";
        });
});