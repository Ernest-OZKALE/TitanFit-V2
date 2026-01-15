'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scan, Loader2, X, Camera, Search, CheckCircle } from 'lucide-react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { toast } from 'sonner';

interface BarcodeScannerProps {
    onDetected?: (product: any) => void;
    onClose?: () => void;
    isSaving?: boolean;
}

export default function BarcodeScanner({ onDetected, onClose, isSaving = false }: BarcodeScannerProps) {
    const [barcode, setBarcode] = useState('');
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (isCameraOpen && !scannerRef.current) {
            // Initialize Scanner
            const scanner = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8],
                    aspectRatio: 1.0
                },
                /* verbose= */ false
            );

            scanner.render(
                (decodedText) => {
                    handleScanSuccess(decodedText);
                },
                (errorMessage) => {
                    // console.log(errorMessage); // Ignore parse errors
                }
            );

            scannerRef.current = scanner;
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
                scannerRef.current = null;
            }
        };
    }, [isCameraOpen]);

    const handleScanSuccess = async (code: string) => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error);
            setIsCameraOpen(false);
        }
        setBarcode(code);
        fetchProduct(code);
    };

    const fetchProduct = async (code: string) => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
            const data = await response.json();

            if (data.status === 1) {
                const product = data.product;
                const formattedResult = {
                    name: product.product_name,
                    brand: product.brands,
                    image: product.image_url,
                    calories: Math.round(product.nutriments?.['energy-kcal_100g'] || 0),
                    protein: product.nutriments?.proteins_100g || 0,
                    carbs: product.nutriments?.carbohydrates_100g || 0,
                    fat: product.nutriments?.fat_100g || 0,
                    serving: product.serving_size || '100g',
                    nutriscore: product.nutriscore_grade?.toUpperCase() || '?'
                };
                setResult(formattedResult);
                toast.success('Produit trouvé !');
            } else {
                toast.error('Produit inconnu dans la base OpenFoodFacts.');
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lours de la récupération des données.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <Scan className="h-5 w-5 text-[#D4AF37]" />
                        <span>Scanner IA</span>
                    </div>
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-gray-400 hover:text-white">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                {/* Manual Input or Camera Trigger */}
                {!isCameraOpen && !result && (
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => setIsCameraOpen(true)}
                            className="w-full h-12 bg-[#D4AF37] hover:bg-[#b0912d] text-black font-bold text-lg flex items-center justify-center gap-2"
                        >
                            <Camera className="w-5 h-5" />
                            Ouvrir Caméra
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0A0A0A] px-2 text-gray-500">ou code manuel</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ex: 3017620422003"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchProduct(barcode)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                            <Button onClick={() => fetchProduct(barcode)} disabled={!barcode || isLoading} className="bg-white/10 hover:bg-white/20">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Camera Viewport */}
                {isCameraOpen && (
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-square border border-white/10">
                        <div id="reader" className="w-full h-full" />
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setIsCameraOpen(false)}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
                        >
                            Arrêter
                        </Button>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && !isCameraOpen && (
                    <div className="py-8 flex flex-col items-center justify-center text-gray-400 animate-pulse">
                        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-2" />
                        <p className="text-xs">Analyse du produit...</p>
                    </div>
                )}

                {/* SCAN RESULT */}
                {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden">
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="flex gap-4 relative z-10">
                                {result.image ? (
                                    <img src={result.image} alt={result.name} className="w-16 h-16 object-contain rounded-lg bg-white p-1" />
                                ) : (
                                    <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                                        <Scan className="w-8 h-8 text-gray-500" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-white leading-tight">{result.name}</h3>
                                    <p className="text-sm text-[#D4AF37]">{result.brand}</p>
                                    <p className="text-xs text-gray-400 mt-1">{result.serving}</p>
                                </div>
                            </div>
                        </div>

                        {/* Macros Grid */}
                        <div className="grid grid-cols-4 gap-2">
                            <div className="p-3 bg-white/5 rounded-lg text-center border border-white/5">
                                <span className="block text-xs text-gray-400">Kcal</span>
                                <span className="block text-xl font-black text-white">{result.calories}</span>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-lg text-center border border-blue-500/20">
                                <span className="block text-xs text-blue-300">Prot</span>
                                <span className="block text-xl font-black text-blue-400">{Math.round(result.protein)}g</span>
                            </div>
                            <div className="p-3 bg-orange-500/10 rounded-lg text-center border border-orange-500/20">
                                <span className="block text-xs text-orange-300">Gluc</span>
                                <span className="block text-xl font-black text-orange-400">{Math.round(result.carbs)}g</span>
                            </div>
                            <div className="p-3 bg-yellow-500/10 rounded-lg text-center border border-yellow-500/20">
                                <span className="block text-xs text-yellow-300">Lip</span>
                                <span className="block text-xl font-black text-yellow-400">{Math.round(result.fat)}g</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                                onClick={() => {
                                    setResult(null);
                                    setBarcode('');
                                }}
                            >
                                Scanner un autre
                            </Button>
                            <Button
                                className="flex-1 bg-[#D4AF37] hover:bg-[#b0912d] text-black font-bold"
                                disabled={isSaving}
                                onClick={() => {
                                    if (onDetected) onDetected(result);
                                }}
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                )}
                                {isSaving ? 'Enregistrement...' : 'Ajouter'}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
