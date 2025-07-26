import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StartScreen } from "./screens/start";
import { ActionScreen } from "./screens/action";
import { StatScreen } from "./screens/stat";

const appStack = createNativeStackNavigator({
  initialRouteName: "start",
  screens: {
    start: {
      screen: StartScreen,
      options: {
        headerShown: false,
      },
    },
    action: {
      screen: ActionScreen,
      options: {
        headerShown: false,
      },
    },
    stat: { screen: StatScreen },
  },
});
const Navigation = createStaticNavigation(appStack);

export default function App() {
  return <Navigation />;
}
