import React, {Component} from 'react';
import Title from '../Title';
import CartColums from './CartColums';
import EmptyCart from './EmptyCart';
import CartList from './CartList';
import CartTotal from "./CartTotal";
import {ProductConsumer} from '../../context';

export default class Cart extends Component {
  render() {
    return (
      <section>
        <ProductConsumer>
          {value => (
            <>
              {value.cart.length > 0 && (
                <>
                  <Title name="your" title="cart"/>
                  <CartColums/>
                  <CartList value={value} />
                  <CartTotal value={value} />
                </>
              )}
              {value.cart.length === 0 && (
                <EmptyCart/>
              )}
            </>
          )}
        </ProductConsumer>
      </section>
    );}
}
