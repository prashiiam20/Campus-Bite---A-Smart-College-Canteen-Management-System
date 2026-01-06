// Mock data for college canteen menu items
export const mockProducts = [
  // Main Courses
  {
    product_id: 1,
    name: "Chicken Biryani",
    description: "Aromatic basmati rice cooked with tender chicken pieces and traditional spices. Served with raita and pickle.",
    price: 8.99,
    discounted_price: 7.99,
    stock_quantity: 25,
    image_url: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Main Course"
  },
  {
    product_id: 2,
    name: "Vegetable Fried Rice",
    description: "Wok-tossed rice with fresh vegetables, soy sauce, and aromatic spices. A healthy and filling option.",
    price: 6.99,
    discounted_price: 5.99,
    stock_quantity: 30,
    image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Main Course"
  },
  {
    product_id: 3,
    name: "Grilled Chicken Sandwich",
    description: "Juicy grilled chicken breast with lettuce, tomato, and mayo on toasted bread. Served with fries.",
    price: 7.49,
    discounted_price: 6.49,
    stock_quantity: 20,
    image_url: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Sandwiches"
  },
  
  // Rice & Curry
  {
    product_id: 4,
    name: "Dal Rice Combo",
    description: "Steamed basmati rice served with yellow dal, pickle, and papad. A comfort food classic.",
    price: 5.99,
    discounted_price: 4.99,
    stock_quantity: 35,
    image_url: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Rice & Curry"
  },
  {
    product_id: 5,
    name: "Rajma Rice",
    description: "Kidney beans curry served with steamed rice. Rich in protein and absolutely delicious.",
    price: 6.99,
    discounted_price: 5.99,
    stock_quantity: 28,
    image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Rice & Curry"
  },
  {
    product_id: 6,
    name: "Chole Rice",
    description: "Spicy chickpea curry with aromatic spices served with basmati rice and onion salad.",
    price: 6.49,
    discounted_price: null,
    stock_quantity: 32,
    image_url: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Rice & Curry"
  },
  
  // Snacks & Fast Food
  {
    product_id: 7,
    name: "Samosa (2 pieces)",
    description: "Crispy fried pastries filled with spiced potatoes and peas. Served with mint and tamarind chutney.",
    price: 3.99,
    discounted_price: 2.99,
    stock_quantity: 50,
    image_url: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "2 pieces",
    color: null,
    category: "Snacks"
  },
  {
    product_id: 8,
    name: "Veg Burger",
    description: "Crispy vegetable patty with lettuce, tomato, onion, and special sauce. Served with fries.",
    price: 5.99,
    discounted_price: null,
    stock_quantity: 25,
    image_url: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Snacks"
  },
  {
    product_id: 9,
    name: "French Fries",
    description: "Golden crispy potato fries seasoned with salt and herbs. Perfect side dish or snack.",
    price: 3.49,
    discounted_price: 2.99,
    stock_quantity: 40,
    image_url: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Snacks"
  },
  
  // Beverages
  {
    product_id: 10,
    name: "Fresh Lime Soda",
    description: "Refreshing lime juice with soda water, mint, and a pinch of salt. Perfect thirst quencher.",
    price: 2.99,
    discounted_price: 2.49,
    stock_quantity: 60,
    image_url: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "300ml",
    color: null,
    category: "Beverages"
  },
  {
    product_id: 11,
    name: "Masala Chai",
    description: "Traditional Indian tea brewed with aromatic spices and milk. A perfect energy booster.",
    price: 1.99,
    discounted_price: null,
    stock_quantity: 80,
    image_url: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "200ml",
    color: null,
    category: "Beverages"
  },
  {
    product_id: 12,
    name: "Cold Coffee",
    description: "Chilled coffee with milk and sugar, topped with whipped cream. Perfect for hot days.",
    price: 3.99,
    discounted_price: 3.49,
    stock_quantity: 45,
    image_url: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "300ml",
    color: null,
    category: "Beverages"
  },
  
  // Desserts
  {
    product_id: 13,
    name: "Gulab Jamun (2 pieces)",
    description: "Soft milk dumplings soaked in rose-flavored sugar syrup. A classic Indian dessert.",
    price: 3.99,
    discounted_price: 3.49,
    stock_quantity: 30,
    image_url: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "2 pieces",
    color: null,
    category: "Desserts"
  },
  {
    product_id: 14,
    name: "Ice Cream Cup",
    description: "Creamy vanilla ice cream served in a cup. Available in vanilla, chocolate, and strawberry.",
    price: 2.99,
    discounted_price: 2.49,
    stock_quantity: 40,
    image_url: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "100ml",
    color: "Vanilla",
    category: "Desserts"
  },
  {
    product_id: 15,
    name: "Fruit Salad",
    description: "Fresh seasonal fruits cut and mixed with a hint of chaat masala. Healthy and refreshing.",
    price: 4.49,
    discounted_price: null,
    stock_quantity: 25,
    image_url: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Desserts"
  },
  
  // Healthy Options
  {
    product_id: 16,
    name: "Quinoa Salad Bowl",
    description: "Nutritious quinoa mixed with fresh vegetables, olive oil, and lemon dressing. High in protein.",
    price: 7.99,
    discounted_price: 6.99,
    stock_quantity: 20,
    image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Healthy Options"
  },
  {
    product_id: 17,
    name: "Grilled Chicken Salad",
    description: "Fresh lettuce, tomatoes, cucumbers topped with grilled chicken breast and olive oil dressing.",
    price: 8.49,
    discounted_price: 7.49,
    stock_quantity: 18,
    image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Healthy Options"
  },
  {
    product_id: 18,
    name: "Oats Upma",
    description: "Healthy oats cooked with vegetables and spices. A nutritious and filling breakfast option.",
    price: 4.99,
    discounted_price: 4.49,
    stock_quantity: 35,
    image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Healthy Options"
  },
  
  // Bread & Roti
  {
    product_id: 19,
    name: "Butter Naan (2 pieces)",
    description: "Soft and fluffy Indian bread brushed with butter. Perfect with any curry.",
    price: 3.99,
    discounted_price: null,
    stock_quantity: 45,
    image_url: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "2 pieces",
    color: null,
    category: "Bread & Roti"
  },
  {
    product_id: 20,
    name: "Chapati (3 pieces)",
    description: "Whole wheat flatbread, soft and healthy. A staple Indian bread.",
    price: 2.99,
    discounted_price: 2.49,
    stock_quantity: 50,
    image_url: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "3 pieces",
    color: null,
    category: "Bread & Roti"
  },
  
  // Combo Meals
  {
    product_id: 21,
    name: "Student Special Combo",
    description: "Rice + Dal + Vegetable curry + Chapati + Pickle. Complete meal at student-friendly price.",
    price: 9.99,
    discounted_price: 7.99,
    stock_quantity: 30,
    image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Full Meal",
    color: null,
    category: "Combo Meals"
  },
  {
    product_id: 22,
    name: "Non-Veg Combo",
    description: "Chicken curry + Rice + Chapati + Salad + Pickle. A hearty non-vegetarian meal.",
    price: 12.99,
    discounted_price: 10.99,
    stock_quantity: 25,
    image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Full Meal",
    color: null,
    category: "Combo Meals"
  },
  
  // Quick Bites
  {
    product_id: 23,
    name: "Pav Bhaji",
    description: "Spicy mixed vegetable curry served with buttered bread rolls. Mumbai street food favorite.",
    price: 6.99,
    discounted_price: 5.99,
    stock_quantity: 28,
    image_url: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Quick Bites"
  },
  {
    product_id: 24,
    name: "Maggi Noodles",
    description: "Everyone's favorite instant noodles with vegetables and spices. Quick and tasty.",
    price: 4.49,
    discounted_price: 3.99,
    stock_quantity: 40,
    image_url: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "Regular",
    color: null,
    category: "Quick Bites"
  },
  {
    product_id: 25,
    name: "Aloo Paratha",
    description: "Stuffed flatbread with spiced potato filling. Served with yogurt and pickle.",
    price: 5.99,
    discounted_price: 4.99,
    stock_quantity: 22,
    image_url: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    size: "2 pieces",
    color: null,
    category: "Quick Bites"
  }
];

