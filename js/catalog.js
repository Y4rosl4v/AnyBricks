// Массив товаров
const defaultProducts = [
    { id: 1, name: "Куб 1x1", price: 0.1, image: "img/cube1x1.webp", seller: 'system' },
    { id: 2, name: "Куб 2x2", price: 0.15, image: "img/cube2x2.jpg", seller: 'system' },
    { id: 3, name: "Горка 2x1", price: 0.15, image: "img/slide1x2.webp", seller: 'system' },
    { id: 4, name: "Куб 2x4", price: 0.2, image: "img/cube2x4.jpg", seller: 'system' },
    { id: 5, name: "Куб 1x6", price: 0.2, image: "img/cube1x6.webp", seller: 'system' },
    { id: 6, name: "Пластина 2x4", price: 0.15, image: "img/plastin2x4.webp", seller: 'system' },
    { id: 7, name: "Штурмовик", price: 3, image: "img/storm.webp", seller: 'system' },
    { id: 8, name: "Вейдер", price: 5, image: "img/vaider.webp", seller: 'system' },
    { id: 9, name: "Кай", price: 3, image: "img/kai.webp", seller: 'system' },
    { id: 10, name: "Бластер", price: 0.5, image: "img/blaster.jpg", seller: 'system' },
    { id: 11, name: "Динамит", price: 0.45, image: "img/dynamite.jpg", seller: 'system' },
    { id: 12, name: "100 BUCKS", price: 0.1, image: "img/money.webp", seller: 'system' }
];

document.addEventListener('DOMContentLoaded', function() {
    const userProducts = JSON.parse(localStorage.getItem('products')) || [];
    const allProducts = [...defaultProducts, ...userProducts];
    console.log('All products:', allProducts);

    const catalog = document.getElementById('catalog');
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    console.log('Current user:', currentUser);

    // Сохраняем продукты в глобальной переменной для использования в других функциях
    window.products = allProducts;
    
    allProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Проверяем, является ли пользователь продавцом этого товара
        const isSeller = currentUser && currentUser.email === product.seller;
        // Проверяем, является ли пользователь админом
        const isAdmin = currentUser && currentUser.isAdmin;
        
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price} BYN</p>
                ${(isSeller || isAdmin) 
                    ? `<button class="remove-product" data-id="${product.id}">УДАЛИТЬ</button>` 
                    : `<button class="add-to-basket" data-id="${product.id}">ДОБАВИТЬ В КОРЗИНУ</button>`}
            </div>
        `;
        
        catalog.appendChild(productCard);
    });

    // Обработка добавления в корзину
    document.querySelectorAll('.add-to-basket').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToBasket(productId);
        });
    });

    // Обработка удаления товара
    document.querySelectorAll('.remove-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeProduct(productId);
        });
    });
});

// Функция добавления в корзину
function addToBasket(productId) {
    if (!checkAuth()) {
        alert('Пожалуйста, войдите в систему, чтобы добавить товары в корзину');
        window.location.href = 'account.html';
        return;
    }

    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    const product = window.products.find(p => p.id === productId);
    
    const existingItem = basket.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        basket.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('basket', JSON.stringify(basket));
    alert(`${product.name} добавлен в корзину!`);
    updateBasketCounter();
}

// Функция удаления товара
function removeProduct(productId) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Удаляем из общего списка товаров
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const allProducts = [...defaultProducts, ...products];
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) return;
    
    // Проверяем права на удаление
    const isSeller = currentUser && currentUser.email === product.seller;
    const isAdmin = currentUser && currentUser.isAdmin;
    
    if (isAdmin) {
        // Админ может удалять любые товары
        if (product.seller === 'system') {
            // Для системных товаров просто удаляем из отображения (но они остаются в defaultProducts)
            location.reload();
        } else {
            // Удаляем пользовательский товар
            products = products.filter(p => p.id !== productId);
            localStorage.setItem('products', JSON.stringify(products));
            
            // Обновляем страницу
            location.reload();
        }
    } else if (isSeller) {
        // Продавец может удалять только свои товары
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        
        // Если это не админ, удаляем из списка товаров пользователя
        if (currentUser) {
            let userProducts = JSON.parse(localStorage.getItem('userProducts')) || {};
            if (userProducts[currentUser.email]) {
                userProducts[currentUser.email] = userProducts[currentUser.email].filter(id => id !== productId);
                localStorage.setItem('userProducts', JSON.stringify(userProducts));
            }
        }
        
        // Обновляем страницу
        location.reload();
    } else {
        alert('У вас нет прав на удаление этого товара');
    }
}