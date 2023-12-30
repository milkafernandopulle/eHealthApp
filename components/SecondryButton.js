import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React from 'react'

const SecondryButton = ({buttonText,onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

export default SecondryButton

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#0165fc',
        padding: 10,
        borderRadius: 5,
        minWidth: '40%',
        alignItems: 'center',
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
})