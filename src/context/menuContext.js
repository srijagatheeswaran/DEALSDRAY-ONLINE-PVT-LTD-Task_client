// MenuContext.js
import React, { createContext, useState } from 'react';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [isNavVisible, setIsNavVisible] = useState(false);

    const toggleNav = () => setIsNavVisible(prev => !prev);

    return (
        <MenuContext.Provider value={{ isNavVisible, toggleNav }}>
            {children}
        </MenuContext.Provider>
    );
};
