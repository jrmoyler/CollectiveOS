/**
 * Electron Configuration for CollectiveOS Desktop App
 *
 * This configuration file defines how the Electron wrapper should
 * build the CollectiveOS desktop application. The app runs as a
 * frameless window (no native OS chrome) to maintain the custom
 * window manager with traffic-light controls.
 *
 * To set up Electron:
 *   npm install --save-dev electron electron-builder
 *
 * Main process entry point (electron/main.ts):
 *
 *   import { app, BrowserWindow } from 'electron';
 *   import path from 'path';
 *
 *   function createWindow() {
 *     const win = new BrowserWindow({
 *       width: 1440,
 *       height: 900,
 *       frame: false,           // No native title bar
 *       titleBarStyle: 'hidden', // macOS: hide but keep traffic lights area
 *       trafficLightPosition: { x: -100, y: -100 }, // Hide native traffic lights
 *       backgroundColor: '#0f172a',
 *       webPreferences: {
 *         nodeIntegration: false,
 *         contextIsolation: true,
 *         preload: path.join(__dirname, 'preload.js'),
 *       },
 *     });
 *
 *     // Load the Vite dev server or built files
 *     if (process.env.NODE_ENV === 'development') {
 *       win.loadURL('http://localhost:5173');
 *     } else {
 *       win.loadFile(path.join(__dirname, '../dist/index.html'));
 *     }
 *   }
 *
 *   app.whenReady().then(createWindow);
 *   app.on('window-all-closed', () => app.quit());
 */

export const electronConfig = {
  appId: 'com.collectiveai.collectiveos',
  productName: 'CollectiveOS',
  directories: {
    output: 'dist-electron',
  },
  files: ['dist/**/*', 'electron/**/*'],
  mac: {
    target: 'dmg',
    icon: 'public/icon.icns',
  },
  win: {
    target: 'nsis',
    icon: 'public/icon.ico',
  },
  linux: {
    target: 'AppImage',
    icon: 'public/icon.png',
  },
};
