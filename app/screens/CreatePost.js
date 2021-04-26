import React, {useState, useCallback, createRef} from 'react'
import { ScrollView, StyleSheet, Text, TextInput, Alert, View, KeyboardAvoidingView, Platform } from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
import {Button} from 'react-native-paper'
import { theme } from '../core/theme'

const CreatePost = ({route, navigation}) => {

    const [text, setText] = useState('');

    //Set the button into the header bar
    React.useLayoutEffect(() => {
      navigation.setOptions({ headerRight: headerBarButton});
    }, [navigation, text]);

    //Button handler (
    const headerBarButton = () => {
      return (<Button 
          mode={'contained'} 
          style={styles.button}
          color={theme.colors.primary}
          onPress={createPost}>Post</Button>)
    }

    const createPost = () => {
      if(!text){
        Alert.alert(
          'Empty post',
          'Please write a text that can be posted',
          [
            {text: "Got it, chief", style: 'cancel'}
          ]
        )
      }
      console.log(`got ${text}`);
      navigation.goBack();
    }

    React.useEffect(
        () =>{
          if(Platform.OS === 'web')
          {
            return;
          }
          navigation.addListener('beforeRemove', (e) => {   
            // Prevent default behavior of leaving the screen
            e.preventDefault();
    
            // Prompt the user before leaving the screen
            //=============TODO: add fixed strings from a file==================
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
        }
      );

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView
            style={styles.container}
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps='always'>
              <View><Text>{text}</Text></View>
                <TextInput
                onChangeText={text => setText(text)}
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

export {CreatePost}