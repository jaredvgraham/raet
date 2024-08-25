import { Stack, Tabs } from "expo-router";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const TabIcon = () => {
  return (
    <View>
      <Icon name="home" size={30} color="black" />
    </View>
  );
};

const Layout = () => {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: () => <TabIcon />,
        }}
      />
    </Tabs>
  );
};

export default Layout;
