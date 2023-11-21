import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dialog from "react-native-dialog";

const Page = () => {
  const groups = useQuery(api.groups.get) || [];
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [greeting, setGreeting] = useState("");
  const performGreetingAction = useAction(api.greeting.getGreeting);

  useEffect(() => {
    const loadUser = async () => {
      // await AsyncStorage.clear();
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        setTimeout(() => {
          setVisible(true);
        }, 100);
      } else {
        setName(user);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!name) return;
    const loadGreeting = async () => {
      const greeting = await performGreetingAction({ name });
      setGreeting(greeting);
    };
    loadGreeting();
  }, [name]);

  const setUser = async () => {
    let r = (Math.random() + 1).toString(36).substring(7);
    const username = `${name}#${r}`;
    await AsyncStorage.setItem("user", username);
    setName(username);
    setVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {groups.map((group) => (
          <Link
            href={{
              pathname: "/(chat)/[chatid]",
              params: { chatid: group._id.toString() }
            }}
            key={group._id}
            asChild
          >
            <TouchableOpacity style={styles.group}>
              <Image
                source={{ uri: group.icon_url }}
                style={{ width: 50, height: 50 }}
              />
              <View style={{ flex: 1 }}>
                <Text>{group.name}</Text>
                <Text style={{ color: "#888" }}>{group.description}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
        <Text style={{ textAlign: "center" }}>{greeting}</Text>
      </ScrollView>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Username required</Dialog.Title>
        <Dialog.Description>
          Please insert a name to start chatting.
        </Dialog.Description>
        <Dialog.Input onChangeText={setName} />
        <Dialog.Button label="Set name" onPress={setUser} />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F8F5EA"
  },
  group: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22
  }
});

export default Page;
