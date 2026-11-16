import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'remixicon/fonts/remixicon.css';
import App from './App';
import { applyEmbedQueryOnBoot } from './embed';
import './styles/global.css';
import './styles/type.css';
import './styles/app.css';

// Case-study iframe: ?user=maya|jordan and optional ?embed=1
applyEmbedQueryOnBoot();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
