import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Icon } from "react-native";
import {
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import { Ionicons } from "@expo/vector-icons";
import StocksScreen from "../screens/StocksScreen";

function SymbolList(props) {
  function handleOnPress(symbol) {
    props.addtoWatchList(symbol);
    props.navigation.navigate("Stocks");
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        handleOnPress(props.stock.item.symbol);
      }}
    >
      <View style={styles.symbollist}>
        <Text style={styles.symbol}>{props.stock.item.symbol}</Text>
        <Text style={styles.name}>{props.stock.item.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
//lists the stocks
function StocksList(props) {
  return (
    <FlatList
      data={props.stocks}
      renderItem={(stock) => (
        <SymbolList
          style={styles.symbollist}
          stock={stock}
          navigation={props.navigation}
          addtoWatchList={props.addtoWatchList}
        />
      )}
      keyExtractor={(stock) => stock.symbol}
    />
  );
}
// fetch symbol names from the server
export default function SearchScreen({ navigation }) {
  const { ServerURL, addtoWatchList } = useStocksContext();
  const [state, setState] = useState({ stocks: [], filteredStocks: [] });

  function onSearchType(searchString) {
    const stocks = state.stocks;

    if (searchString.length === 0) {
      setState({ stocks: stocks, filteredStocks: stocks });
    } else {
      let fs = [];

      for (let i = 0; i < stocks.length; i++) {
        let symbol = stocks[i].symbol.toLowerCase();
        let name = stocks[i].name.toLowerCase();
        let ss = searchString.toLowerCase();

        if (name.includes(ss) || symbol.includes(ss)) {
          fs.push(stocks[i]);
        }
      }

      setState({ stocks: stocks, filteredStocks: fs });
    }
  }

  useEffect(() => {
    fetch(ServerURL + "/all")
      .then((response) => response.json())
      .then((json) => {
        const stocks = json;
        const filteredStocks = [...stocks];

        setState({ stocks: stocks, filteredStocks: [] });
      })
      .catch((e) => {});
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.searchText}>
          Type a company name or stock symbol
        </Text>

        <View style={styles.searchBox}>
          <Ionicons style={styles.searchIcon} name="md-search" size={20} />

          <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor="#f5f5f5"
            clearButtonMode="while-editing"
            onChangeText={(searchString) => {
              onSearchType(searchString);
            }}
          />
        </View>

        <StocksList
          stocks={state.filteredStocks}
          navigation={navigation}
          addtoWatchList={addtoWatchList}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  symbollist: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 7,
  },

  searchText: {
    color: "white",
    textAlign: "center",
    marginTop: 3,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: scaleSize(14),
  },

  symbol: {
    color: "#fff",
    paddingTop: 2,
    paddingLeft: 5,
    fontSize: scaleSize(16),
  },

  name: {
    color: "#fff",
    paddingLeft: 4,
    fontSize: scaleSize(12),
  },

  searchBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#333333",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333333",
  },

  searchIcon: {
    padding: 8,
    marginLeft: 6,
    backgroundColor: "#333333",
    color: "#fff",
  },

  closeIcon: {
    padding: 8,
    marginLeft: 6,
    color: "#fffafa",
    backgroundColor: "#333333",
  },

  input: {
    flex: 1,
    color: "#fff",
    paddingTop: 10,
    paddingBottom: 4,
    paddingLeft: 4,
    backgroundColor: "#333333",
    fontSize: scaleSize(14),
  },
});
