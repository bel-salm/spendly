import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    View,
    Text,
    Pressable,
    Linking,
    Switch
} from 'react-native';
import Modal from "react-native-modal";
import DeviceInfo from 'react-native-device-info';

import { Colors, Typography } from '../../styles';
import AuthContext from '../../context/AuthContext';

import Bar from '../../components/Bar';
import { currencies, getCurrency, storeCurrency } from '../../utils/currency';
import { getTheme, storeTheme } from '../../utils/theme';

const Settings = ({ navigation }) => {
    const { state, authContext } = React.useContext(AuthContext);

    // Get User
    const user = state.user != null ? state.user.length > 0 ? JSON.parse(state.user) : state.user : { name: '', joined: Date.now() };
    const date = new Date(user.joined);

    const [currency, setCurrency] = useState({});
    const [currencyModal, setCurrencyModal] = useState(false);
    const [theme, setTheme] = useState({});
    const versionApp = DeviceInfo.getVersion();

    useEffect(() => {
        getCurrency(setCurrency);
        getTheme(setTheme)
    }, []);

    // Toggle Currency Modal
    const __toggleCurrencyModal = () => {
        setCurrencyModal(!currencyModal);
    };

    // Toggle Darkmode / Expense Switch
    const toggleDarkmodeSwitch = (event) => {
        console.log(event)
        setTheme({ darkmode: event });
        storeTheme({ darkmode: event })
    }



    // Change Currency
    const __changeCurrency = (currency) => {
        setCurrency(currency);
        storeCurrency(currency);
        __toggleCurrencyModal();
    };

    const __signOut = () => {
        authContext.signOut();
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Currency Modal */}
            <Modal
                useNativeDriverForBackdrop
                swipeDirection={['down']}
                isVisible={currencyModal}
                onBackButtonPress={() => { __toggleCurrencyModal(); } }
                onBackdropPress={() => { __toggleCurrencyModal(); } }
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                }}
            >
                <View>
                    <ScrollView style={styles(theme).modalContainer} showsVerticalScrollIndicator={false} >
                        {currencies.map((item, index) => (
                            <View key={index} >
                                <Pressable style={styles(theme).rowContainer} onPress={() => __changeCurrency(item)} >
                                    <Text style={[Typography.BODY, { color: theme.darkmode ? Colors.WHITE : Colors.BLACK }]}>{item.name}</Text>
                                    <Text style={[Typography.TAGLINE, { color: theme.darkmode ? Colors.WHITE : Colors.BLACK }]}>{item.symbol}</Text>
                                </Pressable>
                                <Bar padding={0.2} color={Colors.GRAY_DARK} />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </Modal>

            {/* Setting Screen */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles(theme).container}>
                {/* Header */}
                <View style={styles(theme).headerContainer}>
                    <Text style={[Typography.H1, { color: theme.darkmode ? Colors.WHITE : Colors.BLACK, marginBottom: 10 }]}>Settings</Text>
                </View>

                {/* Body */}
                <View style={styles(theme).bodyContainer}>
                    {/* Account */}
                    <View>
                        <Text style={[Typography.TAGLINE, { color: theme.darkmode ? Colors.GRAY_MEDIUM : Colors.BLACK, marginBottom: 10 }]}>Account</Text>
                        <View style={styles(theme).blockContainer}>
                            {/* Name */}
                            <View style={styles(theme).rowContainer}>
                                <Text style={[Typography.BODY, { color: theme.darkmode ? Colors.WHITE : Colors.BLACK }]}>Name</Text>
                                <Text style={[Typography.TAGLINE, { color: theme.darkmode ? Colors.GRAY_MEDIUM : Colors.BLACK }]}>{user.name}</Text>
                            </View>
                            <Bar padding={0.3} color={Colors.GRAY_THIN} />
                            <Bar padding={0.3} color={Colors.GRAY_THIN} />
                            {/* Joined at */}
                            <View style={styles(theme).rowContainer}>
                                <Text style={[Typography.BODY, { color: theme.darkmode ? Colors.WHITE : Colors.BLACK }]}>Joined</Text>
                                <Text style={[Typography.TAGLINE, { color: theme.darkmode ? Colors.GRAY_MEDIUM : Colors.BLACK }]}>{date.toDateString()}</Text>
                            </View>
                        </View>
                    </View>

                    {/* App setting */}
                    <View style={{ marginTop: 20 }}>
                        <Text style={[Typography.TAGLINE, { color: theme.darkmode ? Colors.GRAY_MEDIUM : Colors.BLACK, marginBottom: 10 }]}>App Settings</Text>
                        <View style={styles(theme).blockContainer}>
                            <Pressable
                                style={styles(theme).rowContainer}
                                onPress={() => __toggleCurrencyModal()}>
                                <Text style={[Typography.BODY, { color: theme.darkmode ? Colors.WHITE : Colors.BLACK }]}>Currency</Text>
                                <Text style={[Typography.TAGLINE, { color: theme.darkmode ? Colors.GRAY_MEDIUM : Colors.BLACK }]}>{currency.name} ({currency.symbol})</Text>
                            </Pressable>
                            <Bar padding={0.3} color={Colors.GRAY_THIN} />
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles(theme).rowContainer}>
                                <Text style={[Typography.BODY, { color: theme.darkmode ? Colors.WHITE : Colors.BLACK }]}>Language</Text>
                                <Text style={[Typography.TAGLINE, { color: theme.darkmode ? Colors.GRAY_MEDIUM : Colors.BLACK }]}>English</Text>
                            </TouchableOpacity>
                            <Bar padding={0.3} color={Colors.GRAY_THIN} />
                            <Pressable style={styles(theme).rowContainer}>
                                <Text style={[Typography.BODY, { color: theme.darkmode ? Colors.WHITE : Colors.BLACK }]}>Darkmode</Text>
                                <Text style={[Typography.TAGLINE, { color: theme.darkmode ? Colors.GRAY_MEDIUM : Colors.BLACK }]}>
                                    <Switch
                                        trackColor={{ false: Colors.WHITE, true: Colors.PRIMARY }}
                                        thumbColor={theme.darkmode ? Colors.PRIMARY : Colors.PRIMARY}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={toggleDarkmodeSwitch}
                                        value={theme.darkmode ? theme.darkmode : false}
                                    />
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Privacy */}
                    <View style={{ marginTop: 20 }}>
                        <Text style={[Typography.TAGLINE, { color: theme.darkmode ? Colors.GRAY_MEDIUM : Colors.BLACK, marginBottom: 10 }]}>More</Text>
                        <View style={styles(theme).blockContainer}>
                            <Pressable style={styles(theme).rowContainer}>
                                <Text style={[Typography.BODY, { color: theme.darkmode ? Colors.WHITE : Colors.BLACK }]}>Version</Text>
                                <Text style={[Typography.TAGLINE, { color: theme.darkmode ? Colors.GRAY_MEDIUM : Colors.BLACK }]}>{versionApp}</Text>
                            </Pressable>
                            {/* <Bar padding={0.3} color={Colors.GRAY_THIN} />
                            <Pressable style={styles(theme).rowContainer} onPress={() => Linking.openURL('https://www.github.com')}>
                                <Text style={[Typography.BODY, {color: Colors.WHITE}]}>Developer</Text>
                                <Text style={[Typography.TAGLINE, {color: Colors.GRAY_MEDIUM}]}>Isabel Sales Almeida</Text>
                            </Pressable> */}
                        </View>
                    </View>

                    {/* Sign out */}
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles(theme).btnContainer}
                        onPress={() => __signOut()} >
                        <Text style={[Typography.H3, { color: theme.darkmode ? Colors.PRIMARY : Colors.WHITE }]}>Sign out</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
};

export const styles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.darkmode ? Colors.BLACK : Colors.GRAY_THIN
    },
    // Header
    headerContainer: {
        padding: 20,
        paddingBottom: 10
    },
    // Body
    bodyContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 0
    },
    blockContainer: {
        borderRadius: 10,
        backgroundColor: theme.darkmode ? Colors.LIGHT_BLACK : Colors.GRAY_MEDIUM
    },
    rowContainer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    btnContainer: {
        padding: 12,
        marginTop: 20,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: theme.darkmode ? Colors.GRAY_MEDIUM : Colors.PRIMARY
    },
    // Modal 
    modalContainer: {
        height: '65%',
        margin: 0,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 20,
        backgroundColor: theme.darkmode ? Colors.BLACK : Colors.GRAY_MEDIUM
    },
});

export default Settings;
