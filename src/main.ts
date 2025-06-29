import './app.css'
import App from './App.svelte'
import { auth } from './lib/auth.svelte.ts'

async function initApp() {
  // Wait for auth store to be fully initialized
  await auth.waitForInitialization()
  
  // Now mount the app
  const app = App({
    target: document.getElementById('app')!,
  })
  
  return app
}

// Initialize the app
initApp().catch(console.error)