# 🧠 MarketVision

MarketVision is a web app that uses AI to generate complete marketing content from a product image. Just upload or paste an image URL, and it returns a full product description, SEO keywords, hashtags, audience, pricing, and more.

---
![Homepage](https://i.imgur.com/wZKSnNS.png)


## How It Works

1. Register or log in
2. Upload an image or paste an image URL
3. Click **Analyze**
4. Instantly receive product copy and metadata
5. View saved prompts on the **My Prompts** page

---

## Live Demo

👉 [HERE](https://market-vision-drab.vercel.app/)

NOTE: If the analysis is not fetching, please visit [HERE](https://marketvision-backend.onrender.com/health) to start the service back up as it hibernates after prolonged inactivity

---

## Test Account

Use this test account to try it out:

username: test

password: test

---

## How to Use Locally

### 1. Clone the Repository

```
git clone https://github.com/rfarrukh0/MarketVision.git
cd MarketVision
```
### 2. Start the Backend (Go)

```
cd backend
go run main.go
```

Make sure your backend/.env file contains:

```
OPENAI_API_KEY=your_openai_key
PORT=8080
```

Important:

After starting the backend, visit http://localhost:8080/health
to make sure the server is running.

### 3. Start the Frontend (Next.js)
```
cd frontend
npm install
npm run dev
```
Create a frontend/.env.local file with the following:
```
MONGO_URI=your_mongo_connection_uri
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=http://localhost:8080
```
Then go to http://localhost:3000 in your browser.

### You're all set!
