/**
 * Web Bluetooth API - FREE Wearables Integration
 * Connects directly to Bluetooth fitness devices from the browser
 * 
 * Supported devices:
 * - Heart rate monitors (chest straps, arm bands)
 * - Cycling sensors (cadence, speed, power)
 * - Running sensors (foot pods)
 * - Some fitness watches that expose BLE services
 * 
 * No third-party service required!
 */

// Standard Bluetooth GATT Service UUIDs
export const BLE_SERVICES = {
    HEART_RATE: 'heart_rate', // 0x180D
    CYCLING_SPEED_CADENCE: 'cycling_speed_and_cadence', // 0x1816
    CYCLING_POWER: 'cycling_power', // 0x1818
    RUNNING_SPEED_CADENCE: 'running_speed_and_cadence', // 0x1814
    BATTERY: 'battery_service', // 0x180F
    DEVICE_INFO: 'device_information', // 0x180A
} as const;

// Characteristic UUIDs
export const BLE_CHARACTERISTICS = {
    HEART_RATE_MEASUREMENT: 'heart_rate_measurement', // 0x2A37
    BODY_SENSOR_LOCATION: 'body_sensor_location', // 0x2A38
    CSC_MEASUREMENT: 'csc_measurement', // 0x2A5B
    CSC_FEATURE: 'csc_feature', // 0x2A5C
    RSC_MEASUREMENT: 'rsc_measurement', // 0x2A53
    BATTERY_LEVEL: 'battery_level', // 0x2A19
} as const;

export interface BluetoothDevice {
    id: string;
    name: string;
    type: 'heart_rate' | 'cycling' | 'running' | 'unknown';
    connected: boolean;
    batteryLevel?: number;
}

export interface HeartRateData {
    heartRate: number;
    contactDetected?: boolean;
    energyExpended?: number; // kJ
    rrIntervals?: number[]; // ms
    timestamp: Date;
}

export interface CyclingData {
    wheelRevolutions?: number;
    wheelEventTime?: number;
    crankRevolutions?: number;
    crankEventTime?: number;
    speed?: number; // km/h
    cadence?: number; // rpm
    timestamp: Date;
}

export interface RunningData {
    speed: number; // m/s
    cadence: number; // steps/min
    strideLength?: number; // m
    totalDistance?: number; // m
    timestamp: Date;
}

type DataCallback<T> = (data: T) => void;

class BluetoothFitnessService {
    private heartRateDevice: BluetoothDevice | null = null;
    private cyclingDevice: BluetoothDevice | null = null;
    private runningDevice: BluetoothDevice | null = null;

    private heartRateCallback: DataCallback<HeartRateData> | null = null;
    private cyclingCallback: DataCallback<CyclingData> | null = null;
    private runningCallback: DataCallback<RunningData> | null = null;

    private lastWheelRevs = 0;
    private lastWheelTime = 0;
    private lastCrankRevs = 0;
    private lastCrankTime = 0;

    /**
     * Check if Web Bluetooth is supported
     */
    isSupported(): boolean {
        return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
    }

