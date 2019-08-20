import React, {Component} from 'react';
import {storeProducts, detailProduct} from "./data";

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  };

  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach(item => {
      let singleItem = {...item};
      tempProducts = [...tempProducts, singleItem];
      this.setState({
        products: tempProducts
      });
    });
  };

  getItem = (id) => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  };

  handleDetail = (id) => {
    const chosenProduct = this.getItem(id);
    this.setState({
      detailProduct: chosenProduct
    })
  };

  addToCart = (id) => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState({
        products: tempProducts,
        cart: [...this.state.cart, product]
      }, () => this.addTotals()
    );
  };

  openModal = (id) => {
    const product = this.getItem(id);
    this.setState({
      modalProduct: product,
      modalOpen: true
    });
  };

  closeModla = () => {
    this.setState({
      modalOpen: false
    });
  };

  increment = (id) => {
    let tempCart = [...this.state.cart];
    const tempProduct = tempCart.find((item) => item.id === id);
    tempProduct.count += 1;
    tempProduct.total = tempProduct.price * tempProduct.count;
    this.setState({
      cart: [...tempCart]
    }, () => {
      this.addTotals();
    });
  };

  decrement = (id) => {
    let tempCart = [...this.state.cart];
    const tempProduct = tempCart.find((item) => item.id === id);
    tempProduct.count -= 1;
    if (tempProduct.count === 0) {
      this.removeItem(id);
    }
    else {
      tempProduct.total = tempProduct.price * tempProduct.count;
      this.setState({
        cart: [...tempCart]
      }, () => {
        this.addTotals();
      });
    }
  };

  removeItem = (id) => {
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter(item => item.id !== id);
    const index = tempProducts.indexOf(this.getItem(id));
    let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;
    this.setState({
      cart: [...tempCart],
      products: [...tempProducts]
    }, () => {
      this.addTotals();
    })
  };

  clearCart = () => {
    this.setState({
      cart: []
    }, () => {
      this.setProducts();
      this.addTotals();
    });
  };

  addTotals = () => {
    let subTotal = 0;
    this.state.cart.map(item => subTotal += item.total);
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState({
      cartSubTotal: subTotal,
      cartTax: tax,
      cartTotal: total
    })
  }

  render() {
    return (
      <ProductContext.Provider value={{
        ...this.state,
        handleDetail: this.handleDetail,
        addToCart: this.addToCart,
        openModal: this.openModal,
        closeModal: this.closeModla,
        increment: this.increment,
        decrement: this.decrement,
        removeItem: this.removeItem,
        clearCart: this.clearCart
      }}>
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export {ProductProvider, ProductConsumer};
