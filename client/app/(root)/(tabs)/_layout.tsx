import { Stack, Tabs } from "expo-router";
import { View, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

type TabIconProps = {
  focused: boolean;
  icon: string;
};

const TabIcon = ({ focused, icon }: TabIconProps) => {
  return (
    <View>
      <Icon name={icon} size={30} color={focused ? "black" : "lightgray"} />
    </View>
  );
};
const CustomHeader = () => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", paddingLeft: 20 }}
    >
      <Image
        source={require("../../../assets/r-logo.png")} // Update this path to your logo
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
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
          paddingBottom: 20,
          overflow: "hidden",

          height: 70,

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopWidth: 0, // remove top border
          elevation: 0, // remove Android shadow
          shadowOpacity: 0, // remove iOS shadow
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="home" />
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
