'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';

interface MealAnalysis {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    confidence: number;
}

export default function MealPhotoAnalyzer() {
    const [image, setImage] = useState<string>('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<MealAnalysis | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeMeal = async () => {
        if (!image) return;

        setAnalyzing(true);

        // Simulate AI analysis (in production, call real AI API)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock result
        setResult({
            name: "Poulet grillé avec riz et légumes",
            calories: 520,
            protein: 45,
            carbs: 52,
            fat: 12,
            confidence: 0.87
        });

        setAnalyzing(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Analyse Photo de Repas (IA)
                </CardTitle>
                <CardDescription>Photographiez votre assiette, l'IA estime les macros</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!image ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">Prenez ou uploadez une photo de votre repas</p>
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="meal-photo"
                        />
                        <label htmlFor="meal-photo">
                            <Button asChild>
                                <span>Choisir une Photo</span>
                            </Button>
                        </label>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <img src={image} alt="Meal" className="w-full h-64 object-cover rounded-lg" />

                        {!result && (
                            <Button
                                onClick={analyzeMeal}
                                disabled={analyzing}
                                className="w-full"
                            >
                                {analyzing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Analyse en cours...
                                    </>
                                ) : (
                                    'Analyser avec l\'IA'
                                )}
                            </Button>
                        )}

                        {result && (
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="font-semibold text-lg">{result.name}</span>
                                    <span className="text-sm text-gray-600">Confiance: {(result.confidence * 100).toFixed(0)}%</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-sm text-gray-600">Calories</p>
                                        <p className="text-2xl font-bold text-purple-600">{result.calories} kcal</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-sm text-gray-600">Protéines</p>
                                        <p className="text-2xl font-bold text-blue-600">{result.protein}g</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-sm text-gray-600">Glucides</p>
                                        <p className="text-2xl font-bold text-orange-600">{result.carbs}g</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-sm text-gray-600">Lipides</p>
                                        <p className="text-2xl font-bold text-yellow-600">{result.fat}g</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setImage('');
                                        setResult(null);
                                    }}
                                >
                                    Nouvelle Analyse
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
