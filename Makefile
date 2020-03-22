update-example-rn:
	mkdir tmp
	cp -r example/src example/App.tsx example/babel.config.js example/metro.config.js tmp
	rm -rf example
	npx react-native init example --template react-native-template-typescript
	cp -r tmp/* example
	rm -rf tmp
	# uninstall @types/react-native
	cd example && yarn remove @types/react-native
	cd example && yarn add -D babel-plugin-module-resolver
	# install react-navigation
	cd example && yarn add @react-navigation/native
	# install peer-dependencies
	cd example && yarn add react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
	# install @react-navigation/stack
	cd example && yarn add @react-navigation/stack
	cd example && cd ios && pod install
