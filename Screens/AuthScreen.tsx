import React, { useState } from "react"; //used to manage state
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native"; // Imports various UI components from React Native
import tw from "twrnc"; //Imports the twrnc library, which is a CSS framework for React Native.

import { Entypo } from "@expo/vector-icons"; //Entypo icon set from Expo's vector icons library
import * as LocalAuthentication from "expo-local-authentication"; //Entypo icon set from Expo's vector icons library
import { useNavigation } from "@react-navigation/native"; //provides navigation functionality
import { StackNavigationProp } from "@react-navigation/stack"; //used to define the navigation prop type

type RootStackParamList = {
  Auth: undefined;
  TabNavigator: undefined;
}; //Defines a type for the root stack param list, which includes two routes: Auth and TabNavigator.

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, "Auth">;

const AuthScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>(); //Uses the useNavigation hook to get the navigation prop, which is typed as AuthScreenNavigationProp.

  const [modalVisible, setModalVisible] = useState(false); //for showing hiding modal of login/ pwd screen
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handlePasswordLogin = () =>
    //sets the modalVisible state to true
    {
      setModalVisible(true);
    };

  const handleLogin = () =>
    //Defines a handler function handleLogin that checks the username and password, and navigates to the TabNavigator route if they are valid.
    {
      if (username === "test" && password === "test") {
        navigation.navigate("TabNavigator");
        setModalVisible(false);
      } else {
        Alert.alert("Invalid username or password");
      }
    };

  //Defines a handler function handleBiometricAuth that uses the Expo Local Authentication library to authenticate the user biometrically.
  const handleBiometricAuth = async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login to app with biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });
    if (biometricAuth.success) {
      navigation.navigate("TabNavigator");
    } else {
      // Handle authentication failure or cancellation
      console.log("Authentication failed or cancelled");
    }
  };

  return (
    <View style={tw`flex-1 bg-white items-center justify-center`}>
      <TouchableOpacity onPress={handleBiometricAuth}>
        <Entypo name="fingerprint" size={50} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePasswordLogin}>
        <Text style={tw`text-blue-500 text-base`}>Login with Password</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={tw`flex-1 bg-white items-center justify-center`}>
          <TextInput
            style={tw`w-64 h-10 border border-gray-300 px-4 py-2 mb-4`}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={tw`w-64 h-10 border border-gray-300 px-4 py-2 mb-4`}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Button title="Login" onPress={handleLogin} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default AuthScreen;
