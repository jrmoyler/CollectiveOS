import { GlobalMenubar } from './components/menubar/GlobalMenubar';
import { Dock } from './components/dock/Dock';
import { WindowManager } from './components/window/WindowManager';
import { Desktop } from './components/Desktop';
import './App.css';

function App() {
  return (
    <div className="w-full h-full bg-slate-950 relative overflow-hidden">
      {/* Global menubar at top */}
      <GlobalMenubar />

      {/* Desktop background with grid launcher for mobile */}
      <Desktop />

      {/* Window manager renders all open windows */}
      <WindowManager />

      {/* Dock at bottom */}
      <Dock />
    </div>
  );
}

export default App;
