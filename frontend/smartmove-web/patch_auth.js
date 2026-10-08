const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Helper to patch a file
function patchFile(filePath, modifications) {
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping: ${filePath} (not found)`);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    for (const mod of modifications) {
        if (content.includes(mod.search)) {
            content = content.replace(mod.search, mod.replace);
        } else if (mod.searchRegex) {
            content = content.replace(mod.searchRegex, mod.replace);
        }
    }
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

// 1. Register.tsx
patchFile(path.join(srcDir, 'pages/auth/Register.tsx'), [
    {
        search: "import { Link, useNavigate } from 'react-router-dom';",
        replace: "import { Link, useNavigate } from 'react-router-dom';\nimport authService from '@/services/authService';"
    },
    {
        search: "const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    navigate('/passenger/dashboard');\n  };",
        replace: `const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: selectedRole as any
      };
      const response = await authService.register(payload);
      localStorage.setItem('smartmove_token', response.token);
      localStorage.setItem('smartmove_user', JSON.stringify(response));
      if (response.role === 'ADMIN') navigate('/admin/dashboard');
      else if (response.role === 'DRIVER') navigate('/driver/dashboard');
      else navigate('/passenger/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };`
    }
]);

console.log('Patching complete.');
