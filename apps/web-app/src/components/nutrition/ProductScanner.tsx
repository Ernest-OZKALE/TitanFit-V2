'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { ScanBarcode, X, Loader2, AlertCircle, Camera, Smartphone } from 'lucide-react';
import { fetchProductByBarcode } from '@/lib/openfoodfacts';
import { ScannedProduct } from '@/lib/recipe-database';
import { ProductDetail } from './ProductDetail';
import { AnimatePresence, motion } from 'framer-motion';

export function ProductScanner() {
    const [isScanning, setIsScanning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [permissionError, setPermissionError] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Determines if we render the portal
    useEffect(() => { setMounted(true); }, []);

    // Scanner Logic
    useEffect(() => {
        let html5QrCode: Html5Qrcode | null = null;

        if (isScanning && mounted) {
            document.body.style.overflow = 'hidden';

            // Allow DOM to propagate
            const timer = setTimeout(async () => {
                try {
                    html5QrCode = new Html5Qrcode("reader");

                    await html5QrCode.start(
                        { facingMode: "environment" }, // Force Rear Camera
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 },
                            aspectRatio: 1
                        },
                        (decodedText) => {
                            handleScan(decodedText, html5QrCode);
                        },
                        (errorMessage) => {
                            // ignore frame errors
                        }
                    );
                } catch (err) {
                    console.error("Camera start error", err);
                    setPermissionError(true);
                }
            }, 500); // 500ms delay to ensure DOM is ready and transition is done

            return () => {
                clearTimeout(timer);
                if (html5QrCode && html5QrCode.isScanning) {
                    html5QrCode.stop().then(() => html5QrCode?.clear()).catch(console.error);
                }
                document.body.style.overflow = '';
            };
        } else {
            document.body.style.overflow = '';
        }
    }, [isScanning, mounted]);

    const handleScan = async (decodedText: string, scannerInstance: Html5Qrcode | null) => {
        if (isLoading) return;

        // Stop scanning
        setIsScanning(false);
        if (scannerInstance) {
            scannerInstance.stop().then(() => scannerInstance.clear()).catch(console.error);
        }

        setIsLoading(true);
        setError(null);

        try {
            const product = await fetchProductByBarcode(decodedText);
            if (product) {
                setScannedProduct(product);
                const history = JSON.parse(localStorage.getItem('titan_scan_history') || '[]');
                localStorage.setItem('titan_scan_history', JSON.stringify([product, ...history].slice(0, 50)));
            } else {
                setError(`Produit inconnu (${decodedText})`);
            }
        } catch (e) {
            setError("Erreur de connexion.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseDetail = () => {
        setScannedProduct(null);
        setError(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <AnimatePresence>
                {scannedProduct && (
                    <ProductDetail product={scannedProduct} onClose={handleCloseDetail} />
                )}
            </AnimatePresence>

            {!isScanning && !scannedProduct && (
                <div className="text-center space-y-6 max-w-sm px-4">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden group">
                        <ScanBarcode className="w-10 h-10 text-slate-400 group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 border-2 border-dashed border-slate-300 rounded-full animate-[spin_10s_linear_infinite]" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">SCANNER TITAN</h2>
                        <p className="text-slate-500 text-sm">Détecteur de qualité nutritionnelle instantané. <br />Caméra arrière uniquement.</p>
                    </div>

                    <button
                        onClick={() => { setError(null); setPermissionError(false); setIsScanning(true); }}
                        className="w-full py-4 bg-[#FF4D00] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Camera className="w-5 h-5" />
                        LANCER LA CAMÉRA
                    </button>

                    {isLoading && (
                        <div className="flex items-center justify-center gap-2 text-slate-500 mt-4">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm font-medium">Analyse du code-barres...</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm font-medium flex items-center gap-2 text-left">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}
                </div>
            )}

            {isScanning && mounted && createPortal(
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black z-[20000] flex flex-col"
                >
                    {/* Header Controls */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-[20002]">
                        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <p className="text-white font-bold text-sm flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-[#FF4D00]" />
                                TITAN SCAN
                            </p>
                        </div>
                        <button
                            onClick={() => setIsScanning(false)}
                            className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Camera Area */}
                    <div className="relative flex-1 bg-black flex flex-col justify-center overflow-hidden">

                        {permissionError ? (
                            <div className="text-center p-8 text-white max-w-xs mx-auto">
                                <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Camera className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Caméra Bloquée</h3>
                                <p className="text-sm text-white/60 mb-6">L'accès à la caméra est refusé. Vérifiez vos réglages navigateur.</p>
                                <button onClick={() => setIsScanning(false)} className="px-6 py-2 bg-white text-black font-bold rounded-xl">Fermer</button>
                            </div>
                        ) : (
                            // The Reader Div
                            <div id="reader" className="w-full h-full object-cover" />
                        )}

                        {/* Scan UI Overlay */}
                        {!permissionError && (
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[20001]">
                                {/* Reticle */}
                                <div className="w-[280px] h-[280px] border-2 border-white/30 rounded-3xl relative">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FF4D00] rounded-tl-2xl -mt-1 -ml-1" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FF4D00] rounded-tr-2xl -mt-1 -mr-1" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FF4D00] rounded-bl-2xl -mb-1 -ml-1" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FF4D00] rounded-br-2xl -mb-1 -mr-1" />
                                    {/* Scan Line */}
                                    <div className="absolute left-4 right-4 h-0.5 bg-[#FF4D00] shadow-[0_0_20px_#FF4D00] top-1/2 animate-[scan_2s_ease-in-out_infinite]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Instructions */}
                    <div className="p-8 bg-black/80 backdrop-blur-xl text-white text-center pb-safe border-t border-white/10 z-[20002]">
                        <p className="font-bold text-lg mb-1">Scannez un code-barres</p>
                        <p className="text-white/40 text-sm">Maintenez le produit stable</p>
                    </div>
                </motion.div>,
                document.body
            )}
        </div>
    );
}
