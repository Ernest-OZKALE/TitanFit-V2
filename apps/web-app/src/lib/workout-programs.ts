// Programmes d'entraînement prédéfinis

export const workoutPrograms = {
    pushPullLegs: {
        name: "Push / Pull / Legs",
        description: "Programme classique 3 jours avec focus groupes musculaires",
        schedule: [
            {
                day: "Push (Poussée)",
                exercises: [
                    { name: "Développé couché", sets: 4, reps: "8-10", rest: 90 },
                    { name: "Développé incliné haltères", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Dips", sets: 3, reps: "10-15", rest: 60 },
                    { name: "Développé épaules haltères", sets: 4, reps: "8-10", rest: 90 },
                    { name: "Élévations latérales", sets: 3, reps: "12-15", rest: 45 },
                    { name: "Extension triceps poulie", sets: 3, reps: "12-15", rest: 45 },
                ]
            },
            {
                day: "Pull (Tirage)",
                exercises: [
                    { name: "Traction pronation", sets: 4, reps: "8-12", rest: 90 },
                    { name: "Rowing barre", sets: 4, reps: "8-10", rest: 90 },
                    { name: "Tirage horizontal poulie", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Curl barre EZ", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Curl haltères marteau", sets: 3, reps: "12-15", rest: 45 },
                    { name: "Face pull", sets: 3, reps: "15-20", rest: 45 },
                ]
            },
            {
                day: "Legs (Jambes)",
                exercises: [
                    { name: "Squat", sets: 4, reps: "8-10", rest: 120 },
                    { name: "Leg press", sets: 4, reps: "10-12", rest: 90 },
                    { name: "Soulevé de terre roumain", sets: 3, reps: "10-12", rest: 90 },
                    { name: "Leg curl", sets: 3, reps: "12-15", rest: 60 },
                    { name: "Leg extension", sets: 3, reps: "12-15", rest: 60 },
                    { name: "Mollets debout", sets: 4, reps: "15-20", rest: 45 },
                ]
            }
        ]
    },
    fullBody: {
        name: "Full Body",
        description: "Programme complet 3x par semaine pour débutants",
        schedule: [
            {
                day: "Séance A",
                exercises: [
                    { name: "Squat", sets: 3, reps: "10-12", rest: 90 },
                    { name: "Développé couché", sets: 3, reps: "10-12", rest: 90 },
                    { name: "Rowing barre", sets: 3, reps: "10-12", rest: 90 },
                    { name: "Développé militaire", sets: 3, reps: "8-10", rest: 60 },
                    { name: "Curl biceps", sets: 2, reps: "12-15", rest: 45 },
                    { name: "Extension triceps", sets: 2, reps: "12-15", rest: 45 },
                ]
            },
            {
                day: "Séance B",
                exercises: [
                    { name: "Soulevé de terre", sets: 3, reps: "8-10", rest: 120 },
                    { name: "Développé incliné", sets: 3, reps: "10-12", rest: 90 },
                    { name: "Traction", sets: 3, reps: "max", rest: 90 },
                    { name: "Leg press", sets: 3, reps: "12-15", rest: 90 },
                    { name: "Élévations latérales", sets: 3, reps: "12-15", rest: 45 },
                    { name: "Abdominaux", sets: 3, reps: "15-20", rest: 45 },
                ]
            }
        ]
    },
    upperLower: {
        name: "Upper / Lower",
        description: "4 jours : 2x haut du corps, 2x bas du corps",
        schedule: [
            {
                day: "Upper A (Haut 1)",
                exercises: [
                    { name: "Développé couché", sets: 4, reps: "6-8", rest: 120 },
                    { name: "Rowing barre", sets: 4, reps: "6-8", rest: 120 },
                    { name: "Développé militaire", sets: 3, reps: "8-10", rest: 90 },
                    { name: "Traction", sets: 3, reps: "8-12", rest: 90 },
                    { name: "Curl biceps", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Dips triceps", sets: 3, reps: "10-12", rest: 60 },
                ]
            },
            {
                day: "Lower A (Bas 1)",
                exercises: [
                    { name: "Squat", sets: 4, reps: "6-8", rest: 150 },
                    { name: "Soulevé de terre roumain", sets: 3, reps: "8-10", rest: 120 },
                    { name: "Leg press", sets: 3, reps: "10-12", rest: 90 },
                    { name: "Leg curl", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Mollets", sets: 4, reps: "12-15", rest: 45 },
                ]
            },
            {
                day: "Upper B (Haut 2)",
                exercises: [
                    { name: "Développé incliné haltères", sets: 4, reps: "8-10", rest: 90 },
                    { name: "Tirage horizontal", sets: 4, reps: "8-10", rest: 90 },
                    { name: "Développé Arnold", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Rowing haltères", sets: 3, reps: "10-12", rest: 60 },
                    { name: "Cable fly", sets: 3, reps: "12-15", rest: 45 },
                    { name: "Face pull", sets: 3, reps: "15-20", rest: 45 },
                ]
            },
            {
                day: "Lower B (Bas 2)",
                exercises: [
                    { name: "Front squat", sets: 4, reps: "8-10", rest: 120 },
                    { name: "Fentes marchées", sets: 3, reps: "10/jambe", rest: 90 },
                    { name: "Leg extension", sets: 3, reps: "12-15", rest: 60 },
                    { name: "Soulevé de terre jambes tendues", sets: 3, reps: "10-12", rest: 90 },
                    { name: "Hip thrust", sets: 3, reps: "12-15", rest: 60 },
                ]
            }
        ]
    }
};

export type WorkoutProgramType = keyof typeof workoutPrograms;
