import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Card from "./ui/Card";
import { categoryColors, categoryEmojies } from "../constants";
import { Category, Transaction } from "../types";

interface TransactionListItemProps {
  transaction: Transaction;
  categoryInfo: Category | undefined;
  deleteTransaction: (id: number) => Promise<void>;
}

const TransactionListItem = ({
  transaction,
  categoryInfo,
  deleteTransaction,
}: TransactionListItemProps) => {
  const iconName =
    transaction.type === "Expense" ? "minuscircle" : "pluscircle";
  const color = transaction.type === "Expense" ? "red" : "green";
  const categoryColor = categoryColors[categoryInfo?.name ?? "Default"];
  const emoji = categoryEmojies[categoryInfo?.name ?? "Default"];

  return (
    <Swipeable
      renderRightActions={() => (
        <View
          style={{ alignItems: "center", justifyContent: "center", width: 70 }}
        >
          <TouchableWithoutFeedback
            onPress={() => deleteTransaction(transaction.id)}
          >
            <MaterialCommunityIcons name="trash-can" size={40} color="red" />
          </TouchableWithoutFeedback>
        </View>
      )}
      containerStyle={{ borderRadius: 15 }}
    >
      <Card>
        <View style={styles.row}>
          <View style={{ width: "40%", gap: 3 }}>
            <Amount
              amount={transaction.amount}
              color={color}
              iconName={iconName}
            />
            <CategoryItem
              categoryColor={categoryColor}
              categoryInfo={categoryInfo}
              emoji={emoji}
            />
          </View>
          <TransactionInfo
            date={transaction.date}
            description={transaction.description}
            id={transaction.id}
          />
        </View>
      </Card>
    </Swipeable>
  );
};

const TransactionInfo = ({
  id,
  date,
  description,
}: {
  id: number;
  date: number;
  description: string;
}) => (
  <View style={{ flexGrow: 1, gap: 6, flexShrink: 1 }}>
    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{description}</Text>
    <Text>Transaction number {id}</Text>
    <Text style={{ fontSize: 12, color: "gray" }}>
      {new Date(date * 1000).toDateString()}
    </Text>
  </View>
);

const CategoryItem = ({
  categoryColor,
  categoryInfo,
  emoji,
}: {
  categoryColor: string;
  categoryInfo: Category | undefined;
  emoji: string;
}) => (
  <View
    style={[
      styles.categoryContainer,
      { backgroundColor: categoryColor + "40" },
    ]}
  >
    <Text style={styles.categoryText}>
      {emoji} {categoryInfo?.name}
    </Text>
  </View>
);

const Amount = ({
  iconName,
  color,
  amount,
}: {
  iconName: "minuscircle" | "pluscircle";
  color: string;
  amount: number;
}) => (
  <View style={styles.row}>
    <AntDesign name={iconName} size={18} color={color} />
    <AutoSizeText
      fontSize={32}
      mode={ResizeTextMode.max_lines}
      numberOfLines={1}
      style={[styles.amount, { maxWidth: "80%" }]}
    >
      ${amount}
    </AutoSizeText>
  </View>
);

const styles = StyleSheet.create({
  amount: {
    fontSize: 32,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 12,
  },
});

export default TransactionListItem;
