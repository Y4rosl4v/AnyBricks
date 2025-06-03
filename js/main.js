// Функция для обновления счетчика корзины в шапке
function updateBasketCounter() {
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
    
    // Находим все элементы счетчика на странице
    const basketCounters = document.querySelectorAll('.basket-counter');
    
    if (basketCounters.length === 0) {
        // Если счетчиков нет, создаем их для всех ссылок на корзину
        const basketLinks = document.querySelectorAll('nav ul li a[href="basket.html"]');
        
        basketLinks.forEach(link => {
            const counter = document.createElement('span');
            counter.className = 'basket-counter';
            counter.style.marginLeft = '5px';
            link.appendChild(counter);
            basketCounters.push(counter);
        });
    }
    
    // Обновляем все счетчики
    basketCounters.forEach(counter => {
        counter.textContent = totalItems > 0 ? `(${totalItems})` : '';
    });
}

// Обновляем счетчик при загрузке страницы
document.addEventListener('DOMContentLoaded', updateBasketCounter);

// Обновляем счетчик при изменении localStorage (если корзина изменилась в другой вкладке)
window.addEventListener('storage', function(event) {
    if (event.key === 'basket') {
        updateBasketCounter();
    }
});