import {Text, VStack, Image, Icon} from 'native-base';
import {useAuth} from '../hooks/useAuth';
import {Header} from '../components/Header';
import {Button} from '../components/Button';
import * as DocumentPicker from 'expo-document-picker';
import {SignOut} from 'phosphor-react-native';
import {api} from '../services/api';
import axios from 'axios';

export function Me(){
    const {user, logOut} = useAuth();
    
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
    return(
        <VStack flex={1} bg='gray.900'>
            <Header title="Perfil"/>
            <VStack justifyContent='center' p={5}>
                <Image
                    source={user.avatarUrl === null ? 
                        {uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                        : 
                        {uri: user.avatarUrl}
                    }
                    alt='Imagem de perfil'
                    w={200}
                    h={200}
                    rounded={100}
                    alignSelf='center'
                />
                <Text 
                    textAlign="center"
                    color="white"
                    fontWeight="bold"
                    fontSize={25}
                    numberOfLines={2}
                    mb={8}
                >{user.name}</Text>
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
                    {user.email}
                </Text>
                {/* <Button
                    title="Att"
                    type="SECONDARY"
                    onPress={handleChoosePhoto}
                /> */}
                <Button
                    title="SAIR DA CONTA"
                    type="SECONDARY"
                    onPress={logOut}
                    leftIcon={<Icon as={<SignOut color='white'/>}/>}
                />
            </VStack>
        </VStack>
    )
}