import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'

const Stack = createNativeStackNavigator()

// screen
import Catatan from "./components/catatan"
import Api from "./components/api"
import Login from "./components/Login"
import Register from "./components/Register"

import { UserContext } from './utils/context';

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [saving, setSaving] = useState(true)


  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    // storeUserSession()
    console.log('user====', user)
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing && saving) return null;

  // if (!user) {
  //   return (
  //     <View>
  //       <Text>Login</Text>
  //     </View>
  //   );
  // }

  // return (
  //   <View>
  //     <Text>Welcome {user.email}</Text>
  //   </View>
  // );

  return (
    <UserContext.Provider value={[user, setUser]}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={!user ? "ScreenLogin" : "ScreenCatatan"}>
          <Stack.Screen
            name="ScreenCatatan"
            component={Catatan}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="ScreenLogin"
            component={Login}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="ScreenRegister"
            component={Register}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="ScreenApi"
            component={Api}
            options={{
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  )
}

export default App