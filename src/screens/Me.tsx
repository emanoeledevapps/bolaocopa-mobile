import {Text, VStack, Image, Icon, Center, HStack, useToast} from 'native-base';
import {useAuth} from '../hooks/useAuth';
import {Header} from '../components/Header';
import {Button} from '../components/Button';
import * as DocumentPicker from 'expo-document-picker';
import * as WebBrowser from 'expo-web-browser';
import {SignOut, Pencil, ArrowSquareOut} from 'phosphor-react-native';
import {api} from '../services/api';
import {useState, useEffect} from 'react';
import {Modal, TouchableOpacity} from 'react-native';
import {Loading} from '../components/Loading';

import Avatar01 from '../assets/01.png';
import Avatar02 from '../assets/02.png';
import Avatar03 from '../assets/03.png';
import Avatar04 from '../assets/04.png';
import Avatar05 from '../assets/05.png';
import Avatar06 from '../assets/06.png';
import Avatar07 from '../assets/07.png';
import Avatar08 from '../assets/08.png';
import Avatar09 from '../assets/09.png';
import Avatar10 from '../assets/10.png';
import Avatar11 from '../assets/11.png';
import Avatar12 from '../assets/12.png';

interface UserProps{
    avatarUrl: string;
    email: string;
    name: string;
    id: string;
}

