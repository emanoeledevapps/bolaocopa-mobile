import { Center, Text, Icon, useToast, VStack, Image } from "native-base";
import { useAuth } from "../hooks/useAuth";
import {Keyboard, ScrollView} from 'react-native';

import Logo from '../assets/logo.svg';
import {useState} from 'react';

import {Fontisto} from '@expo/vector-icons';

import { Button } from "../components/Button";
import { Input } from "../components/Input";

import LogoBy from '../assets/logoby.png';


export function SignIn(){
    const toast = useToast();
    const {signInGoogle, isUserLoading, signInEmailAndPassword, signUpEmailAndPassword} = useAuth();
    const [typeScreen, setTypeScreen] = useState<'signUp' | 'signIn'>('signIn');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function handleSignInEmailAndPassword(){
        Keyboard.dismiss();
        const response = await signInEmailAndPassword({email, password});
        if(response === 'Preencha todos os campos!'){
            return toast.show({
                title: 'Preencha todos os campos!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }
        if(response === 'Email incorrect or not exists'){
            return toast.show({
                title: 'Email incorreto ou não existente!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }
        if(response === 'Password incorrect'){
            return toast.show({
                title: 'Senha incorreta!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }
        if(response === 'ok'){
            return;
        }

        toast.show({
            title: 'Algo deu errado. Tente novamente!',
            placement: 'top',
            bgColor: 'red.500'
        })
    }

    async function handleSignUpEmailAndPassword(){
        Keyboard.dismiss();
        if(!email.trim() || !password.trim() || !name.trim() || !confirmPassword.trim()){
            return toast.show({
                title: 'Preencha todos os campos!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }
        if(password.length < 6){
            return toast.show({
                title: 'A senha de conter pelo menos 6 caracteres!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }
        if(password != confirmPassword){
            return toast.show({
                title: 'As senhas não conferem!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }

        const response = await signUpEmailAndPassword({name, email, password});
        if(response === 'Email exists'){
            return toast.show({
                title: 'Email já cadastrado!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }
        if(response === 'cadastrado'){
            setEmail('');
            setName('');
            setPassword('');
            setConfirmPassword('');
            setTypeScreen('signIn')
            return toast.show({
                title: 'Cadastro realizado com sucesso! Faça login.',
                placement: 'top',
                bgColor: 'green.500'
            })
            
        }

        toast.show({
            title: 'Algo deu errado. Tente novamente!',
            placement: 'top',
            bgColor: 'red.500'
        })
    }

    return(
        <Center bgColor='gray.900' flex={1} p={5}>
            {/* <Logo width={212} height={40}/>  */}
            <Image
                source={LogoBy}
                height={100}
                width={140}
                alt='Imagem de logotipo'
                resizeMode="contain"
            />

            {typeScreen === 'signUp' && (
                <>
                <VStack width='100%' mt={5}>
                    <Text fontWeight="bold" color='yellow.500' textAlign="left">Nome</Text>
                </VStack>
                <Input
                    placeholder="Digite seu nome"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize='words'
                /> 
                </>
            )}

            <VStack width='100%' mt={typeScreen === 'signIn' ? 5 : 4}>
                <Text fontWeight="bold" color='yellow.500' textAlign="left">Email</Text>
            </VStack>
            <Input
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
            /> 

            <VStack width='100%' mt={4}>
                <Text fontWeight="bold" color='yellow.500' textAlign="left">Senha</Text>
            </VStack>
            <Input
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
                secureTextEntry
            />
            {typeScreen === 'signUp' && (
                <>
                <VStack width='100%' mt={4}>
                    <Text fontWeight="bold" color='yellow.500' textAlign="left">Confirme sua senha</Text>
                </VStack>
                <Input
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize='none'
                    secureTextEntry
                /> 
                </>
            )}

            <Button
                mt={8}
                title={typeScreen === 'signIn' ? 'ENTRAR' : 'CADASTRAR'}
                
                isLoading={isUserLoading}
                _loading={{_spinner: { color: 'white', size: 'lg'}}}
                onPress={() => {
                    if(typeScreen === 'signIn'){
                        handleSignInEmailAndPassword();
                    }else{
                        handleSignUpEmailAndPassword();
                    }
                }}
            />

            {/* <Button 
                marginTop={12}
                leftIcon={<Icon as={Fontisto} name='google' color='white' size='md'/>}
                title="ENTRAR COM GOOGLE"
                type="SECONDARY"
                onPress={signIn}
                isLoading={isUserLoading}
                _loading={{_spinner: { color: 'white', size: 'lg'}}}
            /> */}
              

            <Text 
                color='gray.300' 
                textAlign='center' 
                marginTop={4} 
                marginX={12}
                onPress={() => {
                    if(typeScreen === 'signIn'){
                        setTypeScreen('signUp');
                    }else{
                        setTypeScreen('signIn');
                    }
                }}
            >
                {typeScreen === 'signIn' ? 'Não tem conta? Cadastre-se agora!' : 'Ja tem conta? Faça login!'}
            </Text>
        </Center>
    )
}