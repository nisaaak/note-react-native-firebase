import React, { Component } from "react"
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Alert,
  Keyboard,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native'
import auth from '@react-native-firebase/auth'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast, { DURATION } from 'react-native-easy-toast'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      viewPassword: true,
      buttonEnable: false
    }
  }

  onLogin = () => {
    const { email, password } = this.state
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User signed in!');
        this.props.navigation.navigate('ScreenCatatan')
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          this.toast.show('That email address is invalid!')
        }
        if (error.code === 'auth/wrong-password') {
          console.log('The password is invalid!');
          this.toast.show('The password is invalid!')
        }
        if (error.code === 'auth/user-not-found') {
          console.log('There is no user record corresponding to this identifier!');
          this.toast.show('There is no user record corresponding to this identifier!')
        }
        console.log(error)
      });
  }

  validasi = () => {
    const { email, password } = this.state
    if (email && password) {
      this.setState({
        buttonEnable: true
      })
    } else {
      this.setState({
        buttonEnable: false
      })
    }
  }

  render() {
    const { viewPassword, buttonEnable } = this.state
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginHorizontal: 20 }}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#48afdb' }}>Catatanku</Text>
          <Text>Email</Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'grey',
            marginBottom: 12
          }}>
            <TextInput
              style={{
                height: 40,
                flex: 1
              }}
              keyboardType='email-address'
              placeholder="Masukkan Email"
              onChangeText={(value) => {
                this.setState({
                  email: value
                })
                this.validasi()
              }}
              value={this.state.email}
            />
          </View>

          <Text>Password</Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'grey',
            marginBottom: 12
          }}>
            <TextInput
              style={{
                height: 40,
                flex: 1
              }}
              secureTextEntry={this.state.viewPassword}
              placeholder="Masukkan Password"
              onChangeText={(value) => {
                this.setState({
                  password: value
                })
                this.validasi()
              }}
              value={this.state.password}
            />
            <TouchableWithoutFeedback
              style={{}}
              onPress={() => {
                this.setState({
                  viewPassword: !viewPassword
                })
              }}
            >
              {viewPassword ? (
                <Ionicons
                  name={'eye-off'}
                  size={24}
                  style={{ color: '#48afdb', marginRight: 10 }}
                />
              ) : (
                <Ionicons
                  name={'eye'}
                  size={24}
                  style={{ color: '#48afdb', marginRight: 10 }}
                />
              )
              }
            </TouchableWithoutFeedback>
          </View>

          <TouchableHighlight
            style={{ backgroundColor: buttonEnable ? '#48afdb' : 'grey', marginVertical: 10, borderRadius: 8, padding: 10 }}
            underlayColor='grey'
            onPress={() => {
              if (buttonEnable) {
                this.onLogin()
                this.setState({
                  email: '',
                  password: '',
                })
                this.validasi()
              }
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Login</Text>
          </TouchableHighlight>
          <Text>Belum punya akun?</Text>
          <TouchableHighlight
            style={{ backgroundColor: '#48afdb', marginVertical: 10, borderRadius: 8, padding: 10 }}
            underlayColor='grey'
            onPress={() => {
              this.setState({
                email: '',
                password: '',
                buttonEnable: false
              })
              this.props.navigation.navigate('ScreenRegister')
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Register</Text>
          </TouchableHighlight>
        </View>
        <Toast
          ref={(toast) => this.toast = toast}
          position='bottom'
          positionValue={100}
          fadeInDuration={750}
          fadeOutDuration={1000}
          style={{
            backgroundColor: '#EC4E20',
            borderRadius: 8,
            justifyContent: 'center',
            marginHorizontal: 24,
            flex: 1
          }}
          textStyle={{
            color: 'white',
            width: Dimensions.get('screen').width - 68,
            paddingLeft: 5,
            fontSize: 14
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
})

export default Login