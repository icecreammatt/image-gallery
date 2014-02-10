default: index debug

index:
	./dirToJson.js > listing.json

debug:
	node-inspector &
	nodemon --debug app.js
