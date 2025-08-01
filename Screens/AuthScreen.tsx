import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Auth: undefined;
  TabNavigator: undefined;
};

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, "Auth">;

const AuthScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handlePasswordLogin = () => {
    setModalVisible(true);
  };

  const handleLogin = () => {
    if (username === "test" && password === "test") {
      navigation.navigate("TabNavigator");
      setModalVisible(false);
    } else {
      Alert.alert("Invalid username or password");
    }
  };

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
