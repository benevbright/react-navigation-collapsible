update-example-rn:
	mkdir tmp
	cp -r example/src tmp
	cp example/.vscode/launch.json tmp
	rm -rf example
	npx react-native init example --template react-native-template-typescript
	cp -r tmp/src example
	sh -c 'cd example && mkdir .vscode'
	cp tmp/launch.json example/.vscode
	rm -rf tmp
	rm example/App.tsx
	sed -i '' "s/import App from '.\/App';/import App from '.\/src\/App';/" example/index.js
	sh -c 'cd example && yarn add react-navigation react-native-reanimated react-native-gesture-handler react-navigation-stack react-navigation-tabs'
	sh -c 'cd example && yarn add react-navigation-collapsible'
	sh -c 'cd example && cd ios && pod install'