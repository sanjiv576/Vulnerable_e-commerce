import { createContext, useContext, useState } from "react";

const PurchaseContext = createContext(null);

export const PurchaseProvider = ({ children }) => {
    const [purchase, setPurchase] = useState([]);

    return (
        <PurchaseContext.Provider value={{ purchase, setPurchase }}>
            {children}
        </PurchaseContext.Provider>
    );
};

export const usePurchase = () => {
    return useContext(PurchaseContext);
};