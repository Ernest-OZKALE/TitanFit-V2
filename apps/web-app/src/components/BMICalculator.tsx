'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

export default function BMICalculator() {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [result, setResult] = useState<{ bmi: number; category: string; bodyFat: number } | null>(null);

    const calculateBMI = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height) / 100; // cm to m
        const a = parseInt(age);

        if (!w || !h || !a) return;

        const bmi = w / (h * h);

        let category = '';
        if (bmi < 18.5) category = 'Sous-poids';
        else if (bmi < 25) category = 'Poids normal';
        else if (bmi < 30) category = 'Surpoids';
        else category = 'Obésité';

        // Simplified body fat estimation (Deurenberg formula)
        const bodyFat = (1.20 * bmi) + (0.23 * a) - (10.8 * (gender === 'male' ? 1 : 0)) - 5.4;

        setResult({ bmi, category, bodyFat });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calculateur IMC & Body Fat
                </CardTitle>
                <CardDescription>Calculez votre indice de masse corporelle et pourcentage de graisse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="weight">Poids (kg)</Label>
                        <Input
                            id="weight"
                            type="number"
                            placeholder="70"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Taille (cm)</Label>
                        <Input
                            id="height"
                            type="number"
                            placeholder="175"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="age">Âge</Label>
                        <Input
                            id="age"
                            type="number"
                            placeholder="25"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Sexe</Label>
                        <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Homme</SelectItem>
                                <SelectItem value="female">Femme</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button onClick={calculateBMI} className="w-full">
                    Calculer
                </Button>

                {result && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">IMC :</span>
                            <span className="text-2xl font-bold text-purple-600">{result.bmi.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Catégorie :</span>
                            <span className="text-sm font-semibold text-purple-700">{result.category}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Body Fat estimé :</span>
                            <span className="text-lg font-bold text-purple-600">{result.bodyFat.toFixed(1)}%</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 pt-2 border-t">
                            Note : Ce calcul est une estimation. Consultez un professionnel pour une évaluation précise.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
