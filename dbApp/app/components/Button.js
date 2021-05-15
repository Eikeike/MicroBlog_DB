import React, {useState} from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import TextInput from '../components/TextInput'
import {theme} from '../core/theme'

function CustomButton({...props}) {
    return (
        <PaperButton
            style={
                styles.button
            }
            labelStyle={styles.text}
            mode="contained"
            {...props}>
                {props.children}
        </PaperButton>
    )
}

const styles = StyleSheet.create({
    button:{
        width: '100%',
        marginVertical: 10,
        paddingVertical: 2,
        backgroundColor: theme.colors.primary        
    },
    text:{
        color: theme.colors.highlight
    }
})

export default CustomButton

