import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import routes from '../../config/routes';

import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import LinearGradient from 'react-native-linear-gradient';

import { Colors, Typography } from '../../styles';
import AuthContext from '../../context/AuthContext';
import view from './../../assets/images/view.png';
import hidden from './../../assets/images/hidden.png';
import auth from '@react-native-firebase/auth';

import Button from '../../components/Button';
import Alert from '../../components/Modal/Alert';

const Login = ({ navigation }) => {
    const { authContext } = React.useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [isVisible, setIsVisible] = useState('');
    const [error, setError] = useState(false);
    const [password, setPassword] = useState('');
    const [googleInfo, setGoogleInfo] = useState([]);
    const [data, setData] = useState({
        checkTextInputChange: false,
        secureTextEntry: true,
    });

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '778646354621-id4p3dgc714mdefma79ebtks1e999s1q.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        });
    }, [])


    const __signInGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setGoogleInfo(userInfo);
            const user = {
                name: userInfo.user.name,
                email: userInfo.user.email,
                photo: userInfo.user.photo,
                free: true,
                active: true,
                joined: new Date()
            }
            authContext.signIn(user);
        } catch (error) {
            console.log(error)
            await setError(true);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                //user cancelled the login flow
                console.log("User cancelled the login flow")
                await setMsg("User cancelled the login flow!");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                console.log("Operation is in progress already")
                await setMsg("Operation is in progress already!");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                console.log("Play services not available or outdated")
                await setMsg("Play services not available or outdated!");
            } else {
                // some other error happened
                console.log("Some other error happened")
                await setMsg("Some other error happened!");
            }
            await setIsVisible(true);
        }
    };

    // replaces password text with * on active
    const __updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    // Login
    const __login = async () => {
        if (email != '' && password != '') {
            handleSignIn();
        }
        else {
            await setError(true);
            await setMsg('Please, enter valid informations.');
            await setIsVisible(true);
        }
    }


    const handleSignIn = async () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const userInfo = userCredentials.user;
                const user = {
                    name: userInfo.displayName,
                    email: userInfo.email,
                    photo: userInfo.photoURL,
                    free: true,
                    active: true,
                    joined: new Date()
                }
                authContext.signIn(user);
            })
            .catch(async error => {
                await setError(true);
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                    await setMsg('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                    await setMsg('That email address is invalid!');
                }

                if (error.code === 'auth/wrong-password') {
                    console.log('That email address is invalid!');
                    await setMsg('That email address is invalid!');
                }
                console.error(error);
                await setIsVisible(true);
            });
    }

    const __close = () => {
        setIsVisible(false);
    }

    return (
        <LinearGradient colors={[Colors.DARK_BLACK, Colors.BLACK, Colors.GRAY_BLUE]} style={styles.container}>
            {/* Modal */}
            <Alert isVisible={isVisible} msg={msg} error={error} onClick={__close} />
            {/* Body */}
            <View style={styles.bodyContainer} >
                <View style={styles.rowContainer}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.goBack()} >
                        <Icon name="arrow-left" color={Colors.WHITE} size={25} />
                    </TouchableOpacity>
                    <Text style={[Typography.H1, { marginLeft: 10, color: Colors.WHITE }]}>Login</Text>
                </View>

                {/* E-mail */}
                <View style={{ marginTop: 20 }}>
                    <Text style={[Typography.TAGLINE, { color: Colors.GRAY_DARK }]}>E-mail</Text>
                    <View style={[styles.gpInput]}>
                        <TextInput
                            value={email}
                            autoCapitalize={'none'}
                            placeholder=''
                            keyboardType='name-phone-pad'
                            onChangeText={(text) => setEmail(text)}
                            style={[Typography.BODY, styles.input]}
                            placeholderTextColor={Colors.GRAY_MEDIUM} />
                    </View>
                </View>

                {/* Password */}
                <View style={{ marginTop: 20 }}>
                    <Text style={[Typography.TAGLINE, { color: Colors.GRAY_DARK }]}>Password</Text>
                    <View style={[styles.gpInput]}>
                        <TextInput
                            value={password}
                            placeholder=''
                            keyboardType='name-phone-pad'
                            secureTextEntry={data.secureTextEntry}
                            onChangeText={(text) => setPassword(text)}
                            style={[Typography.BODY, styles.input]}
                            placeholderTextColor={Colors.GRAY_MEDIUM} />
                        <TouchableOpacity onPress={__updateSecureTextEntry} style={{ alignItems: 'flex-end', paddingRight: 15, justifyContent: 'center' }}>
                            {data.secureTextEntry ?
                                <Image source={hidden} resizeMode="contain" style={{ width: 25, height: 25 }} />
                                :
                                <Image source={view} resizeMode="contain" style={{ width: 25, height: 25 }} />
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginTop: 10, alignItems: 'center' }}>
                    <Text onPress={() => navigation.navigate(routes.Password)} style={[Typography.TAGLINE, { color: Colors.GRAY_LIGHT }]}>Forgot your password?</Text>
                </View>

                <View style={{ marginTop: 20 }}>
                    <Button
                        title='Login'
                        primary
                        color={Colors.BLACK}
                        onPress={() => __login()} />
                </View>

                <View style={{ marginTop: 20 }}>
                    <Button
                        title={'Log in with Google'}
                        google
                        secondary
                        onPress={() => __signInGoogle()} />
                </View>
            </View>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BLACK
    },
    // Body
    bodyContainer: {
        flex: 1,
        padding: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        paddingLeft: 12,
        width: "85%",
        flexDirection: 'row',
        borderRadius: 20,
        color: Colors.WHITE,
    },
    gpInput: {
        paddingLeft: 10,
        marginTop: 10,
        flexDirection: 'row',
        borderRadius: 20,
        color: Colors.WHITE,
        backgroundColor: Colors.LIGHT_BLACK
    },
    // Footer
    footerContainer: {
        padding: 20,
    },
});

export default Login;
