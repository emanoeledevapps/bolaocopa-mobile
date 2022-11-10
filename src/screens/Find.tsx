import { Heading, VStack, useToast } from "native-base";
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

import {api} from '../services/api';

export function Find(){
    const toast = useToast();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');

    async function handleJoinPool(){
        try{
            if(!code.trim()){
                toast.show({
                    title: 'Digite o código do bolão!',
                    placement: 'top',
                    bgColor: 'red.500'
                })
                return;
            }
            setLoading(true);
            await api.post('/pools/join', {code});

            toast.show({
                title: 'Boa! Você entrou no bolão!',
                placement: 'top',
                bgColor: 'green.500'
            }) 

            navigation.goBack();
            
        }catch(err){
            console.log(err);

            if(err.response?.data?.message === 'Pool not found'){
                return toast.show({
                    title: 'O bolão não existe!',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            if(err.response?.data?.message === 'You already joined this pool'){
                return toast.show({
                    title: 'Você já participa desse bolão!',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            toast.show({
                title: 'Erro ao buscar o bolão!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally{
            setLoading(false);
        }
    }
    return(
        <VStack flex={1} bg='gray.900'>
            <Header title="Buscar por código" showBackButton/>
            <VStack alignItems='center' mt={4} mx={5}>
                <Heading fontFamily='heading' color='white' fontSize='xl' my={8} textAlign='center'>
                    Encontre um bolão através de seu código único
                </Heading>

                <Input
                    placeholder="Qual o código do bolão?"
                    value={code}
                    onChangeText={setCode}
                    autoCapitalize='characters'
                />

                <Button
                    mt={4}
                    onPress={handleJoinPool}
                    title="BUSCAR BOLÃO"
                    isLoading={loading}
                    _loading={{_spinner: { color: 'white', size: 'lg'}}}
                />
            </VStack>
        </VStack>
    )
}