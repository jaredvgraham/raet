import { Stack, Tabs } from "expo-router";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

type TabIconProps = {
  focused: boolean;
  icon: string;
};

const TabIcon = ({ focused, icon }: TabIconProps) => {
  return (
    <View>
      <Icon name={icon} size={30} color={focused ? "black" : "gray"} />
    </View>
  );
};

const Layout = () => {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",

          borderRadius: 50,
          paddingBottom: 0,
          overflow: "hidden",
          marginHorizontal: 20,
          marginBottom: 10,
          height: 68,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="globe" />
          ),
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: "Likes",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="heart" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="comment" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="user" />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
