import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

import React, {useState} from 'react';
import {  
        Dimensions,
        StatusBar,
        StyleSheet, 
        Text, 
        TouchableOpacity,
        View,
        SafeAreaView,
        Platform, 
        TextInput} from 'react-native';
import AppNavContainer from './app/navigations';
import * as ErrorRecovery from "expo-error-recovery";

const globalErrorHandler = (err, isFatal) => {
  console.log("globalErrorHandler called!");
  ErrorRecovery.setRecoveryProps({ info: err });
  defaultErrorHandler(err, isFatal);
};

if(Platform.OS !== 'web')
{
  const defaultErrorHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler(globalErrorHandler);
}

export default function App() {

  return (
    <PaperProvider>
    <AppNavContainer/>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 0,
  },
  input:{
    height: '100%',
    borderWidth: 1,
    borderRadius: 5,
  },
  inputBox:{
    height:120,
    width: '90%'
  }
});
