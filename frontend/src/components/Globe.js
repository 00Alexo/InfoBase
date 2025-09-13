import { useEffect, useRef } from 'react';
import globe from 'vanta/dist/vanta.globe.min';
import * as THREE from 'three';

const Globe = () => {
    const vantaRef = useRef(null);
    useEffect(() => {
        let vantaEffect;
        if (vantaRef.current) {
            vantaEffect = globe({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.20,
                scaleMobile: 1.00,
                color: 0xef4444,  // red-500 to match our theme
                color2: 0xdc2626, // red-600 for secondary color
                backgroundColor: 0x18191c, // our dark background
                forceAnimate: true
            });
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, []);

    return (
        <div className="relative w-full h-full">
            <div ref={vantaRef} className="w-full h-full absolute inset-0 z-10"></div>
        </div>
    );
}

export default Globe