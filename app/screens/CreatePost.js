import React, {useState, useCallback, createRef} from 'react'
import { ScrollView, StyleSheet, Text, TextInput, Alert, BackHandler, KeyboardAvoidingView } from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
import {Button} from 'react-native-paper'
import { theme } from '../core/theme'


const submitPost = () => {
    return (<Button 
        mode={'contained'} 
        style={styles.button}
        color={theme.colors.primary}>Post</Button>)
}


const CreatePost = ({route, navigation}) => {

    const [text, setText] = useState('');
    const textRef = createRef();

    React.useEffect(
        () =>
          navigation.addListener('beforeRemove', (e) => {   
            // Prevent default behavior of leaving the screen
            e.preventDefault();
    
            // Prompt the user before leaving the screen
            Alert.alert(
              'Delete post?',
              'You have unsaved changes. Your post will be gone forever. Are you sure?',
              [
                { text: "Don't leave", style: 'cancel', onPress: () => {} },
                {
                  text: 'Delete post',
                  style: 'destructive',
                  // If the user confirmed, then we dispatch the action we blocked earlier
                  // This will continue the action that had triggered the removal of the screen
                  onPress: () => navigation.dispatch(e.data.action),
                },
              ]
            );
          }),
        [navigation]
      );

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView
            style={styles.container}
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps='always'>
                <TextInput
                ref={textRef}
                onChangeText={setText}
                autoFocus={true}
                value={text}
                placeholder="Type your post here..."
                placeholderTextColor={theme.colors.secondary}
                textAlignVertical='top'
                multiline={true}
                style={styles.input}></TextInput>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container:{
        height: '100%',
        width: '100%',
        flex: 1,
        padding: 5,
        backgroundColor: theme.colors.background
    },
    input: {
        width: '100%',
        height: '100%',
        fontSize: 20,
        backgroundColor: theme.colors.background
    },
    button: {
        marginRight: 10,
    }
})

export {CreatePost, submitPost}