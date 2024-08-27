import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import SignIn from './src/screens/SignIn';
import ParkingMenu from './src/screens/ParkingMenu';
import UpdateSpace from './src/screens/UpdateSpace';
import UserMenu from './src/screens/UserMenu';
import UpdateCharacteristics from './src/screens/UpdateCharacteristics';
import { useAuth } from './src/context/AuthContext'; // Contexto de autenticación
import SearchParking from './src/screens/SearchParking';
import ParkingDetails from './src/screens/ParkingDetails';
const Stack = createStackNavigator();

const App = () => {
  //const { isAuthenticated, userRole } = useAuth() || {}; // Manejo de posibles valores indefinidos
 const isAuthenticated= true //valores provisorios para llegar al user
 userRole= 'user'
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignIn" component={SignIn} />
          </>
        ) : (
          <>
            {userRole === 'parking' ? (
              <>
                <Stack.Screen name="ParkingMenu" component={ParkingMenu} />
                <Stack.Screen name="UpdateSpace" component={UpdateSpace} />
                <Stack.Screen name="UpdateCharacteristics" component={UpdateCharacteristics} />
              </>
            ) : (
              <>
                <Stack.Screen name="UserMenu" component={UserMenu} />
                <Stack.Screen name="SearchParking" component={SearchParking} />
                <Stack.Screen name="ParkingDetails" component={ParkingDetails} />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
