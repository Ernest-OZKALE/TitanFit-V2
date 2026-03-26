export type BodyView = 'front' | 'back';
export type BodyGender = 'male' | 'female';
export type BodyMode = 'beginner' | 'advanced';

export interface BodyMapProps {
    onMuscleSelect: (muscleId: string) => void;
    selectedMuscle: string | null;
    view: BodyView;
    mode: BodyMode;
    zoomZone: string | null;
    setZoomZone: (zone: string | null) => void;
}
