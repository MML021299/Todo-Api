{
	"version": 2,
	"functions": {
		"api/hello.js": {
			"runtime": "nodejs14.x"
		}
	},
	"routes": [
		{
			"src": "/api/(.*)",
			"dest": "/api/hello.js"
		}
	]
}