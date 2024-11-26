let webstore = new Vue({
    el: '#app',
    data: {
        sitename: 'The Middlesex School - After School Classes',
        showSchool: false,
        showInfo: false,
        showContact: false,
        showSort: false,
        cartItems: [],
        school: {
            name: 'The Middlesex School',
            logo: 'assets/the-mdx-school.png'
        },
        lessons: [  
            {
                id: 1000,
                title: 'MATH',
                location: 'LONDON',
                availability: 5,
                price: 8,
                img: 'assets/Math-Symbol.jpg'
            },
            {
                id: 1001,
                title: 'English',
                location: 'Dubai',
                availability: 5,
                price: 16,
                img: 'assets/English-Symbol.jpg'
            },
            {
                id: 1002,
                title: 'Science',
                location: 'Mauritius',
                availability: 5,
                price: 32,
                img: 'assets/Science-Symbol.jpg'
            },
            {
                id: 1003,
                title: 'History',
                location: 'London',
                availability: 5,
                price: 64,
                img: 'assets/History-Symbol.jpg'
            },
            {
                id: 1004,
                title: 'Computer',
                location: 'Dubai',
                availability: 5,
                price: 128,
                img: 'assets/Computer-Symbol.jpg'
            }
        ],
        order: {
            name: '',
            phone: '',
            lessonIds: [],
            numOfSpaces: 1
        }
    },
    created() {
        this.fetchLessons(); 
    },
    methods: {
        
        showSortSection: function () {
            this.showSort = !this.showSort;
        },

        
        fetchLessons: function () {
            fetch('http://localhost:3000/Lessons')  
                .then(response => response.json())
                .then(data => {
                    this.lessons = data;  
                })
                .catch(error => {
                    console.error('Error fetching lessons:', error);
                });
        },

        
        addToCart: function (lesson) {
            if (lesson.availability > 0) {
                this.cartItems.push(lesson);
                lesson.availability--;
            } else {
                alert('No more seats available for this class');
            }
        },

        
        placeOrder: function () {
            const orderData = {
                name: this.order.name,
                phone: this.order.phone,
                lessonIds: this.cartItems.map(item => item.id),
                numOfSpaces: this.order.numOfSpaces
            };

            
            fetch('http://localhost:3000/Orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                alert('Order placed successfully!');
                console.log('Order Response:', data);
                this.clearCart();  
            })
            .catch(error => {
                alert('Error placing order!');
                console.error('Error:', error);
            });
        },

        
        clearCart: function () {
            this.cartItems = [];
            this.order = {
                name: '',
                phone: '',
                lessonIds: [],
                numOfSpaces: 1
            };
        }
    },
    computed: {}
});
