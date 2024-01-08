document.addEventListener('DOMContentLoaded', function () {
    fillCart();
    handleChangeQty();
    handleDeleteItem();
});

function fillCart() {
    const getCartInfo = localStorage.getItem('cart-info');
    if(!getCartInfo || getCartInfo == '' || !getCartInfo.length) {
        console.log('Cart empty');
        alert('Cart empty');
    } else {
        let content = `<table>
        <tr>
            <th>Sản phẩm</th>
            <th></th>
            <th>SL</th>
            <th>Đơn giá</th>
        </tr>
        `;
        let cartData = JSON.parse(getCartInfo);
        const totalAmount = cartData.reduce(function (accumulator, product) {
            return accumulator + product.totalPrice;
        }, 0);

        cartData.forEach((product) => {
            content += `
            <tr alt="spc-01">
				<td>
					<div class="cart-info">
						<img src="${product.imageUrl}" alt="sp007">						
					</div>
				</td>
				<td>	
					<div class="cart-name">
						<h7 class="cart-title">${product.productName}</h7>						
						<small>${convertCurrency(product.price)}</small>
						<br>
						<a class="knu-delete-item" knt-delete-item-id="${product.productId}" href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>
					</div>
				</td>
				<td><input type="number" knt-cart-item-id="${product.productId}" value="${product.quantity}"></td>
				<td>${convertCurrency(product.totalPrice)}</td>
			</tr>
        `
        });
        content += `</table>`
        
        const listItemCart = document.querySelector('#knu-list-cart-item');
        const subTotal = document.querySelector('.knu-sub-total');
        const total = document.querySelector('.knu-total');
        subTotal.innerHTML = convertCurrency(totalAmount);
        total.innerHTML = convertCurrency(totalAmount);
        listItemCart.innerHTML = content ? content : '';
    }

}

function handleChangeQty() {
    const quantityInput = document.querySelectorAll("input[type=number]");
    if(quantityInput && quantityInput.length) {
        const cartData = JSON.parse(localStorage.getItem('cart-info'));
        quantityInput.forEach((input) => {
            input.addEventListener('change', () => {
                const productId = Number.parseInt(input.getAttribute('knt-cart-item-id'));
                const quantity = Number.parseInt(input.value)
                updateCartData(productId, cartData, quantity);
                fillCart();
                handleChangeQty();
                handleDeleteItem();
            });
        });
    }
}

function handleDeleteItem() {
    const deleteCartItemBtn = document.querySelectorAll(".knu-delete-item");
    if (deleteCartItemBtn && deleteCartItemBtn.length) {
        const cartData = JSON.parse(localStorage.getItem('cart-info'));
        deleteCartItemBtn.forEach((btn) => {
            btn.addEventListener('click', () => {
                const productId = Number.parseInt(btn.getAttribute('knt-delete-item-id'));
                deleteCartItem(cartData, productId);
                fillCart();
                handleDeleteItem();
                handleChangeQty();
            });
        });
    }
}
function convertCurrency(price) {
    const result = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    return result;
}

function updateCartData(productId, cartData, quantity) {
    const findItem =  cartData.findIndex(function (product) {
        return product.productId === productId;
    });
    if(quantity > 0) {
        cartData[findItem].quantity = quantity;
        cartData[findItem].totalPrice = cartData[findItem].price * quantity;
        localStorage.setItem("cart-info", JSON.stringify(cartData));
    } else {
        deleteCartItem(cartData, productId);
    }
}

function deleteCartItem(cartData, productId) {
    const newCartData = cartData.filter(function (cartItem) {
        return cartItem.productId !== productId;
    });
    localStorage.setItem("cart-info", JSON.stringify(newCartData));
}