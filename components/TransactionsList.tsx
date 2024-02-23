import React from "react";
import { View } from "react-native";
import { Category, Transaction } from "../types";
import TransactionListItem from "./TransactionListItem";

const TransactionsList = ({
  transactions,
  categories,
  deleteTransaction,
}: {
  categories: Category[];
  transactions: Transaction[];
  deleteTransaction: (id: number) => Promise<void>;
}) => {
  return (
    <View style={{ gap: 15 }}>
      {transactions.map((transaction) => {
        const transactionCategory = categories.find(
          (category) => category.id === transaction.category_id,
        );

        return (
          <TransactionListItem
            key={transaction.id}
            deleteTransaction={deleteTransaction}
            transaction={transaction}
            categoryInfo={transactionCategory}
          />
        );
      })}
    </View>
  );
};

export default TransactionsList;
