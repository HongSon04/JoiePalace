import { StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';

const _layout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name='sign_in'
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name='sign_up'
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" 
        barStyle="light-content"
        hidden={false}
        translucent={true}/>
    </>
  )
}

export default _layout

const styles = StyleSheet.create({})