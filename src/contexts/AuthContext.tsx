import { createContext, ReactNode, useState, useEffect } from "react";
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {api} from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

interface UserProps{
    name: string;
    email: string;
    avatarUrl: string;
    sub?: string;
    exp?: number;
    iat?: number
}

interface SignInEmailAndPasswordProps{
    email: string;
    password: string;
}

interface SignUpEmailAndPasswordProps{
    name: string;
    email: string;
    password: string;
}

export interface AuthContextDataProps{
    user: UserProps;
    isUserLoading: boolean;
    signInGoogle: () => Promise<void>;
    signInEmailAndPassword: ({email, password}:SignInEmailAndPasswordProps) => Promise<String | Object>;
    signUpEmailAndPassword: ({name, email, password}:SignUpEmailAndPasswordProps) => Promise<String | Object>;
    logOut: () => Promise<void>;
}

interface AuthProviderProps{
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthProviderProps){
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [user, setUser] = useState<UserProps>({} as UserProps);

    useEffect(() => {
        getUserToken();
    }, []);

    async function getUserToken(){
        try{
            setIsUserLoading(true);
            const value = await AsyncStorage.getItem('@user_token');
            if(value !== null){
                api.defaults.headers.common['Authorization'] = `Bearer ${value}`;
                getUserInfo();
            }
        }catch(err){
            console.log(err);
        }finally{
            setIsUserLoading(false);
        }
    }

    async function setUserToken(token: string){
        try{
            await AsyncStorage.setItem('@user_token', token);
        }catch(err){
            console.log(err);
        }
    }

    async function signInEmailAndPassword({email, password}: SignInEmailAndPasswordProps){
        try{
            setIsUserLoading(true);
            if(!email.trim() || !password.trim()){
                return "Preencha todos os campos!"
            }

            const response = await api.post('/auth/sign_in', {email: email, password: password});
            if(response.data.token){
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                setUserToken(response.data.token);
                getUserInfo();
                return 'ok';
            }
        }catch(err){
            return err.response?.data?.message;

        }finally{
            setIsUserLoading(false);
        }
    }

    async function getUserInfo(){
        try{
            setIsUserLoading(true);
            const userInfoResponse = await api.get('/me');
            setUser(userInfoResponse.data.user);
        }catch(err){
            console.log(err);
        }finally{
            setIsUserLoading(false);
        }
    }

    async function signUpEmailAndPassword({name, email, password}: SignUpEmailAndPasswordProps){
        try{
            setIsUserLoading(true);
            const response = await api.post('/auth/sign_up', {name: name, email: email, password: password});
            console.log(response);
            return 'cadastrado';
        }catch(err){
            return err.response?.data?.message;
        }finally{
            setIsUserLoading(false);
        }
    }

    const [req, res, promptAsync] = Google.useAuthRequest({
        clientId: '393255033286-k0it1eqbpmh8fhr6qdcqmbc9c3vfh9ei.apps.googleusercontent.com',
        redirectUri: 'https://auth.expo.io/@emanoel.augusto/nlwcopamobile',
        scopes: ['profile', 'email']
    })
    async function signInGoogle(){
        try{
            setIsUserLoading(true);
            await promptAsync();
        }catch(err){
            console.log(err);
            throw err;
        }finally{
            setIsUserLoading(false);
        }
    }

    async function singInWithGoogle(access_token: string){
        try{
            setIsUserLoading(true);
            const tokenResponse = await api.post('/users', {access_token});
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;

            const userInfoResponse = await api.get('/me');
            setUser(userInfoResponse.data.user);
           
        }catch(err){
            console.log(err);
            throw err;
        }finally{
            setIsUserLoading(false);
        }
    } 
    useEffect(() => {
        if(res?.type === 'success' && res?.authentication?.accessToken){
            singInWithGoogle(res.authentication.accessToken)
        }
    }, [res])

    async function logOut(){
        await AsyncStorage.clear()
        setUser({} as UserProps);
    }

    return(
        <AuthContext.Provider value={{
            signInGoogle,
            signInEmailAndPassword,
            signUpEmailAndPassword,
            logOut,  
            user,
            isUserLoading,
        }}>
            {children}
        </AuthContext.Provider>
    )
}