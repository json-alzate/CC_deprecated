
# Android
 - update capacitor.config.json with plugin reference
 ```
 		"FirebaseAuthentication": {
			"skipNativeAuth": false,
			"providers": [
				"google.com"
			]
		},
 ```
 - Add providers in variables.gradle
  ```
  rgcfaIncludeGoogle = true
  ```

- Add google-services.json in android/app