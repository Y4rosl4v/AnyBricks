// Массив товаров
const products = [
    { id: 1, name: "Куб 1x1", price: 0.1, image: "img/cube1x1.webp" },
    { id: 2, name: "Куб 2x2", price: 0.15, image: "img/cube2x2.jpg" },
    { id: 3, name: "Горка 1x2", price: 0.15, image: "img/slide1x2.webp" },
    { id: 4, name: "Куб 2x4", price: 0.2, image: "img/cube2x4.jpg" },
    { id: 5, name: "Куб 1x6", price: 0.2, image: "img/cube1x6.webp" },
    { id: 6, name: "Пластина 2x4", price: 0.15, image: "img/plastin2x4.webp" },
    { id: 7, name: "Штурмовик", price: 3, image: "img/storm.webp" },
    { id: 8, name: "Вейдер", price: 5, image: "img/vaider.webp" }
];

// Загрузка товаров на страницу
document.addEventListener('DOMContentLoaded', function() {
    const catalog = document.getElementById('catalog');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" class="product-image">
    </div>
    <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${product.price} BYN</p>
        <button class="add-to-basket" data-id="${product.id}">ДОБАВИТЬ В КОРЗИНУ</button>
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
});

// Функция добавления в корзину
function addToBasket(productId) {
    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    const product = products.find(p => p.id === productId);
    
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