export function Me(){
    const toast = useToast();
    const {user, logOut} = useAuth();
    const [userInfo, setUserInfo] = useState<UserProps>({} as UserProps);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getMe();
    }, []);

    async function getMe(){
        try{
            setLoading(true);
            const res = await api.get('/me')
            setUserInfo(res.data?.user);
        }catch(err){
            console.log(err);
            toast.show({
                title: 'Algo deu errado, tente novamente!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally{
            setLoading(false);
        }
    }
    
    async function handleChoosePhoto(){
        const response = await DocumentPicker.getDocumentAsync({type: 'image/*'});
        console.log(response);

        // const data = new FormData();
        // data.append('image', {
        //     uri: response.uri,
        //     type: response.mimeType,
        //     name: response.name,
        // });

        // try{
        // const res = await axios.post('https://api.imgur.com/3/upload', data);
        // console.log(res.data);
        // }catch(err){
        //     console.log(err);
        // }

        // try{
        //     const upload = await api.post('https://api.imgur.com/3/upload', {
        //         image: file.uri,
        //         headers: {
        //             Authorization: 'Client-ID d99422d82ab7552'
        //         }
        //     })
    
        //     console.log(upload)

        // }catch(err){
        //     console.log(err);
        // }

    }

    async function handleChooseAvatar(avatar: string){
        setModalVisible(false);
        setLoading(true);
        let url = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
        if(avatar === '01'){
            url = 'https://i.imgur.com/a5vZami.png'
        }
        if(avatar === '02'){
            url = 'https://i.imgur.com/76xsmhQ.png'
        }
        if(avatar === '03'){
            url = 'https://i.imgur.com/sxQDA0R.png'
        }
        if(avatar === '04'){
            url = 'https://i.imgur.com/LKIpaho.png'
        }
        if(avatar === '05'){
            url = 'https://i.imgur.com/AMeILT1.png'
        }
        if(avatar === '06'){
            url = 'https://i.imgur.com/XXibJTe.png'
        }
        if(avatar === '07'){
            url = 'https://i.imgur.com/2xPGT24.png'
        }
        if(avatar === '08'){
            url = 'https://i.imgur.com/HaSxvkT.png'
        }
        if(avatar === '09'){
            url = 'https://i.imgur.com/VdKz1lC.png'
        }
        if(avatar === '10'){
            url = 'https://i.imgur.com/mXHtInq.png'
        }
        if(avatar === '11'){
            url = 'https://i.imgur.com/NroNi6L.png'
        }
        if(avatar === '12'){
            url = 'https://i.imgur.com/kB0j4xz.png'
        }

        try{
            await api.put('/user/avatar', {
                avatarUrl: url
            })

            toast.show({
                title: 'Avatar alterado!',
                placement: 'top',
                bgColor: 'green.500'
            })

            getMe();
        }catch(err){
            console.log(err);
            toast.show({
                title: 'Algo deu errado, tente novamente!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally{
            setLoading(false);
        }
    }

    async function handleOpenBrowser(){
        await WebBrowser.openBrowserAsync('https://www.lance.com.br/galerias/confira-como-seriam-os-avatares-dos-jogadores-de-futebol/#foto=1')
    }

    return(
        <VStack flex={1} bg='gray.900'>
            <Header title="Perfil"/>
            {loading ? (
                <Loading/>
            ): (
                <VStack justifyContent='center' p={5}>
                    <Image
                        source={userInfo.avatarUrl === null ? 
                            {uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                            : 
                            {uri: userInfo.avatarUrl}
                        }
                        alt='Imagem de perfil'
                        w={200}
                        h={200}
                        rounded={100}
                        alignSelf='center'
                        borderWidth={5}
                        borderColor='yellow.500'
                    />
                    <Text 
                        textAlign="center"
                        color="white"
                        fontWeight="bold"
                        fontSize={25}
                        numberOfLines={2}
                        mb={8}
                    >{userInfo.name}</Text>
                    <Text
                        fontSize='md'
                        color='yellow.500'
                        fontWeight="bold"
                    >
                        Email
                    </Text>
                    <Text
                        color='white'
                        fontSize='md'
                        mt={-2}
                        mb={8}
                    >
                        {userInfo.email}
                    </Text>
                    <Button
                        title="ALTERAR AVATAR"
                        onPress={() => setModalVisible(true)}
                        leftIcon={<Icon as={<Pencil color="black"/>}/>}
                        mb={4}
                    />
                    <Button
                        title="SAIR DA CONTA"
                        type="SECONDARY"
                        onPress={logOut}
                        leftIcon={<Icon as={<SignOut color='white'/>}/>}
                    />

                    <TouchableOpacity
                        onPress={() => handleOpenBrowser()}
                        style={{padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10}}
                    >
                        <Text color="white" fontWeight="bold">Fonte dos avatares</Text>
                        <Icon as={<ArrowSquareOut color='white'/>}/>
                    </TouchableOpacity>
                </VStack>
                    
            )}
            <Modal visible={modalVisible} animationType='fade' transparent onRequestClose={() => setModalVisible(false)}>
                <Center 
                    flex={1}
                >
                    <VStack w={300} h={430} bgColor='white' rounded={5} alignItems='center' p={3}>
                        <Text color='black' fontWeight='bold'>Selecione o avatar</Text>

                        <HStack flexWrap='wrap'>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('01')}
                            >
                                <Image
                                    source={Avatar01}
                                    alt='avatar 01'
                                    w={70}
                                    h={70}
                                    borderRadius={35}
                                    m={2}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('02')}
                            >
                                <Image
                                    source={Avatar02}
                                    alt='avatar 02'
                                    w={70}
                                    h={70}
                                    borderRadius={35}
                                    m={2}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('03')}
                            >
                                <Image
                                    source={Avatar03}
                                    alt='avatar 03'
                                    w={70}
                                    h={70}
                                    borderRadius={35}
                                    m={2}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('04')}
                            >
                                <Image
                                    source={Avatar04}
                                    alt='avatar 04'
                                    w={70}
                                    h={70}
                                    borderRadius={35}
                                    m={2}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('05')}
                            >
                                <Image
                                    source={Avatar05}
                                    alt='avatar 05'
                                    w={70}
                                    h={70}
                                    borderRadius={35}
                                    m={2}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('06')}
                            >
                                <Image
                                    source={Avatar06}
                                    alt='avatar 06'
                                    w={70}
                                    h={70}
                                    borderRadius={35}
                                    m={2}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('07')}
                            >
                                <Image
                                    source={Avatar07}
                                    alt='avatar 07'
                                    w={70}
                                    h={70}
                                    borderRadius={35}
                                    m={2}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('08')}
                            >
                                <Image
                                    source={Avatar08}
                                    alt='avatar 08'
                                    w={70}
                                    h={70}
                                    borderRadius={35}
                                    m={2}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('09')}
                            >
                                <Image
                                    source={Avatar09}
                                    alt='avatar 09'
                                    w={70}
                                    h={70}
                                    borderRadius={35}
                                    m={2}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('10')}
                            >
                                <Image
                                    source={Avatar10}
                                    alt='avatar 10'
                                    w={70}
                                    h={70}
                                    borderRadius={35}
                                    m={2}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('11')}
                            >
                                <Image
                                    source={Avatar11}
                                    alt='avatar 11'
                                    w={70}
                                    h={70}
                                    borderRadius={35}
                                    m={2}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('12')}
                            >
                                <Image
                                    source={Avatar12}
                                    alt='avatar 12'
                                    w={70}
                                    h={70}
                                    borderRadius={35}
                                    m={2}
                                />
                            </TouchableOpacity>
                        </HStack>
                            <TouchableOpacity
                                onPress={() => handleChooseAvatar('00')}
                                style={{
                                    backgroundColor: '#ddd',
                                    padding: 5,
                                    borderRadius: 5
                                }}
                            >
                                <Text color='gray.900' fontWeight='bold'>Remover avatar</Text>
                            </TouchableOpacity>
                    </VStack>
                </Center>
            </Modal>
        </VStack>
    )
}