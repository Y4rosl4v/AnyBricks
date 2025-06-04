document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    if (!checkAuth()) {
        alert('Для добавления товара необходимо войти в систему');
        window.location.href = 'account.html';
        return;
    }

    const productForm = document.getElementById('productForm');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные из формы
        const productName = document.getElementById('product-name').value;
        const productPrice = parseFloat(document.getElementById('product-price').value);
        const productQuantity = parseInt(document.getElementById('product-quantity').value);
        const productImage = document.getElementById('product-image').value;
        
        // Генерируем уникальный ID
        const productId = Date.now();
        
        // Получаем текущие товары из localStorage
        let products = JSON.parse(localStorage.getItem('products')) || [];
        let userProducts = JSON.parse(localStorage.getItem('userProducts')) || {};
        
        // Добавляем новый товар
        const newProduct = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: productQuantity,
            seller: currentUser.email
        };
        
        products.push(newProduct);
        
        // Сохраняем информацию о товарах пользователя
        if (!userProducts[currentUser.email]) {
            userProducts[currentUser.email] = [];
        }
        userProducts[currentUser.email].push(productId);
        
        // Сохраняем в localStorage
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('userProducts', JSON.stringify(userProducts));
        
        alert('Товар успешно добавлен в каталог!');
        window.location.href = 'catalog.html';
    });
});