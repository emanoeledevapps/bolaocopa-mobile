import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {PlusCircle, SoccerBall, User} from 'phosphor-react-native';
import {useTheme} from 'native-base';

const {Navigator, Screen} = createBottomTabNavigator();

import {New} from '../screens/New';
import {Pools} from '../screens/Pools';
import {Find} from '../screens/Find';
import {Details} from '../screens/Details';
import {Me} from '../screens/Me';

export function AppRoutes(){
    const {colors} = useTheme();
    return(
        <Navigator 
            screenOptions={{
                headerShown: false,
                tabBarLabelPosition: 'beside-icon',
                tabBarActiveTintColor: colors.yellow[500],
                tabBarInactiveTintColor: colors.gray[300],
                tabBarStyle:{
                    position: 'absolute',
                    height: 87,
                    borderTopWidth: 0,
                    backgroundColor: colors.gray[800]
                },
                tabBarItemStyle:{
                    position: 'relative',
                    
                }
            }}
        >
            <Screen 
                name='Pools' 
                component={Pools}
                options={{
                    tabBarIcon: ({color}) => <SoccerBall color={color}/>,
                    tabBarLabel:"Bolões"
                }}
            />
            
            <Screen 
                name='New' 
                component={New}
                options={{
                    tabBarIcon: ({color}) => <PlusCircle color={color}/>,
                    tabBarLabel:"Criar bolão"
                }}
            />

            <Screen 
                name='Me' 
                component={Me}
                options={{
                    tabBarIcon: ({color}) => <User color={color}/>,
                    tabBarLabel:"Perfil"
                }}
            />
            
            <Screen 
                name='Find' 
                component={Find}
                options={{tabBarButton: () => null}}
            />

            <Screen 
                name='details' 
                component={Details}
                options={{tabBarButton: () => null}}
            />
        </Navigator>
    )
}