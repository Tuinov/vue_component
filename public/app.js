const API_URL = 'http://localhost:3000';

//поиск, корзина и отображение ошибок в компонент.

Vue.component('products', {
  props: ['items', 'onbuy'],    
  template: `<div class="goods">
       <div v-for="item in items">
           <h3>{{item.name}} </h3>
           <span>{{item.price}} </span>
           <button @click="handleBuyClick(item)">buy</button>
       </div>
   </div>`,
    
     methods: {
       handleBuyClick(item){
           this.$emit('onbuy', item);
       }
     }
});

Vue.component('cart-component', {
  props: ['cart'],    
  template: `<h1>Общая сумма товаров в корзине: {{totalAmount}}</h1>`,
   computed: {
        totalAmount() {
            return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
    }  
});

Vue.component('search-component', {
    props: ['item', 'searchQuery'],
  template: `<input type="text" v-model="searchQuery">`,
    computed: {
        filteredItems() {
            const regexp = new RegExp(this.searchQuery, 'i');
            return this.items.filter((item) => regexp.test(item.name));
        }
    }
});

Vue.component('error-component', {
  template: '<h1>error!</h1>'
});

const app = new Vue({
  el: '#app',
  data: {

    items: [],
    searchQuery: '',
    display: 'none',
    cart: [],  
  },
    
    methods: {
       handleBuyClick(item){

        const cartItem = this.cart.find(cartItem => cartItem.id === item.id)
           if(cartItem) {
             fetch(`${API_URL}/cart/${item.id}`, {
              method: 'PATCH',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({quantity: cartItem.quantity + 1})
             }).then((response) => response.json())
             .then((updated) => {
              const itemIdx = this.cart.findIndex(cartItem => cartItem.id === item.id);
              Vue.set(this.cart, itemIdx, updated);
             });
           } else {
              fetch(`${API_URL}/cart`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...item, quantity: 1}),
              }).then((response) => response.json())
                .then((created) => {
                  this.cart.push(created);
                });
           }
       } 
    },
    
    mounted(){
        fetch(`${API_URL}/products`)
            .then((response) => response.json())
            .then((items) => {
            this.items = items;
        });
        fetch(`${API_URL}/cart`)
         .then((response) => response.json())
            .then((items) => {
              this.cart = items;
            }); 
    },
    
    computed: {
        filteredItems() {
            const regexp = new RegExp(this.searchQuery, 'i');
            return this.items.filter((item) => regexp.test(item.name));
        },
        
        totalAmount() {
            return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
    }
    
});