import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Erreur', error.message);
            setLoading(false);
        } else {
            // Login successful
            // The RootLayout auth listener will update state, but we might want to manually push
            // However, usually we listen to state change.
            // For now, let's just let the user know or wait for redirect logic elsewhere.
            // But typically we should redirect manually if the state doesn't auto-redirect.
            setLoading(false);
            router.replace('/(tabs)');
        }
    }

    async function signUpWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            Alert.alert('Erreur', error.message);
        } else {
            Alert.alert('Inscription', 'Vérifiez vos emails pour confirmer !');
        }
        setLoading(false);
    }

    return (
        <SafeAreaView className="flex-1 bg-black p-6 justify-center">
            <Stack.Screen options={{ title: 'Connexion', headerTintColor: '#D4AF37', headerStyle: { backgroundColor: 'black' } }} />

            <View className="mb-8">
                <Text className="text-3xl font-bold text-white mb-2">Bon Retour</Text>
                <Text className="text-gray-400">Entrez dans l'arène TitanFit.</Text>
            </View>

            <View className="space-y-4 gap-4">
                <View>
                    <Text className="text-gray-400 mb-1 ml-1 text-xs uppercase font-bold">Email</Text>
                    <TextInput
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="titan@exemple.com"
                        placeholderTextColor="#666"
                        autoCapitalize="none"
                        className="bg-white/10 border border-white/10 rounded-xl p-4 text-white text-base"
                    />
                </View>

                <View>
                    <Text className="text-gray-400 mb-1 ml-1 text-xs uppercase font-bold">Mot de passe</Text>
                    <TextInput
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder="••••••••"
                        placeholderTextColor="#666"
                        autoCapitalize="none"
                        className="bg-white/10 border border-white/10 rounded-xl p-4 text-white text-base"
                    />
                </View>
            </View>

            <View className="mt-8 gap-4">
                <TouchableOpacity
                    disabled={loading}
                    onPress={signInWithEmail}
                    className="w-full h-14 bg-titanium-500 rounded-xl items-center justify-center active:scale-95 transition-transform"
                >
                    {loading ? <ActivityIndicator color="black" /> : <Text className="text-black font-bold text-lg uppercase">Se connecter</Text>}
                </TouchableOpacity>

                <TouchableOpacity disabled={loading} onPress={signUpWithEmail} className="items-center">
                    <Text className="text-gray-400">Pas encore de compte ? <Text className="text-titanium-500 font-bold">S'inscrire</Text></Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
