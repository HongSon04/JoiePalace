import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const sign_in = () => {
  return (
    <SafeAreaView style={{height: '100%',}}>
      <ScrollView style={styles.container}>
        <View className="text-center">
          <ThemedText className="text-red-500">hehe</ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default sign_in

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: "85%",
    paddingHorizontal: 16,
  }
})