import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loading = () => {
  return (
    <View style={styles.rootContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
    rootContainer:{
        flex:1,
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
    }
})