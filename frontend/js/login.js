const form = document.querySelector('form');
const username = document.getElementById('username');
const password = document.getElementById('password');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = username.value;
    const pass = password.value;

    fetch('/login', {
        method: 'POST',
        // Backende şunu der "Benim gönderdiğim js objesi/request JSON formatında"
        headers: {
            'Content-Type': 'application/json'
        },
        /*
        Elimdeki canlı JS objesini al, 
        internet kablosundan geçebilecek bir metne (string) dönüştür 
        ama bunu yaparken JSON kurallarına (formatına) uy.
        */
        body: JSON.stringify({ username: user, password: pass })
    })
    // Backend'den gelen HTTP responde body'isini alop JSON formatına çevirir
    .then(res => {
        if (!res.status === 200) {
            throw new Error('Login failed');
        } else {
            console.log(res.body);
            return res.json();
        }
    })
    .then(data => {
        localStorage.setItem('username', user);
        window.location.href = '/user.html';
    })
    .catch(err => console.error(err));
});
