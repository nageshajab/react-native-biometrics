import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";

export default function App() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const fallbackToDefaultAuth = () => {
    console.log("Fallback to default authentication");
  };

  const alertComponent = (
    title: string,
    mess: string,
    btnText: string,
    btnFunc: () => void
  ) => {
    return Alert.alert(title, mess, [
      {
        text: btnText,
        onPress: btnFunc,
      },
    ]);
  };

  const TwoButtonAlert = () =>
    Alert.alert("You are logged in", "Subscript Now @OmatsolaDev", [
      {
        text: "Back",
        onPress: () => console.log("cancel pressed"),
        style: "cancel",
      },
      {
        text: "{Proceed}",
        onPress: () => console.log("ok pressed"),
      },
    ]);

  const handleBiometricAuth = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(isBiometricAvailable);

    if (!isBiometricAvailable) {
      return alertComponent(
        "Please enter your password",
        "Biometric auth not supported",
        "OK",
        fallbackToDefaultAuth
      );
    }
    let supportedBiometrics;

    supportedBiometrics =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (
      supportedBiometrics.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      )
    ) {
      console.log("Face recognition is supported");
    }

    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      return alertComponent(
        "Biometrics record not found",
        "Pleae login with your password",
        "OK",
        fallbackToDefaultAuth
      );
    }
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login to dev app with biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });
    if (biometricAuth) {
      TwoButtonAlert();
    }
  };

  useEffect(() => {
    // async () => {
    //   const compatible = await LocalAuthentication.hasHardwareAsync();
    //   setIsBiometricSupported(compatible);
    // };
    const checkBiometricSupport = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    };
    checkBiometricSupport();
  }, []);

  return (
    <View style={tw`flex-1 bg-white items-center justify-center`}>
      <View style={tw` mb-[100px]`}>
        <Text style={tw`text-center text-lg`}>Welcome to my App!</Text>
        <Text>
          {" "}
          {isBiometricSupported
            ? "your device is compatible with biometrics"
            : "your device is not compatible with biometrics"}
        </Text>
      </View>
      <View style={tw`flex flex-row items-center gap-4`}>
        <TouchableOpacity
          style={tw`rounded-lg bg-black flex flex-row items-center justify-center`}
        >
          <Text style={tw`text-white`}>Login with Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBiometricAuth}>
          <Entypo name="fingerprint" size={50} color="black" />
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
