import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ScanItem {
    data: string;
    timestamp: Date;
    source: string;
    id: number;
}

export default function useScanner() {
    const [scanData, setScanData] = useState<ScanItem[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [lastScanTime, setLastScanTime] = useState(0);
    const [scanBuffer, setScanBuffer] = useState("");
    const [scanTimeout, setScanTimeout] = useState<NodeJS.Timeout | null>(null);
    const [latestScanData, setLatestScanData] = useState<ScanItem | null>(null);

    useEffect(() => {
        const handleFocus = () => setIsListening(true);
        const handleBlur = () => setIsListening(false);

        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);
        setIsListening(document.hasFocus());

        return () => {
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
        };
    }, []);

    const onScan = (callback: (scanItem: ScanItem) => void) => {
        if (!latestScanData) return;
        return callback?.(latestScanData);
    };

    const addScanData = (data: string, source: string) => {
        const scanItem = {
            data,
            timestamp: new Date(),
            source,
            id: Date.now(),
        };
        setScanData((prev) => [...prev, scanItem]);
        setLatestScanData(scanItem);
        // toast.success(`Scanned: ${data}`);
    };

    const getScanDataById = (): ScanItem | undefined => {
        return scanData[scanData.length - 1];
    };

    const removeScanData = (id: number) => {
        setScanData((prev) => prev.filter((item) => item.id !== id));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (!isListening) return;
        if ((event.target as HTMLElement).tagName === "INPUT" || (event.target as HTMLElement).tagName === "TEXTAREA") return;

        if (event.key === "Enter") {
            event.preventDefault();
            if (scanBuffer.trim()) {
                addScanData(scanBuffer.trim(), "Global Scanner");
                setScanBuffer("");
            }
            return;
        }

        if (event.key.length === 1) {
            const currentTime = Date.now();
            if (currentTime - lastScanTime > 100) {
                setScanBuffer("");
            }
            setLastScanTime(currentTime);
            setScanBuffer((prev) => prev + event.key);
        }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
        if (!isListening) return;
        if ((event.target as HTMLElement).tagName === "INPUT" || (event.target as HTMLElement).tagName === "TEXTAREA") return;

        if (scanTimeout) {
            clearTimeout(scanTimeout);
        }

        const timeout = setTimeout(() => {
            if (scanBuffer.trim()) {
                const currentTime = Date.now();
                if (currentTime - lastScanTime > 500) {
                    addScanData(scanBuffer.trim(), "Global Scanner (Auto)");
                    setScanBuffer("");
                }
            }
        }, 50);

        setScanTimeout(timeout);
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [isListening, scanBuffer, lastScanTime]);

    return { scanData, isListening, removeScanData, getScanDataById, onScan };
}
