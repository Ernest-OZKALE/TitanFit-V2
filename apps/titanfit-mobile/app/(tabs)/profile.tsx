import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Profile() {
    const { signOut, user } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-black p-6">
            <Text className="text-white text-3xl font-bold mb-8">Profil</Text>

            <View className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                <Text className="text-gray-400 text-xs uppercase mb-2">Email</Text>
                <Text className="text-white text-lg">{user?.email}</Text>
                <Text className="text-titanium-500 text-xs mt-2">Membre Élite</Text>
            </View>

            <TouchableOpacity
                onPress={handleSignOut}
                className="w-full h-14 bg-red-500/10 border border-red-500/20 rounded-xl items-center justify-center"
            >
                <Text className="text-red-500 font-bold uppercase">Se déconnecter</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
