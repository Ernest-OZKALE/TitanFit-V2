import { Stack } from 'expo-router';
import { WorkoutCreateProvider } from '../../context/WorkoutCreateContext';

export default function WorkoutLayout() {
    return (
        <WorkoutCreateProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="create" options={{ presentation: 'modal' }} />
                <Stack.Screen name="select-exercise" options={{ presentation: 'modal' }} />
            </Stack>
        </WorkoutCreateProvider>
    );
}
