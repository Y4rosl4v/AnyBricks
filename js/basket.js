document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) {
        document.getElementById('basket-items').innerHTML = `
            <div class="auth-required">
                <p>Для просмотра корзины необходимо войти в систему</p>
                <a href="account.html" class="auth-btn">ВОЙТИ</a>
            </div>
        `;
        document.getElementById('basket-summary').style.display = 'none';
        return;
    }

    const basketItems = JSON.parse(localStorage.getItem('basket')) || [];
    const basketItemsContainer = document.getElementById('basket-items');
    const basketSummaryContainer = document.getElementById('basket-summary');
    
    if (basketItems.length === 0) {
        basketItemsContainer.innerHTML = '<div class="empty-basket">Ваша корзина пуста</div>';
        basketSummaryContainer.style.display = 'none';
        return;
    }

    // Функция для точного умножения и сложения чисел с плавающей точкой
    function preciseMultiply(a, b) {
        // Умножаем на 100, чтобы работать с целыми числами
        return (Math.round(a * 100) * Math.round(b * 100)) / 10000;
    }
    
    function preciseSum(a, b) {
        return (Math.round(a * 100) + Math.round(b * 100)) / 100;
    }
    
    // Функция для форматирования цены
    function formatPrice(price) {
        // Округляем до 2 знаков и убираем лишние нули
        const rounded = Math.round(price * 100) / 100;
        return rounded.toFixed(2).replace(/\.?0+$/, '');
    }
    
    // Отображение товаров в корзине
    basketItems.forEach(item => {
        const basketItemElement = document.createElement('div');
        basketItemElement.className = 'basket-item';
        
        basketItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="basket-item-image">
            <div class="basket-item-info">
                <h3 class="basket-item-title">${item.name}</h3>
                <p class="basket-item-price">${formatPrice(item.price)} BYN за шт.</p>
                <div class="basket-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-btn" data-id="${item.id}">УДАЛИТЬ</button>
        `;
        
        basketItemsContainer.appendChild(basketItemElement);
    });
    
    // Расчет общей суммы
    updateBasketSummary();
    
    // Обработчики событий для кнопок
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const newQuantity = parseInt(this.value);
            
            if (newQuantity < 1) {
                this.value = 1;
                return;
            }
            
            updateQuantity(productId, 0, newQuantity);
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromBasket(productId);
        });
    });
    
    // Функция обновления количества
    function updateQuantity(productId, change, newQuantity = null) {
        let basket = JSON.parse(localStorage.getItem('basket')) || [];
        const itemIndex = basket.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            if (newQuantity !== null) {
                basket[itemIndex].quantity = newQuantity;
            } else {
                basket[itemIndex].quantity += change;
                
                if (basket[itemIndex].quantity < 1) {
                    basket[itemIndex].quantity = 1;
                }
            }
            
            localStorage.setItem('basket', JSON.stringify(basket));
            location.reload();
        }
    }
    
    // Функция удаления из корзины
    function removeFromBasket(productId) {
        let basket = JSON.parse(localStorage.getItem('basket')) || [];
        basket = basket.filter(item => item.id !== productId);
        localStorage.setItem('basket', JSON.stringify(basket));
        location.reload();
    }
    
    // Функция обновления итоговой суммы
    function updateBasketSummary() {
        const basket = JSON.parse(localStorage.getItem('basket')) || [];
        // Используем точные вычисления
        let subtotal = 0;
        basket.forEach(item => {
            subtotal = preciseSum(subtotal, preciseMultiply(item.price, item.quantity));
        });
        
        const shipping = subtotal > 2.45 ? 0 : 2.4;
        const total = preciseSum(subtotal, shipping);
        
        basketSummaryContainer.innerHTML = `
            <div class="summary-row">
                <span>Подытог:</span>
                <span>${formatPrice(subtotal)} BYN</span>
            </div>
            <div class="summary-row">
                <span>Доставка:</span>
                <span>${shipping === 0 ? 'Бесплатно' : formatPrice(shipping) + ' BYN'}</span>
            </div>
            <div class="summary-row total">
                <span>Итого:</span>
                <span>${formatPrice(total)} BYN</span>
            </div>
            <button class="checkout-btn">ОФОРМИТЬ ЗАКАЗ</button>
        `;
        
        // Обработчик для кнопки оформления заказа
        document.querySelector('.checkout-btn').addEventListener('click', function() {
            alert('Заказ оформлен! Спасибо за покупку!');
            localStorage.removeItem('basket');
            updateBasketCounter();
            location.reload();
        });
    }
});