'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scan, Loader2 } from 'lucide-react';

export default function BarcodeScanner() {
    const [barcode, setBarcode] = useState('');
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<any>(null);

    const scanBarcode = async () => {
        if (!barcode) return;

        setScanning(true);

        // Simulate API call to Open Food Facts
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock result
        setResult({
            name: 'Yaourt grec nature',
            brand: 'Fage Total',
            calories: 97,
            protein: 10,
            carbs: 4,
            fat: 5,
            serving: '100g'
        });

        setScanning(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Scan className="h-5 w-5" />
                    Scanner Code-Barres
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Entrez le code-barres..."
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && scanBarcode()}
                    />
                    <Button onClick={scanBarcode} disabled={scanning || !barcode}>
                        {scanning ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Scan className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {result && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-2">
                        <h3 className="font-bold text-lg text-green-900">{result.name}</h3>
                        <p className="text-sm text-green-700">{result.brand} - {result.serving}</p>
                        <div className="grid grid-cols-4 gap-2 mt-3">
                            <div className="text-center p-2 bg-white rounded">
                                <p className="text-2xl font-bold text-purple-600">{result.calories}</p>
                                <p className="text-xs text-gray-600">kcal</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded">
                                <p className="text-2xl font-bold text-blue-600">{result.protein}g</p>
                                <p className="text-xs text-gray-600">Prot</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded">
                                <p className="text-2xl font-bold text-orange-600">{result.carbs}g</p>
                                <p className="text-xs text-gray-600">Gluc</p>
                            </div>
                            <div className="text-center p-2 bg-white rounded">
                                <p className="text-2xl font-bold text-yellow-600">{result.fat}g</p>
                                <p className="text-xs text-gray-600">Lip</p>
                            </div>
                        </div>
                        <Button className="w-full mt-3" variant="default">
                            Ajouter au journal
                        </Button>
                    </div>
                )}

                <div className="text-xs text-gray-500 text-center">
                    💡 Astuce : Scannez le code-barres ou entrez-le manuellement
                </div>
            </CardContent>
        </Card>
    );
}
