import http from 'http';

// This dummy server is used to satisfy Vercel CLI's dev command requirement 
// without interfering with Vite's HMR or recursive spawning.
const port = process.env.PORT || 3001;
const server = http.createServer((req, res) => res.end());

server.listen(port, () => {
  console.log(`[Vercel Dummy] Dummy dev server for Vercel listening on port ${port}`);
});
