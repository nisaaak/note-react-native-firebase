import React, { useState, useEffect, useContext, useRef, useStateCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Alert,
  Keyboard,
  Image,
  ScrollView
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database'
import Feather from 'react-native-vector-icons/Feather'

import { UserContext } from '../../utils/context';

const Catatan = ({ navigation }) => {
  const myTextInput = useRef()
  const [user, setUser] = useContext(UserContext)
  const [text, setText] = useState('')
  const [todo, setTodo] = useState([])
  const [button, setButton] = useState('Add!')
  const [posisi, setPosisi] = useState(null)
  const [selectedId, setSelectedId] = useState(null)


  useEffect(() => {
    const onValueChange = database()
      .ref(`/notes/${user.uid}`)
      .on('value', snapshot => {
        console.log('User data: ', snapshot.val());
        if (snapshot.val()) {
          let data = snapshot.val()
          let result = Object.keys(data).map((key) => ({ 'id': key, 'note': data[key]['note'] }))
          setTodo(result)
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref(`/notes/${user.uid}`).off('value', onValueChange);
  }, []);


  const onLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!')
        navigation.navigate('ScreenLogin')
      })
  }

  const onPressButton = () => {
    Keyboard.dismiss()
    if (button === 'Add!') {
      addDataAPI()
    } else {
      updateDataAPI()
    }
  }

  // const addTodo = () => {
  //   let todoBaru = text
  //   let listToDo = todo
  //   listToDo.push(todoBaru)
  //   setTodo(listToDo)
  //   setText('')
  // }

  // const deleteTodo = (t) => {
  //   console.log('enter function delete')
  //   let listToDo = todo
  //   let posisi = listToDo.indexOf(t)
  //   listToDo.splice(posisi, 1)
  //   setTodo(listToDo)
  // }

  // const editTodo = (t) => {
  //   // myTextInput.focus()
  //   let listToDo = todo
  //   let posisii = listToDo.indexOf(t)
  //   setText(listToDo[posisii])
  //   setPosisi(posisii)
  //   setButton('Edit!')
  // }

  // const saveEdit = () => {
  //   let listToDo = todo
  //   listToDo[posisi] = text
  //   setTodo(listToDo)
  //   setText('')
  //   setButton('Add!')
  // }

  const addDataAPI = () => {
    database()
      .ref(`/notes/${user.uid}`)
      .push({
        note: text,
      })
      .then(() => {
        console.log('Data set.')
        setText('')
      })
      .catch(err => { console.log(err) })
  }

  const updateDataAPI = () => {
    database()
      .ref(`/notes/${user.uid}/${selectedId}`)
      .update({
        note: text,
      })
      .then(() => {
        console.log('Data updated.')
        setButton('Add!')
        setText('')
        setSelectedId()
      });
  }

  const deleteDataAPI = (id) => {
    database().ref(`/notes/${user.uid}/${id}`).remove()
  }

  const CreateList = () => {
    return todo.map(t => {
      return (
        <TouchableHighlight
          key={t.id}
          underlayColor={'#dddddd'}
          onPress={() => {
            deleteDataAPI(t.id)
          }}
        >
          <View>
            <View style={styles.row}>
              <Text style={styles.txtList}>{t.note}</Text>
              <TouchableHighlight
                underlayColor="grey"
                onPress={() => {
                  setText(t.note)
                  setSelectedId(t.id)
                  setButton('Edit!')
                  myTextInput.current.focus()
                }}
              >
                <Feather
                  name={'edit'}
                  size={20}
                  style={{ color: '#48afdb' }}
                />
                {/* <Text style={{ color: '#48afdb', fontSize: 18 }}>edit</Text> */}
              </TouchableHighlight>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
      )
    })
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.toolbarView}>
          <Text style={styles.textTitle}>Catatanku</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: 'white' }}>Welcome </Text>
            <Text style={{ color: 'white' }}>{user.displayName} !</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={myTextInput}
            style={styles.input}
            placeholder="masukkan text disini!"
            value={text}
            onChangeText={(text) => setText(text)}
          />
          <TouchableHighlight
            onPress={() => {
              onPressButton()
            }}
            style={styles.button}
            underlayColor={'#dddddd'}
          >
            <Text style={styles.btnText}>{button}</Text>
          </TouchableHighlight>
        </View>
        <ScrollView>
          <CreateList />
          {/* {createList()} */}
        </ScrollView>
      </View>
      <TouchableHighlight
        style={{ backgroundColor: '#48afdb', marginVertical: 10, borderRadius: 8, padding: 10, marginHorizontal: 20 }}
        underlayColor='grey'
        onPress={() => {
          onLogout()
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Logout</Text>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  toolbarView: {
    backgroundColor: '#48afdb',
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTitle: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold'
  },
  inputContainer: {
    marginTop: 5,
    padding: 10,
    flexDirection: 'row'
  },
  button: {
    height: 36,
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#48afdb',
    justifyContent: 'center',
    borderRadius: 4
  },
  btnText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 6
  },
  input: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48afdb',
    borderRadius: 4,
    color: '#48bbec'
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    height: 44,
    justifyContent: 'space-between'
  },
  separator: {
    height: 1,
    backgroundColor: '#cccccc'
  },
  txtList: {
    color: 'black',
  }
})

export default Catatan
