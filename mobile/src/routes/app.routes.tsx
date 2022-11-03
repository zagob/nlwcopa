import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { New } from "../screens/New";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  return (
    <Navigator>
      <Screen name="new" component={New} />
    </Navigator>
  );
}
