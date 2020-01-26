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
	# install react-navigation@next (v5)
	cd example && yarn add @react-navigation/native@next @react-navigation/stack@next @react-native-community/masked-view
	cd example && yarn add react-native-gesture-handler react-native-screens react-native-safe-area-context
	# install peer-dependencies
	cd example && cd ios && pod install
	# add ,"paths": {"react-navigation-collapsible": ["../lib"]} at /example/tsconfig.json
