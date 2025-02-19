import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import Login from './src/screens/user/Login';
import SignUp from './src/screens/user/signup/SignUp';
import PasswordReset from './src/screens/user/PasswordReset';

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

// Separate the navigation logic into a new component
const NavigationWrapper = () => {
  const { user, loading } = useAuth();
  
  const renderHeaderLogo = (navigation, homeRoute) => (
    <TouchableOpacity onPress={() => navigation.navigate(homeRoute)}>
      <Text>Home</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return null; // Or a loading component
  }
  return (
    <Stack.Navigator>
      {!user ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="PasswordReset" component={PasswordReset} />
          </>
        ) : (
          <>
            {user.isParking === true ? (
              <>
                <Stack.Screen name="ParkingMenu" component={ParkingMenu}
                options={{
                  title: '',
                  headerTitleAlign: 'center',
                }}
                />

                <Stack.Screen name="DataAnalysis" component={DataAnalysis}
                  options={({ navigation }) => ({
                    headerTitle: () => renderHeaderLogo(navigation, 'ParkingMenu'),
                    headerTitleAlign: 'center',
                  })}
                />
                <Stack.Screen name="UpdateSpace" component={UpdateSpace} 
                  options={({ navigation }) => ({
                    headerTitle: () => renderHeaderLogo(navigation, 'ParkingMenu'),
                    headerTitleAlign: 'center',
                  })}
                />
                <Stack.Screen name="UpdatePrices" component={UpdatePrices} 
                  options={({ navigation }) => ({
                    headerTitle: () => renderHeaderLogo(navigation, 'ParkingMenu'),
                    headerTitleAlign: 'center',
                  })}
                />
                <Stack.Screen name="UpdateCharacteristics" component={UpdateCharacteristics} 
                  options={({ navigation }) => ({
                    headerTitle: () => renderHeaderLogo(navigation, 'ParkingMenu'),
                    headerTitleAlign: 'center',
                  })}
                />
                <Stack.Screen name="Payment" component={Payment} 
                  options={({ navigation }) => ({
                    headerTitle: () => renderHeaderLogo(navigation, 'ParkingMenu'),
                    headerTitleAlign: 'center',
                  })}
                />
                <Stack.Screen name="ParkingProfile" component={ParkingProfile} 
                  options={({ navigation }) => ({
                    headerTitle: () => renderHeaderLogo(navigation, 'ParkingMenu'),
                    headerTitleAlign: 'center',
                  })}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="UserMenu" component={UserMenu}
                  options={{
                    title: '',
                    headerTitleAlign: 'center',
                  }}
                />
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
  );
};
const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <NavigationWrapper />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
