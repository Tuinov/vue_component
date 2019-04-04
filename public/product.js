
const $productsWrap = document.getElementById('productsWrap');
const $cart = document.getElementById('cart');

//function sendRequest(url) {
//    return fetch(url).then((response) => response.json());
//}




function sendRequest(url) {
    return fetch(url).then((response) => response.json());
//    return new Promise((resolve, reject) => {
//       const xhrj = new XMLHttpRequest();
//          xhrj.open('GET', url);
//          xhrj.send();
//          
//          xhrj.onreadystatechange = () => {
//              if(xhrj.readyState === xhrj.DONE) {
//                  if(xhrj.status === 200) {
//                      resolve(JSON.parse(xhrj.responseText));
//                  } else {
//                      reject();
//                  }            
//              }
//          }
//}); 
    };
    


class Item {
    constructor(name, price){
        this.name = name;
        this.price = price;
    }
    
    render(){
    return `<div class="item"><h3>${this.name}<span>${this.price}</span></h3></div>`;
    
}
}

class ItemsList {
    constructor(){
        this.items = [];
   }
    getItems() { 
       return sendRequest('http://localhost:3000/product.json').then((products) => { 
        this.items = products.map(item => new Item(item.name, item.price));
        return this.items;                                                                     
           
       });
    }
    
    
    render() {
        const itemsHtml = this.items.map(item => item.render());
                                         
        return itemsHtml.join('');                                 
    }
    // считает сумму товаров
 total() {
     return this.items.reduce((acc, item) => acc + item.price, 0);
    }
}

const items = new ItemsList();


items.getItems().then(() => {
    $productsWrap.innerHTML = items.render();
});


 const $buttonCtr = document.querySelector('#control');
      $buttonCtr.addEventListener('click', () => {
         sendRequest('http://localhost:3000/product.json').then((products) => $cart.innerHTML = products.map(item => `<li>${item.name}: ${item.price}</li>`));
      });