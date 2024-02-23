import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SQLiteProvider } from "expo-sqlite/next";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./screens/Home";

const Stack = createNativeStackNavigator();

const loadDatabase = async () => {
  const dbName = "mySQLiteDB.db";
  const dbAsset = require("./assets/mySQLiteDB.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}/SQLite`,
      { intermediates: true },
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function App() {
  const [dbLoaded, setDbLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded)
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size="large" />
        <Text>Loading Database...</Text>
      </View>
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Suspense
          fallback={
            <View style={{ flex: 1 }}>
              <ActivityIndicator size="large" />
              <Text>Loading Database...</Text>
            </View>
          }
        >
          <SQLiteProvider databaseName="mySQLiteDB.db" useSuspense>
            <Stack.Navigator>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  headerTitle: "Budget Buddy",
                  headerLargeTitle: true,
                  headerTitleStyle: {
                    fontSize: 30,
                    fontWeight: "600",
                  },
                }}
              />
            </Stack.Navigator>
          </SQLiteProvider>
        </Suspense>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
