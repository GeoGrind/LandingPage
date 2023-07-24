nvm use v18.16.1
npm install
npx expo login
npx expo start 

## Deployment
`eas login`  
`eas build:configure`  
`eas build --platform ios`  
Creata app on Apple Store connect  
Edit `app.json` for id  
`eas submit -p ios --latest`