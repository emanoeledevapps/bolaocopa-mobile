import {useCallback, useState} from 'react';
import { VStack, Icon, useToast } from "native-base";
import {FlatList} from 'react-native';
import {Octicons} from '@expo/vector-icons';
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {api} from '../services/api';
import {Loading} from '../components/Loading';
import {PoolProps, PoolCard} from '../components/PoolCard';
import {EmptyPoolList} from '../components/EmptyPoolList';

export function Pools(){
    const navigation = useNavigation();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [pools, setPools] = useState<PoolProps[]>([]);

    useFocusEffect(useCallback(() => {
        fetchPools();
    }, []));

    async function fetchPools(){
        try{
            setLoading(true);
            const response = await api.get('/pools');
            setPools(response.data.pools);
        }catch(err){
            console.log(err);
            toast.show({
                title: 'Não foi possível carregar os bolões!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally{
            setLoading(false);
        }
    }
    return(
        <VStack flex={1} bgColor='gray.900' >
            <Header title="Meus bolões"/>
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor='gray.600' pb={4} mb={4}>
                <Button 
                    title="BUSCAR BOLÃO POR CÓDIGO"
                    leftIcon={<Icon as={Octicons} name='search' color='black' size='md'/>}
                    onPress={() => navigation.navigate('Find')}
                />
            </VStack>
            {loading ? (
                <Loading/>
            ): (    
                <FlatList
                    data={pools}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <PoolCard 
                            data={item}
                            onPress={() => navigation.navigate('details', {id: item.id})}
                        />
                    )}
                    contentContainerStyle={{margin: 10, paddingBottom: 10}}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<EmptyPoolList/>}    
                />
            )}
        </VStack>
    )
}