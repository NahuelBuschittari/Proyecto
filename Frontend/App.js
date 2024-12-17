// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// import Login from './src/screens/user/Login';
// import PasswordReset from './src/screens/user/passwordreset/PasswordReset';
// import PasswordSet from './src/screens/user/passwordreset/PasswordSet';
// import SignUp from './src/screens/user/signup/SignUp';

// import ParkingMenu from './src/screens/parking/ParkingMenu';
// import DataAnalysis from './src/screens/parking/DataAnalysis';
// import UpdateSpace from './src/screens/parking/UpdateSpace';
// import UpdatePrices from './src/screens/parking/UpdatePrices';
// import UpdateCharacteristics from './src/screens/parking/UpdateCharacteristics';
// import Payment from './src/screens/parking/Payment'
// import ParkingProfile from './src/screens/parking/ParkingProfile';

// import NewDrive from './src/screens/driver/NewDrive'
// import UserMenu from './src/screens/driver/UserMenu';
// import SearchParking from './src/screens/driver/SearchParking';
// import ParkingFinder from './src/screens/driver/ParkingFinder';
// import MapScreen from './src/screens/driver/MapScreen';
// import Navigation from './src/screens/driver/Navigation';
// import SpecificParkingDetails from './src/screens/driver/SpecificParkingDetails';
// import DriverProfile from './src/screens/driver/DriverProfile';
// import Review from './src/screens/driver/Review';

// import { useAuth } from './src/context/AuthContext'; // Contexto de autenticación
// const Stack = createStackNavigator();

