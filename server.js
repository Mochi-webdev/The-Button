const http = require('http');   // HTTP module (built-in)
const fs = require('fs');       // File system module (built-in)
const path = require('path');   // Path utilities module (built-in)
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('iazmgaqynonfeaootwkh.supabase.co', 'your-publishable-key')


const PORT = 3000;

//Serve Website
const server = http.createServer((req, res) => {
    if (req.url === '/') {
     
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
         
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});