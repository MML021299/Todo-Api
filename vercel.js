{
  "version": 2,
  "builds": [
    {
      "src": "./api/hello.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "./api/hello.js"
    }
  ]
}
