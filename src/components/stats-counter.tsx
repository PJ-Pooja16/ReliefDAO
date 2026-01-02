"use client";

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { landingPageStats } from '@/lib/data';

const formatValue = (value: number, unit: string) => {
    if (unit === 'M') {
        return value.toFixed(1);
    }
    return Math.round(value).toLocaleString();
};

const Counter = ({ target, unit, suffix }: { target: number; unit: string, suffix: string }) => {
    const [count, setCount] = useState(0);
    const duration = 2000;

    useEffect(() => {
        let start = 0;
        const end = target;
        if (start === end) return;

        let startTime: number | null = null;
        const animate = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentCount = start + (end - start) * progress;
            setCount(currentCount);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [target]);
    
    const displayValue = formatValue(count, unit);

    return (
        <span className="font-bold font-code text-4xl md:text-5xl text-primary">
            {unit === 'M' && '$'}{displayValue}{unit !== 'M' ? '' : unit}{suffix}
        </span>
    );
};

export default function StatsCounter() {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    return (
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {landingPageStats.map((stat) => (
                <div key={stat.name} className="p-4">
                    <h3 className="text-muted-foreground mb-2">{stat.name}</h3>
                    {inView ? (
                        <Counter target={stat.value} unit={stat.unit} suffix={stat.suffix} />
                    ) : (
                        <span className="font-bold font-code text-4xl md:text-5xl text-primary">
                            {unit === 'M' && '$'}0{stat.unit}{stat.suffix}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
