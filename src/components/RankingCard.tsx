import { VStack, HStack, Text, Image } from "native-base";
import {ParticipantRankingProps} from '../screens/Details';

interface Props{
    data: ParticipantRankingProps;
}

export function RankingCard({data}: Props){
    return(
        <HStack 
            alignItems="center"
            justifyContent='space-between' 
            backgroundColor='gray.800'
            rounded={5}
            p={3}
            borderBottomColor='yellow.500'
            borderBottomWidth={2}
            mb={4}
        >
            <HStack>
                <Image
                    source={data.avatarUrl === null ? 
                        {uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                        : 
                        {uri: data.avatarUrl}
                    }
                    alt='Imagem de perfil'
                    w={50}
                    h={50}
                    rounded={25}
                />
                <Text
                    color='white'
                    fontSize='md'
                    fontWeight='bold'
                    ml={2}
                >
                    {data.name}
                </Text>
            </HStack>
            <Text 
                color='yellow.500'
                fontWeight='bold'
            >
                {data.pts} pts
            </Text>
        </HStack>
    )
}