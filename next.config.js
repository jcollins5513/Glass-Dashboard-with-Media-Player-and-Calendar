/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable App Router (default in Next 13+), keep for clarity

  // Allow dev requests from any LAN IP while developing
  allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000", "http://100.92.127.123:3000"],
};

module.exports = nextConfig;
