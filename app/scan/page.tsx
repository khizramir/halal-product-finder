"use client";
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let stream: MediaStream;

    async function initScanner() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        codeReader.decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
          if (result) {
            const text = result.getText();
            // Navigate to product page with barcode
            router.push(`/product/${encodeURIComponent(text)}`);
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
            setError('Error decoding barcode');
          }
        });
      } catch (err) {
        setError('Unable to access camera. Please allow camera permissions or enter barcode manually.');
        console.error(err);
      }
    }
    initScanner();
    return () => {
      codeReader.reset();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [router]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Scan a Product Barcode</h2>
      {error && <p className="text-red-600">{error}</p>}
      <video ref={videoRef} className="w-full max-w-md mx-auto border rounded" />
      <p className="text-sm text-gray-600">Point your camera at a product barcode to scan. If scanning fails, you can manually enter the barcode in the search bar on the home page.</p>
    </div>
  );
}