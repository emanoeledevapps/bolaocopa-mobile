import {VStack, useToast, HStack, Text} from 'native-base';
import { Header } from '../components/Header';
import { useRoute } from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {api} from '../services/api';
import {Loading} from '../components/Loading';
import {PoolProps} from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import {Share, FlatList, KeyboardAvoidingView, Platform} from 'react-native';

import {ParticipantProps} from '../components/Participants';
import {Guesses} from '../components/Guesses';
import { RankingCard } from '../components/RankingCard';

interface RouteProps{
    id: string;
}

export interface ParticipantRankingProps{
    id: string;
    name: string;
    avatarUrl: string;
    pts: string;
}

export function Details(){
    const route = useRoute();
    const {id} = route.params as RouteProps;
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [poolDetails, setPoolDetails] = useState<PoolProps>({} as PoolProps);
    const [participants, setParticipants] = useState<ParticipantRankingProps[]>([]);
    const [optionSelected, setOptionSelected] = useState<'Seus Palpites' | 'Ranking do grupo'>('Seus Palpites');

    useEffect(() => {
        fetchPool();
    },[id]);

    async function handleCodeShare(){
        await Share.share({
            title: 'Código do bolão: ',
            message: poolDetails.code
        })
    }

    async function fetchPool(){
        try{
            setLoading(true);
            const response = await api.get(`/pools/${id}`);
            setPoolDetails(response.data.pool);
            createRanking(response.data.pool.participants);
            console.log(response.data.participants);
        }catch(err){
            console.log(err);
            return toast.show({
                title: 'Algo deu errado!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally{
            setLoading(false);
        }
    }

    async function createRanking(participants: ParticipantProps[]){
        let pts = 0;
        let array = [];
        for(var i = 0; i < participants.length; i++){
            let pts = 0;
            for(var g = 0; g < participants[i].guesses.length; g++){
                if(participants[i].guesses[g].firstTeamPoints === participants[i].guesses[g].game.firstTeamPoints &&
                    participants[i].guesses[g].secondTeamPoints === participants[i].guesses[g].game.secondTeamPoints
                ){
                    //Até 1 gol
                    if(participants[i].guesses[g].firstTeamPoints < 2 ){
                        if(participants[i].guesses[g].secondTeamPoints < 2){
                            pts += 3
                        }
                    }

                    //2 Gols
                    if(participants[i].guesses[g].firstTeamPoints === 2){
                        if(participants[i].guesses[g].secondTeamPoints <= 2){
                            pts += 5
                        }
                    }else{
                        if(participants[i].guesses[g].secondTeamPoints === 2){
                            if(participants[i].guesses[g].firstTeamPoints <= 2){
                                pts += 5
                            }
                        }
                    }

                    //3 Gols
                    if(participants[i].guesses[g].firstTeamPoints === 3){
                        if(participants[i].guesses[g].secondTeamPoints <= 3){
                            pts += 8
                        }
                    }else{
                        if(participants[i].guesses[g].secondTeamPoints === 3){
                            if(participants[i].guesses[g].firstTeamPoints <= 3){
                                pts += 8
                            }
                        }
                    }

                    //4 Gols
                    if(participants[i].guesses[g].firstTeamPoints === 4){
                        if(participants[i].guesses[g].secondTeamPoints <= 4){
                            pts += 12
                        }
                    }else{
                        if(participants[i].guesses[g].secondTeamPoints === 4){
                            if(participants[i].guesses[g].firstTeamPoints <= 4){
                                pts += 12
                            }
                        }
                    }

                    //5+ Gols
                    if(participants[i].guesses[g].firstTeamPoints > 4 ||
                        participants[i].guesses[g].secondTeamPoints > 4 
                    ){
                        pts += 20
                    }
                }
            }
            const participant = {
                id: participants[i].id,
                name: participants[i].user.name,
                avatarUrl: participants[i].user.avatarUrl,
                pts: pts
            }
            array.push(participant);
        }

        setParticipants(array);
        orderRanking(array);
    }

    function orderRanking(participants: ParticipantRankingProps){
        let list = participants;
        list.sort((a,b) => {
            if(a.pts > b.pts){
                return 1;
            }else {
                if(b.pts > a.pts){
                    return -1;
                }else{
                    return 0;
                }
            }
        })

        setParticipants(list.reverse());
    }

    return(
        <VStack flex={1} bg='gray.900'>
            <Header 
                title={poolDetails.title} 
                showBackButton 
                showShareButton
                onShare={handleCodeShare}
            />
            {poolDetails._count?.participants > 0 ? (
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails}/>
                    <HStack bgColor='gray.800' p={1} rounded="sm" mb={5}>
                        <Option 
                            title="Seus palpites" 
                            isSelected={optionSelected === 'Seus Palpites'}
                            onPress={() => setOptionSelected('Seus Palpites')}
                        />
                        <Option 
                            title="Ranking do grupo" 
                            isSelected={optionSelected === 'Ranking do grupo'}
                            onPress={() => setOptionSelected('Ranking do grupo')}
                        />
                    </HStack>

                    {optionSelected === 'Seus Palpites' ? (
                        // <KeyboardAvoidingView
                        //     style={{width: '100%'}}
                        //     behavior='height'
                        //     keyboardVerticalOffset={100}
                        // >
                        // </KeyboardAvoidingView>
                            <Guesses poolId={poolDetails.id}/>
                    ) : (
                        <FlatList
                            data={participants}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => (
                                <RankingCard data={item}/>
                            )}
                            contentContainerStyle={{paddingBottom:240}}
                        />
                    )}
                </VStack>
            ) : (
                <EmptyMyPoolList code={poolDetails.code} />
            )}
            {loading && (<Loading/>)}
        </VStack>
    )
}