import './app.css'
import App from './App.svelte'

// Mount the app directly - store initialization is now handled in App.svelte
const app = App({
  target: document.getElementById('app')!,
})

export default app