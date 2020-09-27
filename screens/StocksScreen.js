import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";

function StocksList(props) {
  return (
    <FlatList
      style={styles.listView}
      data={props.stocks}
      renderItem={(stock) => (
        <SymbolList
          style={styles.ListView}
          stock={stock}
          clickHandler={props.clickHandler}
          selectedStock={props.selectedStock}
        />
      )}
      keyExtractor={(stock) => stock.symbol}
    />
  );
}
function SymbolList(props) {
  function handleOnPress(symbol, clickHandler) {
    clickHandler(symbol);
  }

  var stock = props.stock.item;
  var open = stock.open;
  var close = stock.close;
  var diff = close - open;
  var selectedStock = props.selectedStock;
  var change = ((close - open) / open).toFixed(2) + "%";
  var selected = false;

  if ("symbol" in selectedStock) {
    var symbol = selectedStock.symbol;
    if (stock.symbol === symbol) {
      selected = true;
    }
  }
  //To display the watchlist
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        handleOnPress(stock.symbol, props.clickHandler);
      }}
    >
      <View style={selected ? styles.symbolSelected : styles.symbollist}>
        <Text style={styles.symbol}>{stock.symbol}</Text>
        <View style={styles.closingContainer}>
          <Text style={styles.closing}>{stock.close}</Text>
          <View style={diff >= 0 ? styles.changeToGreen : styles.changeToRed}>
            <Text style={styles.change}>{change}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
// To displays stockdetails
function StockDetails(props) {
  var stock = props.stock;

  return (
    <View style={styles.detailsView}>
      <Text style={styles.companyName}>{stock.name}</Text>
      <View style={styles.detailsRow}>
        <View style={styles.innerRow}>
          <Text style={styles.title}>Open</Text>
          <Text style={styles.value}>{stock.open}</Text>
        </View>
        <View style={styles.innerRow}>
          <Text style={styles.title}>Low</Text>
          <Text style={styles.value}>{stock.low}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.innerRow}>
          <Text style={styles.title}>Close</Text>
          <Text style={styles.value}>{stock.close}</Text>
        </View>
        <View style={styles.innerRow}>
          <Text style={styles.title}>High</Text>
          <Text style={styles.value}>{stock.high}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.innerRow}>
          <Text style={styles.title}>volume</Text>
          <Text style={styles.value}>{stock.volumes}</Text>
        </View>
        <View style={styles.innerRow}></View>
      </View>
    </View>
  );
}

export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState({ stocks: [], selectedStock: {} });
  // fetch stock data from the server for any new symbols added to the watchlist
  useEffect(() => {
    let symbols = watchList.symbols;
    let stocks = state.stocks;

    for (let i = 0; i < symbols.length; i++) {
      let URL = ServerURL + "/history?symbol=" + symbols[i];

      fetch(URL)
        .then((response) => response.json())
        .then((json) => {
          let stocks = state.stocks;
          let selectedStock = state.selectedStock;
          let exist = false;

          for (let j = 0; j < stocks.length; j++) {
            if (json[0].symbol === stocks[j].symbol) {
              exist = true;
            }
          }

          if (!exist) {
            stocks.push(json[0]);
          }

          setState({ stocks: stocks, selectedStock: selectedStock });
        })

        .catch((e) => {});
    }
  }, [watchList]);

  function listClickHandler(symbol) {
    var stocks = state.stocks;

    for (let i = 0; i < stocks.length; i++) {
      if (stocks[i].symbol === symbol) {
        const selectedStock = stocks[i];
        setState({ stocks: stocks, selectedStock: selectedStock });
        break;
      }
    }
  }

  return (
    <View style={styles.container}>
      <StocksList
        stocks={state.stocks}
        clickHandler={listClickHandler}
        selectedStock={state.selectedStock}
      />
      <StockDetails stock={state.selectedStock} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
  },

  title: {
    padding: 5,
    color: "#808080",
  },

  detailsView: {
    flex: 0.65,
    backgroundColor: "#2b2b2b",
  },

  companyName: {
    paddingTop: 7,
    paddingBottom: 7,
    textAlign: "center",
    fontSize: scaleSize(17),
    color: "#fff",
  },

  detailsRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#808080",
  },

  innerRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  value: {
    padding: 5,
    color: "#fff",
    textAlign: "center",
  },

  symbol: {
    flex: 1,
    padding: 10,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: scaleSize(18),
    color: "#fff",
  },

  symbolSelected: {
    borderBottomColor: "#808080",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#454545",
  },

  symbollist: {
    borderBottomColor: "#808080",
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
  },

  closing: {
    padding: 10,
    marginRight: 15,
    fontSize: scaleSize(16),
    color: "#fff",
  },

  closingContainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  change: {
    padding: 5,
    color: "#fff",
  },
  changeToGreen: {
    marginBottom: 6,
    marginRight: 12,
    borderRadius: 6,
    borderColor: "#48a84c",
    borderWidth: 1,
    alignSelf: "flex-end",
    backgroundColor: "#48a84c",
  },

  changeToRed: {
    marginBottom: 6,
    marginRight: 12,
    borderRadius: 6,
    borderColor: "#eb4536",
    borderWidth: 1,
    alignSelf: "flex-end",
    backgroundColor: "#eb4536",
  },
});
