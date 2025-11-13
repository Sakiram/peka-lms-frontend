import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import '@/styles/themes/default.css';
import '@/styles/themes/purple.css';
import '@/styles/themes/blue.css';
import '@/styles/themes/pink.css';
import '@/styles/themes/vintage.css';
import '@/styles/themes/cyberPunk.css';
import '@/styles/themes/claude.css';
import '@/styles/themes/t3.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);