export const mockOrders = [
  {
    order_id: 1,
    user_id: 1,
    total_amount: 24.97,
    status: "delivered",
    payment_method: "Credit Card",
    payment_status: "paid",
    shipping_address: "Pickup from Canteen Counter",
    tracking_number: null,
    expected_delivery_date: "2025-01-15T12:30:00.000Z",
    createdAt: "2025-01-15T10:30:00.000Z",
    OrderItems: [
      {
        item_id: 1,
        order_id: 1,
        product_id: 1,
        quantity: 1,
        price: 7.99,
        Product: mockProducts[0]
      },
      {
        item_id: 2,
        order_id: 1,
        product_id: 21,
        quantity: 1,
        price: 7.99,
        Product: mockProducts[20]
      },
      {
        item_id: 3,
        order_id: 1,
        product_id: 10,
        quantity: 2,
        price: 2.49,
        Product: mockProducts[9]
      }
    ]
  },
  {
    order_id: 2,
    user_id: 1,
    total_amount: 19.97,
    status: "ready",
    payment_method: "PayPal",
    payment_status: "paid",
    shipping_address: "Pickup from Canteen Counter",
    tracking_number: null,
    expected_delivery_date: "2025-01-16T12:30:00.000Z",
    createdAt: "2025-01-16T10:45:00.000Z",
    OrderItems: [
      {
        item_id: 4,
        order_id: 2,
        product_id: 22,
        quantity: 1,
        price: 10.99,
        Product: mockProducts[21]
      },
      {
        item_id: 5,
        order_id: 2,
        product_id: 7,
        quantity: 2,
        price: 2.99,
        Product: mockProducts[6]
      },
      {
        item_id: 6,
        order_id: 2,
        product_id: 11,
        quantity: 2,
        price: 1.99,
        Product: mockProducts[10]
      }
    ]
  },
  {
    order_id: 3,
    user_id: 2,
    total_amount: 16.96,
    status: "preparing",
    payment_method: "Credit Card",
    payment_status: "paid",
    shipping_address: "Pickup from Canteen Counter",
    tracking_number: null,
    expected_delivery_date: "2025-01-16T12:30:00.000Z",
    createdAt: "2025-01-16T11:15:00.000Z",
    OrderItems: [
      {
        item_id: 7,
        order_id: 3,
        product_id: 16,
        quantity: 1,
        price: 6.99,
        Product: mockProducts[15]
      },
      {
        item_id: 8,
        order_id: 3,
        product_id: 8,
        quantity: 1,
        price: 5.99,
        Product: mockProducts[7]
      },
      {
        item_id: 9,
        order_id: 3,
        product_id: 12,
        quantity: 1,
        price: 3.49,
        Product: mockProducts[11]
      }
    ]
  }
];

export const mockCart = {
  cart_id: 1,
  user_id: 1,
  CartItems: [
    {
      cart_item_id: 1,
      cart_id: 1,
      product_id: 1,
      quantity: 1,
      price: 7.99,
      Product: mockProducts[0]
    },
    {
      cart_item_id: 2,
      cart_id: 1,
      product_id: 21,
      quantity: 1,
      price: 7.99,
      Product: mockProducts[20]
    },
    {
      cart_item_id: 3,
      cart_id: 1,
      product_id: 10,
      quantity: 2,
      price: 2.49,
      Product: mockProducts[9]
    }
  ]
};