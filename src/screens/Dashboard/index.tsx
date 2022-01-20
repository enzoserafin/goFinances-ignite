import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';

import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HighLightCard } from '../../components/HighLightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
    Container, 
    Header,
    UserWapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighLightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer,
} from  './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighLightProps {
    amount: string;
    lastTransaction: string;
}

interface HighLightData {
    entries: HighLightProps;
    expensives: HighLightProps;
    total: HighLightProps;
}

export function Dashboard() {
    const [ isLoading, setisLoading ] = useState(true);
    const [ transaction, setTransactions ] = useState<DataListProps[]>([]);
    const [ highLightData, setHighLightData ] = useState<HighLightData>({} as HighLightData);
    const theme = useTheme();

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'
    ) {
        const lastTransactions = new Date(
        Math.max.apply(Math, collection
        .filter(transaction => transaction.type === type)
        .map(transaction => new Date(transaction.date).getTime())));

        return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleString('pt-BR', {month: 'long'})}`;
    }

    async function loadTransactions() {
        const dataKey = '@goFinances:transactions';
        const response =  await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {

            if(item.type === 'positive') {
                entriesTotal += Number(item.amount);
            } else {
                expensiveTotal += Number(item.amount);
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date: date
            }
        });

        const total = entriesTotal - expensiveTotal

        setTransactions(transactionFormatted);

        const lastTransactionsEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionsExpensives = getLastTransactionDate(transactions, 'negative');
        const totalInterval = `01 a ${lastTransactionsExpensives}`
        
        setHighLightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }),
                lastTransaction: `Última entrada dia ${lastTransactionsEntries}`,
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }),
                lastTransaction: `Última saída dia ${lastTransactionsExpensives}`,
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }),
                lastTransaction: lastTransactionsExpensives,
            }
        });
        setisLoading(false);
    }

    useEffect(() => {
        loadTransactions();
    }, [])

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <Container>
            {
                isLoading ?  
                    <LoadContainer>
                        <ActivityIndicator 
                            color={theme.colors.primary}
                            size='large'
                        />
                    </LoadContainer> :
                <>
                    <Header>
                        <UserWapper>
                            <UserInfo>
                                <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/60652221?v=4' }}/>
                                <User>
                                    <UserGreeting>Olá,</UserGreeting>
                                    <UserName>Enzo</UserName>
                                </User>
                            </UserInfo>
                            <LogoutButton onPress={() => {}}>
                                <Icon />
                            </LogoutButton>
                        </UserWapper>
                    </Header>
                    <HighLightCards>
                        <HighLightCard 
                            type='up'
                            title='Entradas' 
                            amount={highLightData.entries.amount} 
                            lastTransaction={highLightData.entries.lastTransaction}
                        />
                        <HighLightCard 
                            type='down'
                            title= 'Saídas'
                            amount={highLightData.expensives.amount}
                            lastTransaction={highLightData.expensives.lastTransaction}
                        />
                        <HighLightCard 
                            type='total'
                            title='Total' 
                            amount={highLightData.total.amount}
                            lastTransaction={highLightData.total.lastTransaction}
                        />
                    </HighLightCards>
                    <Transactions>
                        <Title>
                            Listagem
                        </Title>

                        <TransactionList
                            data={transaction}
                            keyExtractor={ item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item}/> }
                        />
                    </Transactions>
                </>
            }
        </Container>
    )
}
