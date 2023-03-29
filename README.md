## MERN stack chat application with socket.io

clonning
```bash
git clone https://github.com/SolarYatagan/MERN-Chat-App.git
```

installing dependencies
```
cd frontend
npm install

cd backend
npm install
```

start backend
```
npm run dev
```

start frontend
```
npm start
```

## configure backend/.env
```
PORT = 5000
MONGO_URI = mongodb+srv://<nickname>:<password>@cluster0.jpcmwgs.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET = <nickname>
```

## configure frontend/.env
```
REACT_APP_UPLOAD_URL = 'your url in cloudinary app (for storing images)'
```