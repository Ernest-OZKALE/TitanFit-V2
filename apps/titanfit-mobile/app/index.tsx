import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link, Redirect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { session, loading } = useAuth();

    if (!loading && session) {
        return <Redirect href="/(tabs)" />;
    }
    return (
        <SafeAreaView className="flex-1 bg-black items-center justify-center p-6">
            <View className="items-center mb-12">
                <Text className="text-white text-4xl font-black tracking-tighter">
                    Titan<Text className="text-titanium-500">Fit</Text>
                </Text>
                <Text className="text-gray-400 text-lg mt-2 font-light">
                    Mobile Edition
                </Text>
            </View>

            <View className="w-full space-y-4 gap-4">
                <Link href="/login" asChild>
                    <TouchableOpacity className="w-full h-14 bg-titanium-500 rounded-xl items-center justify-center shadow-lg shadow-amber-500/20 active:scale-95 transition-transform">
                        <Text className="text-black font-bold text-lg uppercase tracking-wider">
                            Commencer
                        </Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/login" asChild>
                    <TouchableOpacity className="w-full h-14 bg-white/10 border border-white/10 rounded-xl items-center justify-center active:bg-white/20">
                        <Text className="text-white font-medium text-lg">
                            Connexion
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <Text className="absolute bottom-10 text-gray-600 text-xs">
                v2.0.0 (Native)
            </Text>
        </SafeAreaView>
    );
}