// const App = () => {
//   //const { isAuthenticated, userRole } = useAuth() || {}; // Manejo de posibles valores indefinidos
//  const isAuthenticated= true //valores provisorios para llegar al user
//  userRole= 'driver'
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {!isAuthenticated ? (
//           <>
//             <Stack.Screen name="Login" component={Login} />
//             <Stack.Screen name="SignUp" component={SignUp} />
//             <Stack.Screen name="PasswordReset" component={PasswordReset} />
//             <Stack.Screen name="PasswordSet" component={PasswordSet} />
//           </>
//         ) : (
//           <>
//             {userRole === 'parking' ? (
//               <>
//                 <Stack.Screen name="ParkingMenu" component={ParkingMenu} />
//                 <Stack.Screen name="DataAnalysis" component={DataAnalysis} />
//                 <Stack.Screen name="UpdateSpace" component={UpdateSpace} />
//                 <Stack.Screen name="UpdatePrices" component={UpdatePrices} />
//                 <Stack.Screen name="UpdateCharacteristics" component={UpdateCharacteristics} />
//                 <Stack.Screen name="Payment" component={Payment} />
//                 <Stack.Screen name="ParkingProfile" component={ParkingProfile} />
//               </>
//             ) : (
//               <>
//                 <Stack.Screen name="UserMenu" component={UserMenu} />
//                 <Stack.Screen name="Review" component={Review} />   
//                 <Stack.Screen name="Navigation" component={Navigation} />
//                 <Stack.Screen name="MapScreen" component={MapScreen} />
//                 <Stack.Screen name="NewDrive" component={NewDrive} />
//                 <Stack.Screen name="SearchParking" component={SearchParking} />
//                 <Stack.Screen name="ParkingFinder" component={ParkingFinder} />      
//                 <Stack.Screen name="SpecificParkingDetails" component={SpecificParkingDetails} />  
//                 <Stack.Screen name="DriverProfile" component={DriverProfile} />
//               </>
//             )}
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from './src/context/AuthContext';

// Importa tus pantallas
import Login from './src/screens/user/Login';
import SignUp from './src/screens/user/signup/SignUp';
import PasswordReset from './src/screens/user/passwordreset/PasswordReset';
import PasswordSet from './src/screens/user/passwordreset/PasswordSet';

import ParkingMenu from './src/screens/parking/ParkingMenu';
import DataAnalysis from './src/screens/parking/DataAnalysis';
import UpdateSpace from './src/screens/parking/UpdateSpace';
import UpdatePrices from './src/screens/parking/UpdatePrices';
import UpdateCharacteristics from './src/screens/parking/UpdateCharacteristics';
import Payment from './src/screens/parking/Payment';
import ParkingProfile from './src/screens/parking/ParkingProfile';

import NewDrive from './src/screens/driver/NewDrive';
import UserMenu from './src/screens/driver/UserMenu';
import SearchParking from './src/screens/driver/SearchParking';
import ParkingFinder from './src/screens/driver/ParkingFinder';
import MapScreen from './src/screens/driver/MapScreen';
import Navigation from './src/screens/driver/Navigation';
import SpecificParkingDetails from './src/screens/driver/SpecificParkingDetails';
import DriverProfile from './src/screens/driver/DriverProfile';
import Review from './src/screens/driver/Review';

const Stack = createStackNavigator();

const App = () => {
  const isAuthenticated = true; // Valor provisional
  const userRole = 'driver'; // Valor provisional

  const renderHeaderLogo = (navigation, homeRoute) => (
    <TouchableOpacity onPress={() => navigation.navigate(homeRoute)}>
      <Text>Home</Text>
    </TouchableOpacity>
  );

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
                <Stack.Screen name="ParkingMenu" component={ParkingMenu}/>

                <Stack.Screen name="DataAnalysis" component={DataAnalysis}
                  options={({ navigation }) => ({
                    headerTitle: () => renderCenteredLogo(navigation, 'ParkingMenu'),
                    headerTitleAlign: 'center',
                  })}
                />
                <Stack.Screen name="UpdateSpace" component={UpdateSpace} 
                  options={({ navigation }) => ({
                    headerTitle: () => renderCenteredLogo(navigation, 'ParkingMenu'),
                    headerTitleAlign: 'center',
                  })}
                />
                <Stack.Screen name="UpdatePrices" component={UpdatePrices} 
                  options={({ navigation }) => ({
                    headerTitle: () => renderCenteredLogo(navigation, 'ParkingMenu'),
                    headerTitleAlign: 'center',
                  })}
                />
                <Stack.Screen name="UpdateCharacteristics" component={UpdateCharacteristics} 
                  options={({ navigation }) => ({
                    headerTitle: () => renderCenteredLogo(navigation, 'ParkingMenu'),
                    headerTitleAlign: 'center',
                  })}
                />
                <Stack.Screen name="Payment" component={Payment} 
                  options={({ navigation }) => ({
                    headerTitle: () => renderCenteredLogo(navigation, 'ParkingMenu'),
                    headerTitleAlign: 'center',
                  })}
                />
                <Stack.Screen name="ParkingProfile" component={ParkingProfile} 
                  options={({ navigation }) => ({
                    headerTitle: () => renderCenteredLogo(navigation, 'ParkingMenu'),
                    headerTitleAlign: 'center',
                  })}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="UserMenu" component={UserMenu}/>
                <Stack.Screen name="Review" component={Review}
                    options={({ navigation }) => ({
                      headerTitle: () => renderHeaderLogo(navigation, 'UserMenu'),
                      headerTitleAlign: 'center',
                    })}
                />
                <Stack.Screen name="Navigation" component={Navigation} 
                    options={({ navigation }) => ({
                      headerTitle: () => renderHeaderLogo(navigation, 'UserMenu'),
                      headerTitleAlign: 'center',
                      })}
                />
                <Stack.Screen name="MapScreen" component={MapScreen} 
                    options={({ navigation }) => ({
                      headerTitle: () => renderHeaderLogo(navigation, 'UserMenu'),
                      headerTitleAlign: 'center',
                      })}
                  />
                <Stack.Screen name="NewDrive" component={NewDrive} 
                    options={({ navigation }) => ({
                      headerTitle: () => renderHeaderLogo(navigation, 'UserMenu'),
                      headerTitleAlign: 'center',
                      })}
                  />
                <Stack.Screen name="SearchParking" component={SearchParking} 
                    options={({ navigation }) => ({
                      headerTitle: () => renderHeaderLogo(navigation, 'UserMenu'),
                      headerTitleAlign: 'center',
                      })}
                  />
                <Stack.Screen name="ParkingFinder" component={ParkingFinder} 
                    options={({ navigation }) => ({
                      headerTitle: () => renderHeaderLogo(navigation, 'UserMenu'),
                      headerTitleAlign: 'center',
                      })}
                  />
                <Stack.Screen name="SpecificParkingDetails" component={SpecificParkingDetails}
                    options={({ navigation }) => ({
                      headerTitle: () => renderHeaderLogo(navigation, 'UserMenu'),
                      headerTitleAlign: 'center',
                    })}
                  />
                <Stack.Screen name="DriverProfile" component={DriverProfile} 
                    options={({ navigation }) => ({
                      headerTitle: () => renderHeaderLogo(navigation, 'UserMenu'),
                      headerTitleAlign: 'center',
                    })}
                  />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