    /**
     * Connect to a heart rate monitor
     */
    async connectHeartRateMonitor(onData: DataCallback<HeartRateData>): Promise<BluetoothDevice> {
        if (!this.isSupported()) {
            throw new Error('Web Bluetooth non supporté sur ce navigateur');
        }

        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [BLE_SERVICES.HEART_RATE] }],
                optionalServices: [BLE_SERVICES.BATTERY, BLE_SERVICES.DEVICE_INFO],
            });

            const server = await device.gatt?.connect();
            if (!server) throw new Error('Impossible de se connecter au GATT server');

            const service = await server.getPrimaryService(BLE_SERVICES.HEART_RATE);
            const characteristic = await service.getCharacteristic(BLE_CHARACTERISTICS.HEART_RATE_MEASUREMENT);

            // Subscribe to heart rate notifications
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                const data = this.parseHeartRateData(event);
                if (data && this.heartRateCallback) {
                    this.heartRateCallback(data);
                }
            });

            this.heartRateCallback = onData;

            // Get battery level if available
            let batteryLevel: number | undefined;
            try {
                const batteryService = await server.getPrimaryService(BLE_SERVICES.BATTERY);
                const batteryChar = await batteryService.getCharacteristic(BLE_CHARACTERISTICS.BATTERY_LEVEL);
                const value = await batteryChar.readValue();
                batteryLevel = value.getUint8(0);
            } catch {
                // Battery service not available
            }

            this.heartRateDevice = {
                id: device.id,
                name: device.name || 'Heart Rate Monitor',
                type: 'heart_rate',
                connected: true,
                batteryLevel,
            };

            // Handle disconnection
            device.addEventListener('gattserverdisconnected', () => {
                if (this.heartRateDevice) {
                    this.heartRateDevice.connected = false;
                }
            });

            return this.heartRateDevice;

        } catch (error) {
            console.error('Heart rate connection error:', error);
            throw error;
        }
    }

    /**
     * Connect to a cycling sensor (speed/cadence)
     */
    async connectCyclingSensor(onData: DataCallback<CyclingData>): Promise<BluetoothDevice> {
        if (!this.isSupported()) {
            throw new Error('Web Bluetooth non supporté');
        }

        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [BLE_SERVICES.CYCLING_SPEED_CADENCE] }],
                optionalServices: [BLE_SERVICES.BATTERY],
            });

            const server = await device.gatt?.connect();
            if (!server) throw new Error('Connexion GATT impossible');

            const service = await server.getPrimaryService(BLE_SERVICES.CYCLING_SPEED_CADENCE);
            const characteristic = await service.getCharacteristic(BLE_CHARACTERISTICS.CSC_MEASUREMENT);

            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                const data = this.parseCyclingData(event);
                if (data && this.cyclingCallback) {
                    this.cyclingCallback(data);
                }
            });

            this.cyclingCallback = onData;

            this.cyclingDevice = {
                id: device.id,
                name: device.name || 'Cycling Sensor',
                type: 'cycling',
                connected: true,
            };

            return this.cyclingDevice;

        } catch (error) {
            console.error('Cycling sensor error:', error);
            throw error;
        }
    }

    /**
     * Connect to a running sensor (foot pod)
     */
    async connectRunningSensor(onData: DataCallback<RunningData>): Promise<BluetoothDevice> {
        if (!this.isSupported()) {
            throw new Error('Web Bluetooth non supporté');
        }

        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [BLE_SERVICES.RUNNING_SPEED_CADENCE] }],
            });

            const server = await device.gatt?.connect();
            if (!server) throw new Error('Connexion impossible');

            const service = await server.getPrimaryService(BLE_SERVICES.RUNNING_SPEED_CADENCE);
            const characteristic = await service.getCharacteristic(BLE_CHARACTERISTICS.RSC_MEASUREMENT);

            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                const data = this.parseRunningData(event);
                if (data && this.runningCallback) {
                    this.runningCallback(data);
                }
            });

            this.runningCallback = onData;

            this.runningDevice = {
                id: device.id,
                name: device.name || 'Running Sensor',
                type: 'running',
                connected: true,
            };

            return this.runningDevice;

        } catch (error) {
            console.error('Running sensor error:', error);
            throw error;
        }
    }

    /**
     * Parse heart rate data from BLE characteristic
     */
    private parseHeartRateData(event: Event): HeartRateData | null {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        if (!value) return null;

        const flags = value.getUint8(0);
        const is16bit = (flags & 0x01) !== 0;
        const hasContact = (flags & 0x02) !== 0;
        const contactDetected = hasContact ? (flags & 0x04) !== 0 : undefined;
        const hasEnergyExpended = (flags & 0x08) !== 0;
        const hasRRInterval = (flags & 0x10) !== 0;

        let offset = 1;
        const heartRate = is16bit ? value.getUint16(offset, true) : value.getUint8(offset);
        offset += is16bit ? 2 : 1;

        let energyExpended: number | undefined;
        if (hasEnergyExpended) {
            energyExpended = value.getUint16(offset, true);
            offset += 2;
        }

        const rrIntervals: number[] = [];
        if (hasRRInterval) {
            while (offset < value.byteLength) {
                rrIntervals.push(value.getUint16(offset, true));
                offset += 2;
            }
        }

        return {
            heartRate,
            contactDetected,
            energyExpended,
            rrIntervals: rrIntervals.length > 0 ? rrIntervals : undefined,
            timestamp: new Date(),
        };
    }

    /**
     * Parse cycling data from BLE characteristic
     */
    private parseCyclingData(event: Event): CyclingData | null {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        if (!value) return null;

        const flags = value.getUint8(0);
        const hasWheelData = (flags & 0x01) !== 0;
        const hasCrankData = (flags & 0x02) !== 0;

        let offset = 1;
        let wheelRevolutions: number | undefined;
        let wheelEventTime: number | undefined;
        let crankRevolutions: number | undefined;
        let crankEventTime: number | undefined;
        let speed: number | undefined;
        let cadence: number | undefined;

        if (hasWheelData) {
            wheelRevolutions = value.getUint32(offset, true);
            offset += 4;
            wheelEventTime = value.getUint16(offset, true);
            offset += 2;

            // Calculate speed (assuming 2.1m wheel circumference)
            if (this.lastWheelRevs > 0) {
                const revDiff = wheelRevolutions - this.lastWheelRevs;
                const timeDiff = (wheelEventTime - this.lastWheelTime + 65536) % 65536; // Handle overflow
                if (timeDiff > 0) {
                    speed = (revDiff * 2.1 * 1024 / timeDiff) * 3.6; // km/h
                }
            }
            this.lastWheelRevs = wheelRevolutions;
            this.lastWheelTime = wheelEventTime;
        }

        if (hasCrankData) {
            crankRevolutions = value.getUint16(offset, true);
            offset += 2;
            crankEventTime = value.getUint16(offset, true);

            // Calculate cadence
            if (this.lastCrankRevs > 0) {
                const revDiff = crankRevolutions - this.lastCrankRevs;
                const timeDiff = (crankEventTime - this.lastCrankTime + 65536) % 65536;
                if (timeDiff > 0) {
                    cadence = (revDiff * 60 * 1024) / timeDiff; // rpm
                }
            }
            this.lastCrankRevs = crankRevolutions;
            this.lastCrankTime = crankEventTime;
        }

        return {
            wheelRevolutions,
            wheelEventTime,
            crankRevolutions,
            crankEventTime,
            speed,
            cadence,
            timestamp: new Date(),
        };
    }

    /**
     * Parse running data from BLE characteristic
     */
    private parseRunningData(event: Event): RunningData | null {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        if (!value) return null;

        const flags = value.getUint8(0);
        const hasStrideLength = (flags & 0x01) !== 0;
        const hasTotalDistance = (flags & 0x02) !== 0;

        let offset = 1;

        // Speed in m/s (1/256 m/s resolution)
        const speed = value.getUint16(offset, true) / 256;
        offset += 2;

        // Cadence in steps/min
        const cadence = value.getUint8(offset);
        offset += 1;

        let strideLength: number | undefined;
        if (hasStrideLength) {
            strideLength = value.getUint16(offset, true) / 100; // m
            offset += 2;
        }

        let totalDistance: number | undefined;
        if (hasTotalDistance) {
            totalDistance = value.getUint32(offset, true) / 10; // m
        }

        return {
            speed,
            cadence,
            strideLength,
            totalDistance,
            timestamp: new Date(),
        };
    }

    /**
     * Disconnect all devices
     */
    disconnectAll(): void {
        // Devices will disconnect when page is closed
        this.heartRateDevice = null;
        this.cyclingDevice = null;
        this.runningDevice = null;
        this.heartRateCallback = null;
        this.cyclingCallback = null;
        this.runningCallback = null;
    }

    /**
     * Get connected devices
     */
    getConnectedDevices(): BluetoothDevice[] {
        const devices: BluetoothDevice[] = [];
        if (this.heartRateDevice?.connected) devices.push(this.heartRateDevice);
        if (this.cyclingDevice?.connected) devices.push(this.cyclingDevice);
        if (this.runningDevice?.connected) devices.push(this.runningDevice);
        return devices;
    }
}

// Singleton instance
export const bluetoothFitness = new BluetoothFitnessService();

export default BluetoothFitnessService;
