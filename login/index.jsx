import { View, Text,Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constant/Colors.jsx'
import { useRouter } from 'expo-router'

export default function LoginScreen() {

    const router= useRouter();

  return (
    <View style={{
        backgroundColor:'white'
    }}
    >
      <View style={{
         display:'flex',
       alignItems:'center',
       marginTop:150,
     
      }}>
        <TouchableOpacity onPress={()=>router.push('./Home/Homepage')}>
       <Image source ={require('../../assets/images/logo.png')}
          style={styles?.image}
       />
       </TouchableOpacity>
      </View>
      <View style={{
        padding:20,
        
      }}>
        <Text style={{
            color:'black',
            fontSize:17,
            fontWeight:'bold',
            textAlign:'center',
            marginTop:25
        }}>Stay on Track, Stay Healthy!</Text>

        <TouchableOpacity style = {styles?.Button}
         onPress={()=>router.push('login/SignIn')}>
            <Text
            style={{
                color:'white',
                textAlign:'center',
                fontFamily:'League Spartan',
                fontSize:20
            }}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {styles?.Button1} onPress={()=>router.push('/login/SignUp')}>
            <Text
            style={{
                color:Colors.PRIMARY,
                textAlign:'center',
                fontFamily:'League Spartan',
                fontSize:20
            }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    image:{
        width:210,
        height:300,     
    },
    Button:{
    padding:15,
    backgroundColor:Colors.PRIMARY,
    borderRadius:99,
    marginTop:90,
    marginLeft:68,
    width:230
   },
   Button1:{
    padding:15,
    backgroundColor:'#CAD6FF',
    borderRadius:99,
    marginTop:10,
    marginLeft:68,
    width:230,
    marginBottom:90
   },
})
