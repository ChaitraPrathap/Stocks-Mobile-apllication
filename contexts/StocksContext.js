import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};
export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);
  // To store data on watchlist
  storeData = async (str) => {
    try {
      await AsyncStorage.setItem("Symbols", str);
    } catch (e) {
      console.log(e);
    }
  };

  function addtoWatchList(newSymbol) {
    let symbols = state.symbols;

    if (!symbols.includes(newSymbol)) {
      symbols.push(newSymbol);
      symbols = symbols.sort();
      setState({ symbols: symbols });
      storeData(JSON.stringify(symbols));
    }
  }

  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("Symbols");
      if (value !== null) {
        setState({ symbols: JSON.parse(value) });
      } else {
        const symbols = [];
        setState({ symbols: symbols });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  return {
    ServerURL: "http://131.181.190.87:3001",
    watchList: state,
    addtoWatchList,
  };
};
