// PWA Manifest configuration

export const manifestConfig = {
    name: "TitanFit V2",
    short_name: "TitanFit",
    description: "Votre application de fitness tout-en-un avec coach IA",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#9333ea",
    orientation: "portrait",
    icons: [
        {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
        },
        {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
        }
    ],
    categories: ["health", "fitness", "lifestyle"],
    shortcuts: [
        {
            name: "Log Meal",
            short_name: "Repas",
            description: "Enregistrer un repas rapidement",
            url: "/log-meal",
            icons: [{ src: "/icon-meal.png", sizes: "96x96" }]
        },
        {
            name: "Log Workout",
            short_name: "Workout",
            description: "Logger un entraînement",
            url: "/log-workout",
            icons: [{ src: "/icon-workout.png", sizes: "96x96" }]
        },
        {
            name: "AI Coach",
            short_name: "Coach",
            description: "Parler au coach IA",
            url: "/ai-coach",
            icons: [{ src: "/icon-ai.png", sizes: "96x96" }]
        }
    ]
};
