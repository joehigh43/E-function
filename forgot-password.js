document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // منع الصفحة من إعادة التحميل

    const email = document.getElementById('email').value;

    if (email) {
        // هنا يتم الربط مع السيرفر مستقبلاً
        alert('A password recovery link has been sent to you: ' + email);
    } else {
        alert('Please enter a valid email address');
    }
});