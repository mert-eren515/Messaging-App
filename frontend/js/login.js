const username = document.getElementById('username');
const password = document.getElementById('password');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = username.value;
    const pass = password.value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user, password: pass })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'ok') {
            localStorage.setItem('username', user);
            window.location.href = '/user.html';
        } else {
            alert('Login failed: ' + data.error);
        }
    })
    .catch(err => console.error(err));
});