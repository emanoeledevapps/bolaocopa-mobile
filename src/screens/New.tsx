import {useState} from 'react';
import { Heading, VStack, Text, useToast, Image } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import {api} from '../services/api';
import {Keyboard} from 'react-native';
import LogoBy from '../assets/logoby.png';
import {useNavigation} from '@react-navigation/native';

export function New(){
    const navigation = useNavigation();
    const toast = useToast();
    const [poolTitle, setPoolTitle] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleCreatePool(){
        if(!poolTitle.trim()){
            return toast.show({
                title: 'Informe um nome para o seu bolão!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }
        Keyboard.dismiss();
        
        try{
            setLoading(true);
            await api.post('/pools', {title: poolTitle});

            toast.show({
                title: 'Bolão criado!',
                placement: 'top',
                bgColor: 'green.500'
            });

            navigation.goBack();
        }catch(err){
            toast.show({
                title: 'Não foi possível criar o bolão!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally{
            setLoading(false);
        }
    }
    return(
        <VStack flex={1} bg='gray.900'>
            <Header title="Criar um novo bolão"/>
            <VStack alignItems='center' mt={8} mx={5}>
                <Image
                    source={LogoBy}
                    height={100}
                    width={140}
                    alt='Imagem de logotipo'
                    resizeMode='contain'
                />

                <Heading fontFamily='heading' color='white' fontSize='xl' my={8} textAlign='center'>
                    Crie seu próprio bolão da copa e compartilhe entre amigos!
                </Heading>

                <Input
                    placeholder="Qual o nome do seu bolão?"
                    value={poolTitle}
                    onChangeText={(text) => setPoolTitle(text)}
                />

                <Button
                    mt={4}
                    title="CRIAR MEU BOLÃO"
                    onPress={handleCreatePool}
                    isLoading={loading}
                    _loading={{_spinner: {color: 'white', size:'lg'}}}
                />

                <Text fontSize='sm' color='gray.300' textAlign='center' mx={8} mt={8}>
                    Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
    )
}