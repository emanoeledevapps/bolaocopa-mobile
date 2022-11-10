import { Button, HStack, Text, useTheme, VStack, useToast } from 'native-base';
import { X, Check } from 'phosphor-react-native';
import { getName } from 'country-list';
import dayjs from 'dayjs';
import ptBR from 'dayjs/locale/pt-br';
import {useState, useEffect} from 'react';
import {Keyboard} from 'react-native';
import { Team } from './Team';
import {api} from '../services/api';
import { format, compareAsc }from 'date-fns';

interface GuessProps {
  id: string;
  gameId: string;
  createdAt: string;
  participantId: string;
  firstTeamPoints: number;
  secondTeamPoints: number;
}

export interface GameProps {
  id: string;
  firstTeamCountryCode: string;
  secondTeamCountryCode: string;
  guess: null | GuessProps;
  date: string;
};

interface Props {
  data: GameProps;
  poolId: string;
  fetchGames: () => void;
};

export function Game({ data, poolId, fetchGames}: Props) {
	const toast = useToast();
	const [loadingGuessConfirm, setLoadingGuessConfirm] = useState(false);
	const [firstTeamPoints, setFirstTeamPoints] = useState('');
	const [secondTeamPoints, setSecondTeamPoints] = useState('');
	const { colors, sizes } = useTheme();
	const [disablePalpite, setDisablePalpite] = useState(false);
	const dateGame = dayjs(data.date).locale(ptBR).format("DD [de] MMMM [de] YYYY [às] HH:00[h]");
	
	useEffect(() => {
		compareDate();
	}, [])

	async function compareDate(){
		const res = compareAsc(new Date(data.date), new Date());
		if(res === -1){
			setDisablePalpite(true);
		}
	}

	async function handleGuessConfirm(){
		try{
			if(!firstTeamPoints.trim() || !secondTeamPoints.trim()){
				return toast.show({
					title: 'Informe um placar para o palpite!',
					placement: 'top',
					bgColor: 'red.500'
				})
			}
			Keyboard.dismiss();
            setLoadingGuessConfirm(true);
            await api.post(`/pools/${poolId}/games/${data.id}/guesses`, {
				firstTeamPoints: Number(firstTeamPoints),
				secondTeamPoints: Number(secondTeamPoints)
			});

			toast.show({
                title: 'Palpite enviado!',
                placement: 'top',
                bgColor: 'green.500'
            })

			fetchGames()
			
        }catch(err){
            console.log(err);
            return toast.show({
                title: 'Não foi possível enviar o palpite!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally{
            setLoadingGuessConfirm(false);
        }
	}
	return (
		<VStack
		w="full"
		bgColor="gray.800"
		rounded="sm"
		alignItems="center"
		borderBottomWidth={3}
		borderBottomColor="yellow.500"
		mb={3}
		p={4}
		>
		<Text color="gray.100" fontFamily="heading" fontSize="sm">
			{getName(data.firstTeamCountryCode)} vs. {getName(data.secondTeamCountryCode)}
		</Text>

		<Text color="gray.200" fontSize="xs">
			{format(new Date(data.date), "dd 'de' MMMM 'de' yyyy 'às' kk'h'mm")}
		</Text>

		<HStack mt={4} w="full" justifyContent="space-between" alignItems="center">
			<Team
				code={data.firstTeamCountryCode}
				position="right"
				onChangeText={setFirstTeamPoints}
				value={data.guess ? String(data.guess.firstTeamPoints) : ''}
			/>

			<X color={colors.gray[300]} size={sizes[6]} />

			<Team
				code={data.secondTeamCountryCode}
				position="left"
				onChangeText={setSecondTeamPoints}
				value={data.guess ? String(data.guess.secondTeamPoints) : ''}
			/>
		</HStack>

		{
			!data.guess &&
			<Button 
			size="xs" 
			w="full" 
			bgColor={disablePalpite ? 'gray.700' : "green.500"} 
			mt={4} 
			onPress={handleGuessConfirm}
			isLoading={loadingGuessConfirm}
			disabled={disablePalpite}
			>
			<HStack alignItems="center">
				<Text color="white" fontSize="xs" fontFamily="heading" mr={3}>
				{disablePalpite ? 'TEMPO ESGOTADO' : 'CONFIRMAR PALPITE'}
				</Text>

				{!disablePalpite && (
					<Check color={colors.white} size={sizes[4]} />
				)}
			</HStack>
			</Button>
		}
		</VStack>
	);
}