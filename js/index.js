// Call the fetchData function when the page loads
document.addEventListener('DOMContentLoaded', function () {
    fetchDataFirstLoad();
    const isLogin = JSON.parse(localStorage.getItem('isLogin'));
    const loginBtn = document.querySelector('.login-button');
    const logoutBtn = document.querySelector('.logout-button');
    if (isLogin.expiration <= Date.now()) {
        localStorage.removeItem('isLogin');
        sessionStorage.removeItem('jwtToken');
        if(loginBtn) {
            loginBtn.style.visibility = 'visible';
        }
        if(logoutBtn) {
            logoutBtn.style.visibility = 'hidden';
        }
    } else if(isLogin.value) {
        if(loginBtn) {
            loginBtn.style.visibility = 'hidden';
        }
        if(logoutBtn) {
            logoutBtn.style.visibility = 'visible';
        }
        checkLoggedIn();
    }
});

async function fetchDataFirstLoad() {
    try {
        // Make the API call using the fetch function
        const response = await fetch('http://localhost:3000/category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Ensure the response is successful (status code 2xx)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON data
        const data = await response.json();

        getProductDataThenDisplay(data);
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
    }
}

async function getProductDataThenDisplay(categories) {
    try {
        let content = ``;
        categories.forEach(async (category) => {
            const getProducts = await fetch(`http://localhost:3000/product/category/${category.id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!getProducts.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const products = await getProducts.json();

            content += `<div class="container mt-5">
                            <h2 class="pb-2 border-bottom knu-categoty-title">${category.categoryName}</h2>
                            <div class="row mt-3">
                        `;

            products.forEach((product) => {
                content += `<div class="col-6 col-sm-6 col-md-4 col-lg-3 mt-2" alt="sku001">
				    <div id="${product.id}" class="product-card card">
					    <div class="card-body">
						    <div class="card-img-actions">
						    <img src="${product.imageUrl}" class="card-img img-fluid" alt="">
					    </div>
					    </div>
					    <div class="card-body mt-0">
						    <h5 class="title-spp mb-0">
						        <a href="#">${product.productName}</a>
						    </h5>
						    <h7 class="mb-0 subprice">${product.originalPrice ? convertCurrency(product.originalPrice) : ''}</h7>
						    <h4 class="mb-0 mainprice">${convertCurrency(product.price)}</h4>
						    <div style="font-size: 12px; color: #121212;">${product.productDescription}</div>
						    <div class="flex-container mt-2">
							    <div>
								    <i class="fa fa-star star mr-0"> 4/5</i>
								    <div class="mb-1 text-soluong"><strong>155K</strong> đã bán</div>
							    </div>
							    <button type="button" class="btn">
								    <i class="fa fa-cart-plus"></i>
							    </button>
						    </div>
					    </div>
                    </div>
                </div>
            `
            });
            content += `</div></div>`
            document.getElementById("knu-list-products-by-category").innerHTML = content;
        });

    } catch (error) {
        console.log('error: ', error);
    }
}

function convertCurrency(price) {
    const result = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    return result;
}

async function checkLoggedIn() {
    const getToken = sessionStorage.getItem('jwtToken');
    if(getToken) {
        const getUser = await fetch('http://localhost:3000/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken}`,
                'Content-Type': 'application/json'
            }
        });
        if(!getUser.ok) {
            throw new Error(`HTTP error! Status: ${getUser.status}`);
        }
        const getUserRes = await getUser.json();

        const showUsername = document.querySelector("#knu-user-name");
        if(showUsername) {
            showUsername.textContent = `Welcome ${getUserRes.firstName} ${getUserRes.lastName}`;
            showUsername.style.display = 'block';
        }
    }
}