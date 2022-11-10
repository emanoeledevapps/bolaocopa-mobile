import { Box, useToast } from 'native-base';
import {useState, useEffect} from 'react';
import { api } from '../services/api';
import {Game, GameProps} from '../components/Game';
import {FlatList} from 'react-native';
import {Loading} from './Loading';

interface Props {
  poolId: string;
}

interface teste{
	firstTeamPoints: number;
	secondTeamPoints: number;
}

export function Guesses({ poolId }: Props) {
	const toast = useToast();
	const [loading, setLoading] = useState(false);
	const [games, setGames] = useState<GameProps[]>([]);

	useEffect(() => {
		fetchGames()
	}, [poolId]);

	async function fetchGames(){
		try{
            setLoading(true);
            const response = await api.get(`/pools/${poolId}/games`);
			setGames(response.data.games);
			console.log(response.data.games);
        }catch(err){
            console.log(err);
            return toast.show({
                title: 'Não foi possível carregar os jogos!',
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally{
            setLoading(false);
        }
	} 

	
	return (
		<Box>
			{loading ? (
				<Loading/>
			): (
				<FlatList
					data={games}
					keyExtractor={item => item.id}
					renderItem={({item}) => (
						<Game 
							data={item}
							poolId={poolId}
							fetchGames={() => fetchGames()}
						/>
					)}
					contentContainerStyle={{paddingBottom:240}}
				/>
			)}
		</Box>
	);
}
