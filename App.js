import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View, Image, Button } from 'react-native';
import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function App() {
  const [photoData, setPhotoData] = useState([])
  const [photoLoading, setphotoLoading] = useState(true)
  const photoURL = "https://jsonplaceholder.typicode.com/photos"
  const [userData, setUserData] = useState([])
  const [userLoading, setUserLoading] = useState(true)
  const userURL = "https://jsonplaceholder.typicode.com/users"

  function DetailsScreen({route}) {
    const {name, website, company} = route.params
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.userText}>{name}</Text>
        <Text style={styles.userText}>{website}</Text>
        <Text style={styles.userText}>{company}</Text>
      </View>
    );
  }
  
  function PhotoScreen({ navigation }) {
    return (
      <SafeAreaView style={styles.container}>
      {photoLoading ? <ActivityIndicator/> : 
        <FlatList style={{flexGrow: 0}} horizontal={true} data={photoData} keyExtractor={({id}, index) => id}
          renderItem={({item}) => {
            return(
              <View>
                <Image
                  style={styles.image}
                  source={{
                    uri: item.url
                }}
                />
                <View style={styles.viewText}>
                  <Text style={styles.text}>
                    {item.title}
                  </Text>
                </View>
              </View>
            )
          }}
        />
      }
        <Button title="Randomize" onPress={() => randomize()}/>
      </SafeAreaView>
    );
  }
  
  function UserScreen({ navigation }) {
    return (
      <SafeAreaView style={styles.container}>
      {userLoading ? <ActivityIndicator/> : 
        <FlatList style={{flexGrow: 0}} data={userData} keyExtractor={({id}, index) => id}
          renderItem={({item}) => {
            return(
              <View>
                <Text onPress={() => {
                  navigation.navigate('Details', {
                    name: item.name,
                    website: item.website,
                    company: item.company.name
                  })
                }} style={styles.userText}>{item.username}</Text>
              </View>
            )
          }}
        />
      }
      </SafeAreaView>
    );
  }
  
  const PhotoStack = createNativeStackNavigator();
  
  function PhotosScreen() {
    return (
      <PhotoStack.Navigator>
        <PhotoStack.Screen name="Photos" component={PhotoScreen} />
      </PhotoStack.Navigator>
    );
  }
  
  const UsersStack = createNativeStackNavigator();
  
  function UsersScreen() {
    return (
      <UsersStack.Navigator>
        <UsersStack.Screen name="Users" component={UserScreen} />
        <UsersStack.Screen name="Details" component={DetailsScreen} />
      </UsersStack.Navigator>
    );
  }
  
  const Tab = createBottomTabNavigator();

  const randomize = () => {
    let copy = [...photoData]
    shuffleArray(copy)
    setPhotoData(copy)
  }

  const Result = result => ({ bounce: false, result });

  const Bounce = func => (...args) => ({ bounce: true, func, args });

  const trampoline = t => {
      while (t.bounce) t = t.func(...t.args);
      return t.result;
  };

  const _shuffleArray = Bounce((array, currentIndex) => {
      if (currentIndex >= array.length) return Result(array);
      let randomIndex = Math.floor(Math.random() * currentIndex);
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      return _shuffleArray(array, currentIndex + 1);
  });

  const shuffleArray = array => trampoline(_shuffleArray(array, 0));

  useEffect(() => {
    fetch(photoURL)
    .then((response) => response.json())
    .then((json) => setPhotoData(json))
    .catch((error) => alert(error))
    .then(setphotoLoading(false))
  }, [])

  useEffect(() => {
    fetch(userURL)
    .then((response) => response.json())
    .then((json) => setUserData(json))
    .catch((error) => alert(error))
    .then(setUserLoading(false))
  }, [])

  return (
    <NavigationContainer>
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Tab 1" component={PhotosScreen} />
      <Tab.Screen name="Tab 2" component={UsersScreen} />
    </Tab.Navigator>
  </NavigationContainer>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width:200,
      height:200,
      borderWidth: 5,
      borderColor: 'black',
      borderRadius: '20%',
      margin: 5
    },
    viewText: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      top: 85,
      left: 15
    },
    text: {
      transform: [{rotate: '45deg'}]
    },
    userText: {
      fontSize: 50
    }
  });
