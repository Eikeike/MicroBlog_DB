import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../core/theme'
import { Button } from 'react-native-paper'

const SwitchButton = ({switchVar, ...props}) => {
    
    return (
        <Button style={{...styles.followButton, backgroundColor: switchVar ? theme.colors.primary : theme.colors.background}} mode={switchVar ? 'contained': 'outlined'}
                        labelStyle={{color: switchVar ? theme.colors.background : theme.colors.primary, fontSize: 14}}
                        contentStyle={{height: 30, width: 80}}
                        uppercase={false}
                        {...props}
                        />
    )
}

export default SwitchButton

const styles = StyleSheet.create({
    followButton: {
        marginTop: 40,
        borderRadius: 37
    }
})
