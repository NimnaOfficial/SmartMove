const fs = require('fs');
const path = require('path');

const fePath = path.join('C:', 'Users', 'SANDANIMNE', 'Desktop', 'code ss', 'SmartMove', 'SmartMove', 'frontend', 'smartmove-web');
const srcPath = path.join(fePath, 'src');

// 1. Update vite.config.ts
const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
`;
fs.writeFileSync(path.join(fePath, 'vite.config.ts'), viteConfig);

// 2. Update tsconfig.app.json and tsconfig.json to support @/* aliases
try {
  const tsconfigAppPath = path.join(fePath, 'tsconfig.app.json');
  if (fs.existsSync(tsconfigAppPath)) {
    let tsconfigApp = JSON.parse(fs.readFileSync(tsconfigAppPath, 'utf8'));
    tsconfigApp.compilerOptions.baseUrl = ".";
    tsconfigApp.compilerOptions.paths = { "@/*": ["./src/*"] };
    fs.writeFileSync(tsconfigAppPath, JSON.stringify(tsconfigApp, null, 2));
  }
  
  const tsconfigPath = path.join(fePath, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    let tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    if(!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
    tsconfig.compilerOptions.baseUrl = ".";
    tsconfig.compilerOptions.paths = { "@/*": ["./src/*"] };
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  }
} catch(e) {
  console.error("Error updating tsconfig:", e);
}

// 3. Setup index.css (Tailwind 4 + CSS Variables)
const indexCss = `@import "tailwindcss";

@theme {
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
`;
fs.writeFileSync(path.join(srcPath, 'index.css'), indexCss);

// Remove App.css as it's not needed
if (fs.existsSync(path.join(srcPath, 'App.css'))) {
  fs.unlinkSync(path.join(srcPath, 'App.css'));
}

// 4. Create an API client
const apiClientContent = `import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartmove_token');
  if (token && config.headers) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default apiClient;
`;
const apiPath = path.join(srcPath, 'api');
if (!fs.existsSync(apiPath)) fs.mkdirSync(apiPath, { recursive: true });
fs.writeFileSync(path.join(apiPath, 'client.ts'), apiClientContent);

// 5. Create a placeholder Dashboard
const dashboardContent = `export default function Dashboard() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">SmartMove Transport Solutions</h1>
        <p className="text-lg text-muted-foreground">React + Tailwind Environment is fully ready for implementation!</p>
        <p className="text-sm text-muted-foreground">Member 4 Development Environment</p>
      </div>
    </div>
  );
}
`;
const dashboardPath = path.join(srcPath, 'pages', 'dashboard');
if (!fs.existsSync(dashboardPath)) fs.mkdirSync(dashboardPath, { recursive: true });
fs.writeFileSync(path.join(dashboardPath, 'Dashboard.tsx'), dashboardContent);

// 6. Update App.tsx
const appContent = `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
`;
fs.writeFileSync(path.join(srcPath, 'App.tsx'), appContent);

// 7. Create .env file
fs.writeFileSync(path.join(fePath, '.env'), 'VITE_API_BASE_URL=http://localhost:8080/api\n');
console.log("Frontend environment fully prepared.");
