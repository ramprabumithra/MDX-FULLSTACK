<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Vue.js Pet Store Checkout</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

        body {
            font-family: 'Inter', sans-serif;
            background-color: #C1BFFA;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            margin: 0;
        }

        #app {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 30px;
            background-color: white;
            border: 2px solid #1B1B1B;
            border-radius: 16px;
            box-sizing: border-box;
            box-shadow: 6px 6px 0px #1B1B1B;
            width: 48vw;
            margin-top: 50px;
            margin-bottom: 80px;
        }

        h2 {
            font-size: 2rem;
            font-weight: 800;
            color: #333;
            margin-bottom: 10px;
            border-bottom: 2px solid #1B1B1B;
            padding-bottom: 10px;
        }

        label {
            font-weight: 600;
            margin-bottom: 5px;
            color: #555;
        }

        input[type="text"],
        input[type="number"],
        select {
            display: block;
            width: 100%;
            max-width: 90%;
            padding: 10px;
            margin: 15px 0;
            border: 2px solid #1B1B1B;
            border-radius: 16px;
            background: #FFFFFF;
            transition: 0.2s ease;
        }

        input:focus,
        select:focus {
            outline: none;
            background-color: #F9E450;
            border: 3px solid #1B1B1B;
        }

        button {
            width: 141px;
            height: 56px;
            background-color: #F9E450;
            border: 2px solid #1B1B1B;
            border-radius: 16px;
            font-weight: 800;
            cursor: pointer;
            margin-top: 20px;
            transition: background-color 0.2s ease-out, box-shadow 0.2s;
        }

        button:hover {
            background-color: #FFBB38;
            box-shadow: 0 0 0 4px #C1BFFA;
        }

        .cart-item {
            border-bottom: 2px solid #ddd;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            background-color: #F9F9F9;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .cart-item:last-child {
            border-bottom: none;
        }

        .cart-item .details {
            display: flex;
            flex-direction: column;
        }

        .cart-item .details p {
            margin: 5px 0;
            color: #555;
        }

        .cart-item .item-summary {
            display: flex;
            flex-direction: column;
            text-align: right;
        }

        .cart-item .item-summary p {
            margin: 5px 0;
        }

        .cart-item img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            margin-right: 15px;
            border-radius: 8px;
        }

        .grand-total {
            font-size: 1.5rem;
            font-weight: bold;
            color: #333;
            margin-top: 20px;
            text-align: right;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.js"></script>
</head>
<body>
    <div id="app">
        <h2>Checkout</h2>
        
        
        <div v-if="cart.length > 0">
            <h3>Your Cart</h3>
            <div v-for="item in cart" :key="item.id" class="cart-item">
                <img :src="item.img" alt="Product Image" />
                <div class="details">
                    <p><strong>{{ item.title }}</strong></p>
                    <p>Price: ${{ item.price }}</p>
                    <p>Quantity: {{ item.quantity }}</p>
                </div>
                <div class="item-summary">
                    <p><strong>Total: ${{ item.price * item.quantity }}</strong></p>
                </div>
            </div>
            <div class="grand-total">
                <p><strong>Grand Total: ${{ cartTotal }}</strong></p>
            </div>
        </div>
        <div v-else>
            <p>Your cart is empty.</p>
        </div>

        
        <p>
            <strong>First Name:</strong>
            <input v-model="order.firstName" type="text" @input="saveDetails" />
        </p>
        <p>
            <strong>Last Name:</strong>
            <input v-model="order.lastName" type="text" @input="saveDetails" />
        </p>
        <p>
            <strong>Address:</strong>
            <input v-model="order.address" type="text" @input="saveDetails" />
        </p>
        <p>
            <strong>City:</strong>
            <select v-model="order.city" @change="saveDetails">
                <option v-for="(city, key) in cities" :value="city">{{ key }}</option>
            </select>
        </p>
        <p>
            <strong>Zip/Postal Code:</strong>
            <input v-model.number="order.zip" type="number" @input="saveDetails" />
        </p>
        <p>
            <input type="checkbox" id="gift" v-model="order.gift" @change="saveDetails">
            <label for="gift">Send as a Gift</label>
        </p>
        <p>
            <input type="radio" id="home" value="Home" v-model="order.method" @change="saveDetails">
            <label for="home">Home</label>
            <input type="radio" id="business" value="Business" v-model="order.method" @change="saveDetails">
            <label for="business">Business</label>
        </p>

        <button :disabled="!completedForm" @click="submitForm">Place Order</button>
    </div>

    <script>
    new Vue({
    el: '#app',
    data: {
        cart: [],
        order: {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            zip: '',
            gift: false,
            method: '',
            lessons: []  
        },
        cities: {
            DXB: 'Dubai',
            ADB: 'Abu Dhabi',
            SHJ: 'Sharjah',
            AJM: 'Ajman',
            UAQ: 'Umm Al Quwain',
            RAK: 'Ras Al Khaimah',
            FUJ: 'Fujairah'
        }
    },
    computed: {
        completedForm() {
            // Check if all the fields are filled and valid
            return this.order.firstName &&
                   this.order.lastName &&
                   this.order.address &&
                   this.order.city &&
                   this.order.zip &&
                   this.order.method;
        },
        cartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    },
    methods: {
        validateInputs() {
            const textFields = [this.order.firstName, this.order.lastName, this.order.address];
            const zipCode = this.order.zip;

            const containsNumber = (text) => /\d/.test(text);
            if (textFields.some(containsNumber)) {
                alert('Text fields should not contain numbers.');
                return false;
            }

            if (!/^\d+$/.test(zipCode)) {
                alert('Zip/Postal Code should contain only numbers.');
                return false;
            }

            return true;
        },
        saveDetails() {
            if (this.validateInputs()) {
                localStorage.setItem('order', JSON.stringify(this.order));
            }
        },
        loadCart() {
            const cartData = JSON.parse(localStorage.getItem('cart')) || [];
            this.cart = cartData;
            this.order.lessons = cartData.map(item => ({
                lessonTitle: item.title,
                price: item.price,
                quantity: item.quantity,
            }));
        },
        loadDetails() {
            const orderData = JSON.parse(localStorage.getItem('order')) || {};
            Object.assign(this.order, orderData);
        },
        clearCart() {
            this.cart = [];
            localStorage.removeItem('cart');
        },
        clearDetails() {
            this.order.firstName = '';
            this.order.lastName = '';
            this.order.address = '';
            this.order.city = '';
            this.order.zip = '';
            this.order.gift = false;
            this.order.method = '';
            localStorage.removeItem('order');
        },
        submitForm() {
            const orderData = {
                ...this.order,
                lessons: this.cart.map(item => ({
                    lessonTitle: item.title,
                    price: item.price,
                    quantity: item.quantity
                }))
            };

            fetch('http://localhost:3000/placeOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            })
            .then(response => response.json())
            .then(data => {
                this.clearCart();
                this.clearDetails();
                alert('Order placed successfully!');
            })
            .catch(error => {
                alert('Failed to place order.');
            });
        }
    },
    mounted() {
        this.loadCart();
        this.loadDetails();
    }
});
    </script>
</body>
</html>
