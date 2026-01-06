import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load cart from localStorage if not logged in
    if (!currentUser) {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
      calculateCartTotals(savedCart.items);
      setLoading(false);
      return;
    }

    // Fetch cart from API if logged in
    fetchCart();
  }, [currentUser]);

  const fetchCart = async (token) => {
    setLoading(true);
    try {
      // Try to get cart from API
      const response = await api.get('/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      // Transform server response to match our cart structure
      const cartItems = response.data.CartItems?.map(item => ({
        id: item.cart_item_id,
        productId: item.product_id,
        name: item.Product?.name || '',
        price: parseFloat(item.discounted_price),
        quantity: item.quantity,
        image: item.Product?.image_url || ''
      })) || [];
      
      calculateCartTotals(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      
      // Fallback to local storage if API fails
      const savedCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
      calculateCartTotals(savedCart.items);
    } finally {
      setLoading(false);
    }
  };

  const calculateCartTotals = (items) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setCart({
      items,
      totalItems,
      totalPrice
    });
  };

  const addToCart = async (product, quantity = 1) => {
    const updatedItems = [...cart.items];
    const existingItemIndex = updatedItems.findIndex(item => item.productId === product.product_id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      updatedItems.push({
        id: Date.now(), // Temporary ID for local cart
        productId: product.product_id,
        name: product.name,
        price: parseFloat(product.discounted_price),
        quantity,
        image: product.image_url
      });
    }
    
    // Update cart in local state and localStorage
    calculateCartTotals(updatedItems);
    localStorage.setItem('cart', JSON.stringify({ items: updatedItems }));
    
    // If user is logged in, update cart in API
    if (currentUser) {
      try {
        await api.post('/cart/add', {
          product_id: product.product_id,
          quantity
        });
        updatedItems[existingItemIndex >= 0 ? existingItemIndex : updatedItems.length - 1].id = response.data.cart_item_id;
      } catch (error) {
        console.error('Error updating cart on server:', error);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    
    const updatedItems = cart.items.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    );
    
    // Update cart in local state and localStorage
    calculateCartTotals(updatedItems);
    localStorage.setItem('cart', JSON.stringify({ items: updatedItems }));
    
    // If user is logged in, update cart in API
    if (currentUser) {
      try {
        const item = cart.items.find(item => item.productId === productId);
        if (item) {
          await api.post('/cart/update', {
            cart_item_id: item.id,
            quantity
          });
        }
      } catch (error) {
        console.error('Error updating quantity on server:', error);
      }
    }
  };

  const removeFromCart = async (productId) => {
    const updatedItems = cart.items.filter(item => item.productId !== productId);
    
    // Update cart in local state and localStorage
    calculateCartTotals(updatedItems);
    localStorage.setItem('cart', JSON.stringify({ items: updatedItems }));
    
    // If user is logged in, remove item from API
    if (currentUser) {
      try {
        await api.post('/cart/remove', {
          product_id: productId
        });
      } catch (error) {
        console.error('Error removing item from server cart:', error);
      }
    }
  };

  const clearCart = async () => {
    // Clear cart in local state and localStorage
    calculateCartTotals([]);
    localStorage.setItem('cart', JSON.stringify({ items: [] }));
    
    // If user is logged in, clear cart in API
    if (currentUser) {
      try {
        await api.post('/cart/clear');
      } catch (error) {
        console.error('Error clearing cart on server:', error);
      }
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}