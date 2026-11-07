// Рӯйхати ҷамоатҳо ва деҳаҳои ноҳияи Фархор
const farkhorLocations = {
    "Фархор (Марказ)": { minOrder: 50, percent: 10 },
    "ҷ. 20-солагии Истиқлолият (Комсомол)": { minOrder: 100, percent: 12 },
    "деҳ. Бобосафоли Поён": { minOrder: 100, percent: 13 },
    "деҳ. Бобосафоли Боло": { minOrder: 100, percent: 13 },
    "деҳ. Душанбе": { minOrder: 100, percent: 12 },
    "ҷ. Ватан (Садоқат/Қизилсу)": { minOrder: 100, percent: 14 },
    "деҳ. Лағмон": { minOrder: 100, percent: 13 },
    "деҳ. Баҳористон": { minOrder: 100, percent: 14 },
    "деҳ. Куҳандиёр (Уртабӯз)": { minOrder: 100, percent: 15 },
    "ҷ. Ғайрат": { minOrder: 100, percent: 13 },
    "деҳ. Сурхоб": { minOrder: 100, percent: 14 },
    "деҳ. Хушоби Поён": { minOrder: 100, percent: 14 },
    "деҳ. Хушоби Боло": { minOrder: 100, percent: 15 },
    "ҷ. Гулистон": { minOrder: 100, percent: 13 },
    "деҳ. Боҳор": { minOrder: 100, percent: 14 },
    "деҳ. Ғалаба": { minOrder: 100, percent: 14 },
    "деҳ. Деҳқонариқ": { minOrder: 100, percent: 13 },
    "деҳ. Зулмобод": { minOrder: 100, percent: 14 },
    "ҷ. Зафар (Сомониён)": { minOrder: 100, percent: 14 },
    "деҳ. Лолазор": { minOrder: 100, percent: 15 },
    "деҳ. Чоршанбе": { minOrder: 100, percent: 14 },
    "ҷ. Истиқлол (Ҷартеппа)": { minOrder: 100, percent: 15 },
    "деҳ. Навобод": { minOrder: 100, percent: 14 }
};

let cart = [];
let selectedLocation = "Фархор (Марказ)";

// Ҳисобкунаки нархи умумӣ ва доставка
function calculateTotal() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let locData = farkhorLocations[selectedLocation] || { minOrder: 50, percent: 10 };
    
    let deliveryFee = 0;
    let isValidOrder = subtotal >= locData.minOrder;

    if (subtotal > 0) {
        deliveryFee = Math.round((subtotal * locData.percent) / 100);
    }

    let total = subtotal + deliveryFee;

    return {
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        minOrder: locData.minOrder,
        isValid: isValidOrder,
        percent: locData.percent
    };
}
