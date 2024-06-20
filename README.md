<p align="center">
  <img src="https://github.com/json-alzate/ChessColate/blob/master/docs/images/chesscolate.com_puzzles_training-menu.png" alt="ChessColate Screenshot">
</p>

# ChessColate

ChessColate is an application focused on improving chess tactics through personalized training plans.

It is an open-source project and is complemented by the backend:
- [Chesscolate Puzzles Backend](https://github.com/json-alzate/Chesscolate-puzzles-backend)

It features a database populated with over 3 million records from lichess:
- [Lichess Training](https://lichess.org/training)

## Installation

1. You need to have a Firebase project.
2. Create a file named `keys.ts` in the path: `src/app/environments/keys.ts`. The file should have the following structure:
    ```typescript
    export const keys = {
      firebase: {
        projectId: '',
        appId: '',
        storageBucket: '',
        locationId: '',
        apiKey: '',
        authDomain: '',
        messagingSenderId: '',
        measurementId: '',
      }
    };
    ```
3. Install the necessary packages:
    ```
    npm install
    ```

## Run in development mode

This is an Ionic project, so you can use:
- `ionic serve`  
  For more information, refer to the [Ionic documentation](https://ionicframework.com/docs/).

To work with the puzzles, follow the installation instructions of the backend at:
- [Chesscolate Puzzles Backend](https://github.com/json-alzate/Chesscolate-puzzles-backend)

## Compile and push the container to production

```
npm run build:ssr
docker build -t chesscolate-web .
docker tag chesscolate-web jsonfront/chesscolate-web
docker push jsonfront/chesscolate-web
```

## Android build

It's a [Capacitor](https://capacitorjs.com/) project with adjustments for compiling due to [Angular SSR](https://docs.angular.lat/guide/universal).

- Build the project with:
  ```
  ionic build
  ```
  This will generate the compiled folder at `dist/app/browser` due to SSR.

  - Modify `webDir` in the `capacitor.config.json` file to point to the compiled folder.
  - Then execute:
    ```
    npm run clean:build:android
    ```
    This script cleans the build directory from packaged files like .map, etc.

    - Next, compile the project normally for Android with:
      ```
      ionic cap sync android
      ionic cap copy android
      ```

      etc.

## Icons

The icons used in the project are from:
- [Icongeek26 on Flaticon](https://www.flaticon.com/authors/icongeek26) - Glyph style

