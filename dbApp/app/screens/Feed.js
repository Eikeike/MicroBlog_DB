import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import { StyleSheet, SafeAreaView, Platform, StatusBar, FlatList, View, Text, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedList from '../components/FeedList'
import PostDetails from './PostDetails'
import { theme } from '../core/theme'
import { ActivityIndicator, Appbar, Divider } from 'react-native-paper';
import callApi from '../hooks/callApi'

const FeedStack = createStackNavigator();



const FeedListWithIcon = ({feed, loaded, navigation}) => {
    return(
    <>
    {
       loaded ? (<FeedList feed={feed}/>) : (<ActivityIndicator/>)
    } 
        <TouchableOpacity style={styles.addPostButton} onPress={() => {
            navigation.navigate("CreatePost");
        }}>
                <MaterialCommunityIcons name="pencil-plus" color={'#fff'} size={35} />
        </TouchableOpacity>
    </>
    )
}

const FeedStackScreen = ({route, navigation}) => {

    const [feed, setFeed] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect( () => {
        const fetchApi = async () => {
            const response = await callApi('/posts/feed');
            if(response)
            {
                setFeed(response.feed);
            }
            setLoaded(true);
        };
        const unsubscribe = navigation.addListener('focus', () => {
            fetchApi();
          });
          return unsubscribe;
        }, [route, navigation]
    )
    return(
        <>
        <Appbar.Header style={styles.appBar}>
            <Appbar.Content title={<MaterialCommunityIcons name="email" color={theme.colors.primary} size={35}/>} titleStyle={{alignSelf: 'center'}}/>
        </Appbar.Header>

        <Divider/>

        <FeedListWithIcon navigation={navigation} feed={feed} loaded={loaded}/>
        </>
    )
}

const styles = StyleSheet.create({
    appBar: {
        backgroundColor: theme.colors.background,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    addPostButton: {
        height: 60,
        width: 60,
        borderRadius: 50,
        backgroundColor: theme.colors.primary,
        right: 30,
        bottom: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.7,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default FeedStackScreen