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

class Register extends React.Component {
  constructor(props) {
    super(props)
    const refToast = React.createRef()
    this.state = {
      email: '',
      password: '',
      confirm: '',
      nama: '',
      viewPassword: true,
      viewConfirm: true,
      buttonEnable: false
    }
  }

  onRegister = () => {
    const { email, password, nama, confirm } = this.state
    if (password === confirm) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account created & signed in!');
          this.onUpdate()

        })
        .catch(error => {
          console.log(error)
          if (error.code === 'auth/email-already-in-use') {
            this.toast.show('That email address is already in use!')
          }
          if (error.code === 'auth/invalid-email') {
            this.toast.show('That email address is invalid!')
          }
        });
    } else {
      this.toast.show('Password dan Konfirmasi tidak sama!')
    }
  }

  onUpdate = () => {
    const { nama } = this.state
    auth()
      .currentUser.updateProfile({ displayName: nama })
      .then(res => {
        console.log('success update', res)
        this.props.navigation.navigate('ScreenCatatan')
      })
      .catch(err => {
        console.log('error update', err)
      })
  }

  validasi = () => {
    const { email, password, nama, confirm } = this.state
    if (email && password && nama, confirm) {
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
    const { viewPassword, buttonEnable, viewConfirm } = this.state
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginHorizontal: 20 }}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#48afdb' }}>Catatanku</Text>
          <Text>Email</Text>
          <TextInput
            style={{
              height: 40,
              marginBottom: 12,
              borderWidth: 1,
              padding: 10,
              borderColor: 'grey'
            }}
            placeholder="Masukkan Email"
            keyboardType='email-address'
            onChangeText={(value) => {
              this.setState({
                email: value
              })
              this.validasi()
            }}
            value={this.state.email}
          />
          <Text>Nama</Text>
          <TextInput
            style={{
              height: 40,
              marginBottom: 12,
              borderWidth: 1,
              padding: 10,
              borderColor: 'grey'
            }}
            placeholder="Masukkan Nama"
            onChangeText={(value) => {
              this.setState({
                nama: value
              })
            }}
            value={this.state.nama}
          />
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
          <Text>Konfirmasi Password</Text>
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
              secureTextEntry={viewConfirm}
              placeholder="Konfirmasi Password"
              onChangeText={(value) => {
                this.setState({
                  confirm: value
                })
                this.validasi()
              }}
              value={this.state.confirm}
            />
            <TouchableWithoutFeedback
              style={{}}
              onPress={() => {
                this.setState({
                  viewConfirm: !viewConfirm
                })
              }}
            >
              {viewConfirm ? (
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
          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
              style={{
                height: 40,
                marginBottom: 12,
                borderWidth: 1,
                padding: 10,
                borderColor: 'grey',
                flex: 1
              }}
              secureTextEntry={this.state.viewConfirm}
              placeholder="Masukkan Konfirmasi Password"
              onChangeText={(value) => {
                this.setState({
                  confirm: value
                })
              }}
              value={this.state.confirm}
            />
            <TouchableHighlight
              underlayColor={'grey'}
              style={{ justifyContent: 'center', alignItems: 'center' }}
              onPress={() => {
                this.setState({
                  viewConfirm: !this.state.viewConfirm
                })
              }}
            >
              <Text>Show</Text>
            </TouchableHighlight>
          </View> */}
          <TouchableHighlight
            style={{ backgroundColor: buttonEnable ? '#48afdb' : 'grey', marginVertical: 10, borderRadius: 8, padding: 10 }}
            underlayColor='grey'
            onPress={() => {
              if (buttonEnable) {
                this.onRegister()
              }
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

export default Register