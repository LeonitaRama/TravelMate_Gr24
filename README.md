# 🌍 TravelMate_Gr24
**Aplikacion për Udhëtime & Eksplorim**
#### Një aplikacion mobil për udhëtarët që u mundëson të: 
- Zbulojnë destinacione të reja
- Marrin informata praktike si moti, harta dhe atraksione
- Planifikojnë itinerarë
- Ndajnë përvoja me komente e foto.
  
#### Përdoruesit mund të regjistrohen, të shfletojnë destinacione udhëtimi, të marrin informacione për motin dhe atraksionet turistike, të ruajnë vendet e preferuara dhe të përdorin GPS-in për të parë atraksione afër. Opsionalisht, ata mund të përdorin kamerën për të bërë foto gjatë udhëtimit dhe t’i ruajnë në profilin e tyre.
---

## ⚙️ Udhëzimet për Nisjen e Projektit

###  Klono projektin
```bash
git clone https://github.com/LeonitaRama/TravelMate_Gr24.git
```

### Shkoni në direktorinë e projektit:
```bash
cd TravelMate_Gr24
```

### Instaloni varësitë dhe modulet e nevojshme të Expo:
```bash
npm install
```

### Nisni aplikacionin:
```bash
npx expo start
```
ose

```bash
npx expo start --tunnel
```

### Autentifikimi (Firebase Authentication)
- Email / Password
- Github
- Validim input-esh gjatë regjistrimit dhe login-it
- Pas hyrjes, ridrejtohet tek ekrani Home
- Logout i mundshëm

### CRUD me Firebase Firestore
- Create: Shto detyra, itinerarë ose postime
- Read: Lexo dhe shfaq listën e elementeve
- Update: Përditëso informacionin ekzistues
- Delete: Fshi elementet e padëshiruara
- Përdor useState dhe useEffect për menaxhimin e gjendjes
- Trajtim i gjendjeve loading, error dhe success

### API e Jashtme
- OpenWeatherMap për motin


### Navigimi dhe UI
- Navigim i plotë me Expo Router
- Përshtatje me dark mode dhe light mode

### Device Features
- Camera / Image Picker (expo-image-picker)
- Local Notifications (expo-notifications)
- GPS / Location (expo-location) ose Google Maps

### Optimizations / Performance
- FlatList për listat e mëdha
- React memoization:
- **useCallback** për funksionet që i kalohen child components
- **useMemo** për vlerat e llogaritura
- Component memoization me **React.memo**
- Asset optimization: kompresim imazhesh, lazy load

### Testing (bazik)
- Snapshot tests për komponentët
- Interaction tests: button press, input validation, modal visibility
- Mocking tests për simulime

## Modulet
#### Sign up - Login
<img src="https://github.com/user-attachments/assets/a9744306-8040-47cd-91ab-1239920fd3b9" width="200" />
<img src="https://github.com/user-attachments/assets/c41f52fa-2438-4d5a-8965-7e36577cbae5" width="200" />

#### Home
<img src="https://github.com/user-attachments/assets/44271318-ffb3-4675-a8f6-5de6d064e1e2" width="200" />
<img src="https://github.com/user-attachments/assets/3f6c52b0-6938-4c4f-83bd-6fa419d4f2a9" width="200" />

#### Profile
<img src="https://github.com/user-attachments/assets/e2fb482e-3bf1-4f1d-ac6f-589b182d044c" width="200" />

#### Notifications
<img src="https://github.com/user-attachments/assets/c240f9c5-3de9-4a94-a8e6-60c7bb80b21d" width="200" />

#### PersonalInfo
<img src="https://github.com/user-attachments/assets/e6078cff-43f3-4795-a5f1-7fcfe8bfc62c" width="200" />

#### Reviews
<img src="https://github.com/user-attachments/assets/830f7c31-5a10-4448-834c-2769b6e305ac" width="200" />
  
#### Wishlist
<img src="https://github.com/user-attachments/assets/27b8f7f6-8d97-42c8-b9eb-6f0797c36a9f" width="200" />

#### Photos
<img src="https://github.com/user-attachments/assets/6c81a0ee-6f71-44de-930e-30b24475ed4d" width="200" /> 

#### Settings
<img src="https://github.com/user-attachments/assets/261fcc78-e6a4-4575-b4fa-7086095ec7c9" width="200" />


---
Projekti është zhvilluar nga 
- Rinesa Bejic
- Liridona Kurrumeli
- Rona Kukaj
- Vlore Thaqi
- Leonita Rama
