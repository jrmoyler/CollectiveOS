import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Video, VideoOff, Mic, MicOff, MonitorUp, PhoneOff,
  Users, MessageSquare, Settings, Sparkles
} from 'lucide-react';

type ViewMode = 'lobby' | 'call';

export function CULater() {
  const [mode, setMode] = useState<ViewMode>('lobby');
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  // Request camera for vanity mirror
  useEffect(() => {
    if (cameraOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera not available - show placeholder
        });
    } else {
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [cameraOn]);

  // Audio visualization
  const startAudioViz = useCallback(() => {
    if (!micOn) return;

    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(stream => {
        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          animFrameRef.current = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const barWidth = (canvas.width / bufferLength) * 2.5;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

            const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(52, 211, 153, 0.8)');
            gradient.addColorStop(1, 'rgba(52, 211, 153, 0.1)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

            x += barWidth + 1;
          }
        };

        draw();

        return () => {
          cancelAnimationFrame(animFrameRef.current);
          stream.getTracks().forEach(t => t.stop());
          audioCtx.close();
        };
      })
      .catch(() => {});
  }, [micOn]);

  useEffect(() => {
    if (mode === 'call') {
      startAudioViz();
    }
    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [mode, startAudioViz]);

  if (mode === 'lobby') {
    return <Lobby videoRef={videoRef} cameraOn={cameraOn} setCameraOn={setCameraOn} micOn={micOn} setMicOn={setMicOn} onJoin={() => setMode('call')} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Main call area */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-950/50 overflow-hidden">
        {/* Simulated participant grid */}
        <div className="grid grid-cols-2 gap-2 p-4 w-full max-w-2xl">
          {/* Self */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800/50 border border-emerald-500/10">
            {cameraOn ? (
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-xl text-emerald-400 font-bold">
                  You
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-[10px] text-slate-300">
              You
            </div>
          </div>

          {/* Simulated participants */}
          {['Atlas AI', 'Nova AI', 'Echo AI'].map((name) => (
            <div key={name} className="relative aspect-video rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700/20">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-400/50" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-[10px] text-slate-300">
                {name}
              </div>
              <div className="absolute top-2 right-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Audio visualization overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
          <canvas ref={canvasRef} width={800} height={64} className="w-full h-full" />
        </div>
      </div>

      {/* Call controls */}
      <div
        className="flex items-center justify-center gap-3 py-3 px-4 border-t"
        style={{ borderColor: 'rgba(52, 211, 153, 0.08)' }}
      >
        <ControlButton Icon={micOn ? Mic : MicOff} active={micOn} onClick={() => setMicOn(!micOn)} />
        <ControlButton Icon={cameraOn ? Video : VideoOff} active={cameraOn} onClick={() => setCameraOn(!cameraOn)} />
        <ControlButton Icon={MonitorUp} onClick={() => {}} />
        <ControlButton Icon={MessageSquare} onClick={() => {}} />
        <ControlButton Icon={Users} onClick={() => {}} />
        <ControlButton Icon={Settings} onClick={() => {}} />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMode('lobby')}
          className="w-10 h-10 rounded-full bg-ruby-500/80 hover:bg-ruby-500 flex items-center justify-center transition-colors"
        >
          <PhoneOff className="w-4 h-4 text-white" />
        </motion.button>
      </div>
    </div>
  );
}

function Lobby({
  videoRef,
  cameraOn,
  setCameraOn,
  micOn,
  setMicOn,
  onJoin,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraOn: boolean;
  setCameraOn: (v: boolean) => void;
  micOn: boolean;
  setMicOn: (v: boolean) => void;
  onJoin: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
      <div className="text-center mb-2">
        <h2 className="text-lg font-semibold text-emerald-400 text-glow-emerald">C-U-Later</h2>
        <p className="text-xs text-slate-500 mt-1">Video conferencing with AI participants</p>
      </div>

      {/* Vanity mirror */}
      <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden bg-slate-800/50 border border-emerald-500/15">
        {cameraOn ? (
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <VideoOff className="w-10 h-10 text-slate-600" />
          </div>
        )}

        {/* Vanity mirror overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-slate-900/70 text-[10px] text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          Vanity Mirror
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <ControlButton Icon={micOn ? Mic : MicOff} active={micOn} onClick={() => setMicOn(!micOn)} />
        <ControlButton Icon={cameraOn ? Video : VideoOff} active={cameraOn} onClick={() => setCameraOn(!cameraOn)} />
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onJoin}
        className="px-8 py-2.5 rounded-xl text-sm font-medium text-white"
        style={{
          background: 'linear-gradient(135deg, #34d399, #059669)',
          boxShadow: '0 0 20px rgba(52, 211, 153, 0.3)',
        }}
      >
        Join Meeting
      </motion.button>

      <div className="flex items-center gap-2 text-[10px] text-slate-600">
        <Users className="w-3 h-3" />
        <span>3 AI participants waiting</span>
      </div>
    </div>
  );
}

function ControlButton({
  Icon,
  active,
  onClick,
}: {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
      style={{
        background: active === false ? 'rgba(225, 29, 72, 0.2)' : 'rgba(52, 211, 153, 0.1)',
        border: `1px solid ${active === false ? 'rgba(225, 29, 72, 0.3)' : 'rgba(52, 211, 153, 0.15)'}`,
      }}
    >
      <Icon
        width={18}
        height={18}
        style={{ color: active === false ? '#e11d48' : '#34d399' }}
      />
    </motion.button>
  );
}
