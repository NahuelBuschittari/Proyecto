import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './src/screens/user/Login';
import PasswordReset from './src/screens/user/passwordreset/PasswordReset';
import PasswordSet from './src/screens/user/passwordreset/PasswordSet';
import SignUp from './src/screens/user/signup/SignUp';

import ParkingMenu from './src/screens/parking/ParkingMenu';
import DataAnalysis from './src/screens/parking/DataAnalysis';
import UpdateSpace from './src/screens/parking/UpdateSpace';
import UpdatePrices from './src/screens/parking/UpdatePrices';
import UpdateCharacteristics from './src/screens/parking/UpdateCharacteristics';
import Payment from './src/screens/parking/Payment'
import ParkingProfile from './src/screens/parking/ParkingProfile';

import NewDrive from './src/screens/driver/NewDrive'
import UserMenu from './src/screens/driver/UserMenu';
import SearchParking from './src/screens/driver/SearchParking';
import ParkingDetails from './src/screens/driver/ParkingDetails';
import { useAuth } from './src/context/AuthContext'; // Contexto de autenticación
const Stack = createStackNavigator();

const App = () => {
  //const { isAuthenticated, userRole } = useAuth() || {}; // Manejo de posibles valores indefinidos
 const isAuthenticated= false //valores provisorios para llegar al user
 userRole= 'driver'
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="PasswordReset" component={PasswordReset} />
            <Stack.Screen name="PasswordSet" component={PasswordSet} />
          </>
        ) : (
          <>
            {userRole === 'parking' ? (
              <>
                <Stack.Screen name="ParkingMenu" component={ParkingMenu} />
                <Stack.Screen name="DataAnalysis" component={DataAnalysis} />
                <Stack.Screen name="UpdateSpace" component={UpdateSpace} />
                <Stack.Screen name="UpdatePrices" component={UpdatePrices} />
                <Stack.Screen name="UpdateCharacteristics" component={UpdateCharacteristics} />
                <Stack.Screen name="Payment" component={Payment} />
                <Stack.Screen name="ParkingProfile" component={ParkingProfile} />
              </>
            ) : (
              <>
                <Stack.Screen name="NewDrive" component={NewDrive} />
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
