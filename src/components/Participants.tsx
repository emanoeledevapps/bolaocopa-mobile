import { Avatar, Center, HStack, Text } from 'native-base';

export interface ParticipantProps {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  guesses: GuessesProps[]
};

export interface GuessesProps{
  firstTeamPoints: number;
  secondTeamPoints: number;
  game:{
    id: string;
    date: string;
    firstTeamCountryCode: string;
    secondTeamCountryCode: string;
    firstTeamPoints: number
    secondTeamPoints: number;
  }
}

interface Props {
  participants: ParticipantProps[];
  count: number;
};

export function Participants({participants, count }: Props) {
  return (
    <HStack>
      {
        participants && participants.map((participant) => (
          <Avatar
            key={participant.id}
            //source={{ uri: participant.user.avatarUrl}}
            source={participant.user.avatarUrl === null ? 
              {uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
              :
              {uri: participant.user.avatarUrl}
            }
            w={8}
            h={8}
            rounded="full"
            borderWidth={2}
            marginRight={-3}
            borderColor="gray.800"
          >
           {/* {participant.user?.name?.at(0).toUpperCase()} */}
          </Avatar>
        ))
      }

      <Center w={8} h={8} bgColor="gray.700" rounded="full" borderWidth={1} borderColor="gray.800">
        <Text color="gray.100" fontSize="xs" fontFamily="medium">
          {count ? `+${count}` : 0}
        </Text>
      </Center>
    </HStack>
  );
}