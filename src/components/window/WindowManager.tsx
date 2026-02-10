import { useOSStore } from '../../store/useOSStore';
import { usePlatform } from '../../hooks/usePlatform';
import { DesktopWindow } from './DesktopWindow';
import { MobileWindow } from './MobileWindow';

export function WindowManager() {
  const windows = useOSStore(s => s.windows);
  const platform = usePlatform();

  return (
    <>
      {windows
        .filter(w => !w.isMinimized)
        .map(win =>
          platform === 'desktop' ? (
            <DesktopWindow key={win.id} window={win} />
          ) : (
            <MobileWindow key={win.id} window={win} />
          )
        )}
    </>
  );
}
