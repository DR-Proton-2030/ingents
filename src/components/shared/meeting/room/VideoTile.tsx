"use client";
import React, { useRef, useEffect, useState } from "react";
import { ParticipantState } from "./types";
import { MicOff, MoreVertical, Pin, PinOff, Sparkles } from "lucide-react";
import { UserHandUp } from "@solar-icons/react/ssr";
import { FaRegHandPaper } from "react-icons/fa";
import SimulationBackground from "./SimulationBackground";

interface VideoTileProps {
    id: string;
    stream: MediaStream | null;
    name: string;
    isLocal: boolean;
    isVideoOff: boolean;
    isMuted: boolean;
    isScreenSharing?: boolean;
    avatarColor: string;
    isPinned: boolean;
    onTogglePin: () => void;
    reaction?: string | null;
    isHandRaised?: boolean;
    videoFilter?: string;
    videoBackground?: string;
}

const filterMap: Record<string, string> = {
    "none": "",
    "grayscale": "grayscale(1)",
    "sepia": "sepia(1)",
    "blur": "blur(4px)",
    "brightness": "brightness(1.2)",
    "contrast": "contrast(1.5)",
};

const backgroundConfigs: Record<string, { type: 'blur' | 'color' | 'simulation', value: string }> = {
    "none": { type: 'color', value: '' },
    "blur": { type: 'blur', value: '' },
    "forest": { type: 'simulation', value: 'forest' },
    "home": { type: 'simulation', value: 'home' },
    "space": { type: 'simulation', value: 'space' },
    "cyber": { type: 'simulation', value: 'cyber' },
    "ocean": { type: 'simulation', value: 'ocean' },
};

