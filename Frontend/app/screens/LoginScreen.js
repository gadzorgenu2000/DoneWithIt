import React, {useState} from 'react';
import {Image, StyleSheet} from 'react-native'
import * as Yup from 'yup'

import Screen from '../components/Screen';
import {
    AppForm, 
    AppFormField,
    ErrorMessage,
    SubmitButton
} from '../components/Forms'
import authApi from '../api/auth'
import useAuth from '../auth/useAuth';

const ValidationSchema =  Yup.object().shape({
    email: Yup.string().required().email().label('Email'),
    password: Yup.string().required().min(6).label('Password')
})

const LoginScreen = () => {

    const auth = useAuth()

    const [loginFailed, setLoginFailed] = useState(false)

    const handleSubmit = async ({ email, password}) => {
       const result = await authApi.login(email, password)
       if(!result.ok) return setLoginFailed(true)
        
       setLoginFailed(false)
       auth.logIn(result.data.token)

    }

    return (
       <Screen style={styles.container}>
            <Image 
                style={styles.logo}
                source={require('../assets/logo.png')}
            />
            <AppForm initialValues={{
                email: '',
                password: ''
            }}
                // onSubmit={ values => console.log('val', values )}
                onSubmit={handleSubmit}
                validationSchema={ValidationSchema}
            >
                <ErrorMessage error='Invalid email and password' visible={loginFailed} />
              <AppFormField 
                autoCapitalize='none'
                autoCorrect={false}
                icon='email'
                keyboardType='email-address'
                name='email'
                placeholder='Email'
                //on works on IOS
                // textContentType='emailAddress'
            />
            <AppFormField
                autoCapitalize='none'
                autoCorrect={false}
                icon='lock'
                placeholder='Password'
                name='password'
                secureTextEntry
                // textContentType='password'
            />
            <SubmitButton title='Login'/>
            </AppForm>
       </Screen>
    );
}

const styles = StyleSheet.create({
    container:{
        padding:10
    },
    logo: {
        width: 140,
        height: 140,
        alignSelf: 'center',
        marginTop: 50,
        marginBottom: 20
    }
})
export default LoginScreen;