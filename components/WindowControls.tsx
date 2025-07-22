import React, { useState, useEffect } from 'react';

// Simplified check for being in an Electron environment.
const isElectron = !!(window && (window as any).require);
let ipcRenderer: any;
if (isElectron) {
  try {
    ipcRenderer = (window as any).require('electron').ipcRenderer;
  } catch (e) {
    console.error("Could not load electron ipcRenderer", e);
  }
}

const MinimizeIcon: React.FC = () => (
  <svg aria-hidden="true" role="img" width="12" height="12" viewBox="0 0 12 12">
    <rect fill="currentColor" width="10" height="1" x="1" y="6"></rect>
  </svg>
);

const MaximizeIcon: React.FC = () => (
  <svg aria-hidden="true" role="img" width="12" height="12" viewBox="0 0 12 12">
    <rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"></rect>
  </svg>
);

const RestoreIcon: React.FC = () => (
  <svg aria-hidden="true" role="img" width="12" height="12" viewBox="0 0 12 12">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      d="M3 8V2h6m-5 1h6v6H4"
    />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg aria-hidden="true" role="img" width="12" height="12" viewBox="0 0 12 12">
    <polygon
      fill="currentColor"
      fillRule="evenodd"
      points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
    ></polygon>
  </svg>
);


const WindowControls: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!ipcRenderer) return;
    
    const handleMaximized = () => setIsMaximized(true);
    const handleUnmaximized = () => setIsMaximized(false);

    ipcRenderer.on('window-is-maximized', handleMaximized);
    ipcRenderer.on('window-is-unmaximized', handleUnmaximized);
    
    ipcRenderer.invoke('get-initial-is-maximized').then(setIsMaximized).catch((e: Error) => console.error("Failed to get initial window state", e));

    return () => {
      ipcRenderer.removeListener('window-is-maximized', handleMaximized);
      ipcRenderer.removeListener('window-is-unmaximized', handleUnmaximized);
    };
  }, []);
  
  const handleMinimize = () => ipcRenderer?.send('minimize-app');
  const handleMaximize = () => ipcRenderer?.send('maximize-app');
  const handleClose = () => ipcRenderer?.send('close-app');
  
  if (!isElectron) return null; // Don't render controls in a normal browser

  return (
    <div className="absolute top-0 right-0 h-10 flex items-center no-draggable z-50">
        <button onClick={handleMinimize} className="h-full px-4 text-gray-300 hover:bg-white/10 hover:text-white transition-colors" title="Minimize">
            <MinimizeIcon />
        </button>
        <button onClick={handleMaximize} className="h-full px-4 text-gray-300 hover:bg-white/10 hover:text-white transition-colors" title={isMaximized ? "Restore" : "Maximize"}>
            {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
        </button>
        <button onClick={handleClose} className="h-full px-4 text-gray-300 hover:bg-red-600 hover:text-white transition-colors" title="Close">
            <CloseIcon />
        </button>
    </div>
  );
};

export default WindowControls;