const VideoTile: React.FC<VideoTileProps> = ({
    id,
    stream,
    name,
    isLocal,
    isVideoOff,
    isMuted,
    isScreenSharing,
    avatarColor,
    isPinned,
    onTogglePin,
    reaction,
    isHandRaised,
    videoFilter = "none",
    videoBackground = "none"
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trackingCanvasRef = useRef<HTMLCanvasElement>(null);
    const segmentationRef = useRef<any>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [headOffset, setHeadOffset] = useState({ x: 0, y: 0 });

    // Initialize MediaPipe Segmentation
    useEffect(() => {
        if (typeof window === "undefined" || !(window as any).SelfieSegmentation) return;

        const selfieSegmentation = new (window as any).SelfieSegmentation({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
        });

        selfieSegmentation.setOptions({
            modelSelection: 1, // 0 for general, 1 for landscape
        });

        selfieSegmentation.onResults((results: any) => {
            if (!canvasRef.current || !videoRef.current || isVideoOff) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Clear everything first
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const config = backgroundConfigs[videoBackground];

            if (config.type === 'simulation') {
                // For simulation, we want a transparent background for the person
                // Draw mask as destination
                ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
                // Draw person only in the mask
                ctx.globalCompositeOperation = "source-in";
                ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

                // --- TRACKING LOGIC ---
                // Calculate center of gravity for head tracking parallax
                if (trackingCanvasRef.current) {
                    const tCanvas = trackingCanvasRef.current;
                    const tCtx = tCanvas.getContext("2d");
                    if (tCtx) {
                        tCanvas.width = 30; // low res for performance
                        tCanvas.height = 30;
                        tCtx.drawImage(results.segmentationMask, 0, 0, 30, 30);
                        const imageData = tCtx.getImageData(0, 0, 30, 30);
                        const data = imageData.data;

                        let totalX = 0;
                        let totalY = 0;
                        let count = 0;

                        // Weighted average of pixel positions
                        for (let y = 0; y < 30; y++) {
                            for (let x = 0; x < 30; x++) {
                                const idx = (y * 30 + x) * 4;
                                const alpha = data[idx + 3];
                                if (alpha > 50) {
                                    totalX += x;
                                    totalY += y;
                                    count++;
                                }
                            }
                        }

                        if (count > 0) {
                            const centerX = (totalX / count / 30) * 2 - 1; // map to -1 to 1
                            const centerY = (totalY / count / 30) * 2 - 1;
                            setHeadOffset({ x: -centerX, y: -centerY }); // Inverse for natural feeling
                        }
                    }
                }
            } else {
                // Legacy behavior for blur/color
                ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = "source-out";

                if (config.type === "blur") {
                    ctx.filter = "blur(15px)";
                    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
                    ctx.filter = "none";
                } else if (config.value && config.value !== "") {
                    ctx.fillStyle = config.value;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                ctx.globalCompositeOperation = "destination-atop";
                ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
            }

            ctx.restore();
        });

        segmentationRef.current = selfieSegmentation;

        return () => {
            if (segmentationRef.current) {
                segmentationRef.current.close();
            }
        };
    }, [videoBackground, isVideoOff]);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, isVideoOff]);

    // Handle frame processing
    useEffect(() => {
        let animationFrameId: number;

        const processFrame = async () => {
            if (videoRef.current && segmentationRef.current && videoBackground !== "none" && !isVideoOff) {
                if (videoRef.current.readyState >= 2) { // HAVE_CURRENT_DATA
                    await segmentationRef.current.send({ image: videoRef.current });
                }
            }
            animationFrameId = requestAnimationFrame(processFrame);
        };

        processFrame();
        return () => cancelAnimationFrame(animationFrameId);
    }, [videoBackground, isVideoOff]);

    return (
        <div
            className="w-full h-full relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <video
                ref={videoRef}
                autoPlay
                muted={isLocal}
                playsInline
                style={{
                    filter: filterMap[videoFilter] || "",
                }}
                className={`absolute inset-0 w-full h-full object-cover ${isLocal && !isScreenSharing ? "scale-x-[-1]" : ""} ${isVideoOff ? "opacity-0" : (videoBackground !== "none" ? "opacity-0 pointer-events-none" : "opacity-100")}`}
            />

            {backgroundConfigs[videoBackground]?.type === 'simulation' && !isVideoOff && (
                <div className={`${isLocal && !isScreenSharing ? "scale-x-[-1]" : ""} absolute inset-0`}>
                    <SimulationBackground
                        environment={backgroundConfigs[videoBackground].value as any}
                        cameraOffset={isLocal ? headOffset : undefined}
                    />
                </div>
            )}

            <canvas
                ref={trackingCanvasRef}
                className="hidden"
                width={30}
                height={30}
            />

            <canvas
                ref={canvasRef}
                style={{
                    filter: filterMap[videoFilter] || "",
                }}
                className={`absolute inset-0 w-full h-full object-cover ${isLocal && !isScreenSharing ? "scale-x-[-1]" : ""} ${videoBackground !== "none" && !isVideoOff ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />

            {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    {reaction ? (
                        <div className="text-6xl animate-bounce">
                            {reaction}
                        </div>
                    ) : (
                        <div className={`w-20 h-20 rounded-full ${avatarColor} flex items-center justify-center ring-4 ring-white/20`}>
                            <span className="text-3xl text-white font-medium">{name.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Reaction Overlay when Video is ON */}
            {!isVideoOff && reaction && (
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                    <div className="text-7xl animate-bounce drop-shadow-2xl">
                        {reaction}
                    </div>
                </div>
            )}

            {isMuted && (
                <div className="absolute top-2 right-2 p-1 bg-red-500 rounded-full z-10">
                    <MicOff className="w-3 h-3 text-white" />
                </div>
            )}

            {isHandRaised && (
                <div className="absolute bottom-2 right-2 p-1.5 bg-yellow-400 rounded-full z-10 shadow-lg border-2 border-white animate-pulse">
                    <FaRegHandPaper className="w-4 h-4 text-white" fill="white" />
                </div>
            )}

            {/* Hover Controls */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 z-20 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTogglePin();
                        }}
                        className={`p-3 rounded-full transition-all ${isPinned ? "bg-blue-600 text-white shadow-lg" : "bg-white/90 text-gray-700 hover:bg-white shadow-md"}`}
                        title={isPinned ? "Unpin" : "Pin"}
                    >
                        {isPinned ? <PinOff className="w-5 h-5" /> : <Pin className="w-5 h-5" />}
                    </button>
                    <button className="p-3 bg-white/90 text-gray-700 hover:bg-white rounded-full shadow-md">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Pin status indicator (persistent) */}
            {isPinned && !isHovered && (
                <div className="absolute top-2 left-2 p-1 bg-blue-600 rounded-full z-10 shadow-lg">
                    <Pin className="w-3 h-3 text-white" />
                </div>
            )}

            <div className="absolute bottom-2 left-2 z-10">
                <span className="text-sm font-medium text-white drop-shadow-md bg-black/20 px-2 py-0.5 rounded-md backdrop-blur-[2px]">{name}</span>
            </div>
        </div>
    );
};

export default VideoTile;
