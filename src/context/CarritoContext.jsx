import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CarritoProvider = ({ children }) => {
   const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const removeTicket = (ticketId) => {
    setCart((prev) => prev.filter((t) => t.ID_RIFA !== ticketId));
  };


  const toggleTicket = (ticket) => {
    setCart((prev) => {
      const exists = prev.find((t) => t.ID_RIFA === ticket.ID_RIFA);
      if (exists) {
        return prev.filter((t) => t.ID_RIFA !== ticket.ID_RIFA);
      } else {
        setIsCartOpen(true);
        return [...prev, ticket];
      }
    });
  };

  return (
    <CartContext.Provider value={{ cart, toggleTicket, isCartOpen, setIsCartOpen, removeTicket }}>
      {children}
    </CartContext.Provider>
  );
};
