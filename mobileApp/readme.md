`nvm use v18.16.1`  
`npx expo install`  
`npx expo login`  
`npx expo start`

## Build & Deployment

Creata app on Apple Store connect  
Go to `app.json`, change slug, eas project, owner... to your eas project
Also change id in `app.json` for each deployment build  
`eas login`  
`eas build:configure`  
`eas build --platform ios`  
`eas submit -p ios --latest`
