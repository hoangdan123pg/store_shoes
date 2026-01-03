import { createContext, useEffect, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [collection, setCollection] = useState([]);
    const [brand, setBrand] = useState([]);
    const [listFilter, setListFilter] = useState({});
    const [listCartOrder, setListCartOrder] = useState([]);
    const [topSale, setTopSale] = useState([]);
const handleClickFilter = (name, value) => {
    setListFilter((prev) => ({
        ...prev,
        [name]: prev[name] ? [...new Set([...prev[name], value])] : [value]
    }));
};

const handleRemoveFilter = (name, value) => {
    setListFilter((prev) => {
        const updatedValues = prev[name]?.filter((item) => item !== value);
        if (updatedValues.length === 0) {
            const { [name]: _, ...rest } = prev; // Xóa key nếu không còn giá trị
            return rest;
        }
        return { ...prev, [name]: updatedValues };
    });
};




    return (
        <Context.Provider value={{ 
            data,
            collection, setCollection,
            brand, setBrand,
            listFilter, 
            handleClickFilter, handleRemoveFilter,
            listCartOrder, setListCartOrder,
            topSale, setTopSale
           
        }}>{children}</Context.Provider>
    );
};
export default ContextProvider;
