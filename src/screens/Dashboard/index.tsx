import React from 'react';

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
} from  './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {
    const data: DataListProps[] = [
        {      
            id: '1',
            type: 'positive',
            title: 'Desenvolvimento de site',
            amonut: 'R$ 12.000,00',
            category:{
                name: 'Vendas',
                icon: 'dollar-sign',
            },
            date: '13/04/2020',
        },
        {
            id: '2',
            type: 'negative',
            title: 'Mc Donalds',
            amonut: 'R$ 60,00',
            category:{
                name: 'Alimentação',
                icon: 'coffee',
            },
            date: '11/04/2020',
        },
        {
            id: '3',
            type: 'negative',
            title: 'Aluguel do apartamento',
            amonut: 'R$ 1.200,00',
            category:{
                name: 'Casa',
                icon: 'shopping-bag',
            },
            date: '10/04/2020',
        },
    ]

    return (
        <Container>
            <Header>
                <UserWapper>
                    <UserInfo>
                        <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/60652221?v=4' }}/>
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Enzo</UserName>
                        </User>
                    </UserInfo>
                    <Icon />
                </UserWapper>
            </Header>
            <HighLightCards>
                <HighLightCard 
                    type='up'
                    title='Entradas' 
                    amount='R$ 17.400,00' 
                    lastTransaction='Última entrada dia 13 de abril'
                />
                <HighLightCard 
                    type='down'
                    title='Saídas' 
                    amount='R$ 1.259,00' 
                    lastTransaction='Última saída dia 03 de abril'
                />
                <HighLightCard 
                    type='total'
                    title='Total' 
                    amount='R$ 16.141,00' 
                    lastTransaction='01 à 16 de abril'
                />
            </HighLightCards>
            <Transactions>
                <Title>
                    Listagem
                </Title>

                <TransactionList
                    data={data}
                    keyExtractor={ item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item}/> }
                />
            </Transactions>
        </Container>
    )
}
