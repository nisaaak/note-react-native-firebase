import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';

import { UserContext } from '../../utils/context';

function Api() {
  const [user, setUser] = useContext(UserContext)

  useEffect(() => {
    console.log('user----', user)
  }, [])
  return (
    <View>
      <Text>page api</Text>
      <Text>{user?.displayName}</Text>
    </View>
  )
}

export default Api
