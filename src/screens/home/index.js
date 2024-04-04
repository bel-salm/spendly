import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import SwipeableFlatList from 'react-native-swipeable-list';
import Lottie from 'lottie-react-native';

import routes from '../../config/routes';
import { Colors, Typography } from '../../styles';
import { getCurrency } from '../../utils/currency';
import { getTransactions, getTotalIncomes, getTotalExpenses, deleteTransaction } from '../../dbHelpers/transactionHelper';

import QuickActions from '../../utils/quickActions';
import BalanceCard from '../../components/Cards/BalanceCard';
import HomeHeader from '../../components/Headers/HomeHeader';
import TransactionCard from '../../components/Cards/TransactionCard';
import BlockHeader from '../../components/Headers/BlockHeader';
import PieCard from '../../components/Cards/PieCard';
import { getTheme } from '../../utils/theme';

const Home = ({ navigation }) => {
    const focused = useIsFocused();

    const [currency, setCurrency] = useState({});
    const [totalIncomes, setTotalIncomes] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [theme, setTheme] = useState({});

    useEffect(() => {
        getTheme(setTheme);
        getTransactions(setTransactions);
        getCurrency(setCurrency);
        getTotalIncomes(setTotalIncomes);
        getTotalExpenses(setTotalExpenses);
    }, [focused]);

    // Delete Item
    const __delete = (id) => {
        deleteTransaction(id);
        getTransactions(setTransactions);
        getTotalIncomes(setTotalIncomes);
        getTotalExpenses(setTotalExpenses);
    }

    // Update Item
    const __update = (item) => {
        navigation.navigate(routes.AddTransaction, { item: item });
    }

    return (
        <View style={styles(theme).container}>
            {/* Header */}
            <HomeHeader theme={theme} />

            {/* Body */}
            <View style={styles(theme).bodyContainer}>
                <SwipeableFlatList
                    data={transactions.slice(0, 5)}
                    maxSwipeDistance={140}
                    shouldBounceOnMount={true}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderQuickActions={({ index, item }) => QuickActions(item, __update, __delete, theme)}
                    ListHeaderComponent={() => {
                        return (
                            <View>
                                {/* // Balance */}
                                <View style={{ paddingLeft: 20, paddingTop: 10 }}>
                                    <BalanceCard currency={currency.symbol} incomes={totalIncomes} expenses={totalExpenses} theme={theme} />
                                </View>
                                   <View style={{ paddingLeft: 20 }}>
                                    <BlockHeader
                                        theme={theme}
                                        title='Transactions'
                                        onPress={() => navigation.navigate(routes.Transactions)} />
                                </View>
                            </View>
                        )
                    }}
                    ListEmptyComponent={() => {
                        return (
                            <View style={styles(theme).emptyContainer}>
                                <Lottie style={{ width: 250 }} source={require('../../assets/JSON/search.json')} autoPlay />
                                <Text style={[Typography.TAGLINE, { color: theme.darkmode ? Colors.WHITE : Colors.BLACK, textAlign: 'center' }]}>You don't have any transactions !</Text>
                            </View>
                        )
                    }}
                    renderItem={({ item, index }) => {
                        return <TransactionCard currency={currency.symbol} key={index} transaction={item} theme={theme} />
                    }}
                // ListFooterComponent={() => {
                //     return (
                //         // Statistics
                //         <View style={{ paddingLeft: 20, marginBottom: 20 }}>
                //             <BlockHeader title='Statistics' theme={theme} />
                //             <PieCard incomes={totalIncomes} expenses={totalExpenses} theme={theme} />
                //         </View>
                //     )
                // }}
                />
            </View>
        </View>
    );
};

export const styles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
    },
    // Body
    bodyContainer: {
        flex: 1,
        padding: 20,
        // borderTopLeftRadius: 30,
        // borderTopRightRadius: 30,
        paddingLeft: 0,
        paddingBottom: 0,
        backgroundColor: theme.darkmode ? Colors.BLACK : Colors.GRAY_THIN
    },
    emptyContainer: {
        alignItems: "center",
        padding: 20
    },
});

export default Home;
