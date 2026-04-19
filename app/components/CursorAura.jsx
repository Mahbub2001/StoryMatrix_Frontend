"use client";

import { useEffect, useState } from "react";

const INTERACTIVE_SELECTOR = "a, button, input, select, textarea, [role='button'], .cat-pill, .glass-card";

export default function CursorAura() {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [visible, setVisible] = useState(false);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(hover: hover) and (pointer: fine)");
        if (!media.matches) return;

        const onMove = (event) => {
            setX(event.clientX);
            setY(event.clientY);
            setVisible(true);
            const target = event.target;
            setActive(Boolean(target instanceof Element && target.closest(INTERACTIVE_SELECTOR)));
        };

        const onLeave = () => {
            setVisible(false);
            setActive(false);
        };

        document.body.classList.add("cursor-aura-enabled");
        window.addEventListener("mousemove", onMove, { passive: true });
        document.addEventListener("mouseleave", onLeave);

        return () => {
            window.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseleave", onLeave);
            document.body.classList.remove("cursor-aura-enabled");
        };
    }, []);

    return (
        <>
            <div
                className={`cursor-aura-dot${visible ? " is-visible" : ""}${active ? " is-active" : ""}`}
                style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
            />
            <div
                className={`cursor-aura-ring${visible ? " is-visible" : ""}${active ? " is-active" : ""}`}
                style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
            />
        </>
    );
}
