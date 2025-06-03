document.addEventListener('DOMContentLoaded', function() {
    // Переключение между вкладками
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            
            const tabName = this.getAttribute('data-tab');
            document.getElementById(`${tabName}-form`).classList.add('active');
        });
    });

    // Имитация базы данных пользователей
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Обработка формы регистрации
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm').value;
        
        // Валидация
        if (password !== confirmPassword) {
            showMessage('Пароли не совпадают!', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage('Пароль должен содержать минимум 6 символов', 'error');
            return;
        }
        
        // Проверка, есть ли уже такой пользователь
        if (users.some(user => user.email === email)) {
            showMessage('Пользователь с таким email уже существует', 'error');
            return;
        }
        
        // Сохраняем пользователя (в реальном приложении пароль нужно хешировать!)
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        showMessage('Регистрация прошла успешно! Теперь вы можете войти.', 'success');
        registerForm.reset();
        
        // Переключаем на вкладку входа
        document.querySelector('.auth-tab[data-tab="login"]').click();
    });
    
    // Обработка формы входа
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Поиск пользователя
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            showMessage('Вход выполнен успешно!', 'success');
            
            // Сохраняем данные о текущем пользователе
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Перенаправляем на главную страницу через 1 секунду
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage('Неверный email или пароль', 'error');
        }
    });
    
    // Функция для отображения сообщений
    function showMessage(text, type) {
        const messageEl = document.getElementById('auth-message');
        messageEl.textContent = text;
        messageEl.className = `auth-message ${type}`;
        
        // Скрываем сообщение через 5 секунд
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = 'auth-message';
        }, 5000);
    }
});