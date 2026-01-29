# 🔮 Palantír Client

> Frontend for Palantír - Real-time communication platform inspired by Lord of the Rings

![Palantír](https://img.shields.io/badge/React-18-blue) ![Socket.io](https://img.shields.io/badge/Socket.io-4-black) ![CSS](https://img.shields.io/badge/CSS-Custom-purple)

## ✨ Features

- 🏰 **Realms** - Create and manage community spaces
- 🚪 **Halls** - Multiple chat channels per realm
- 📜 **Real-time Chat** - Instant messaging with Socket.io
- 🧙 **Gandalf AI** - Ask the wizard with `@gandalf`
- 🔐 **Authentication** - Secure JWT-based auth
- 🎨 **LOTR Theme** - Middle-earth inspired UI

## 🛠 Tech Stack

- **React 18** + **Vite**
- **React Router**
- **Socket.io Client**
- **Axios**
- **CSS** (custom, no frameworks)

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/ArthurSJz/palantir-client.git
cd palantir-client
npm install
```

### 2. Configure Environment

Create `.env` file:
```env
VITE_API_URL=http://localhost:5005
```

### 3. Run
```bash
npm run dev
```

App runs at `http://localhost:5173`

## 📁 Project Structure
```
palantir-client/
├── src/
│   ├── components/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── ShirePage.jsx
│   │   └── RealmPage.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── socket.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── index.html
```

## 🎮 How to Use

1. **Sign up** - Create your traveler account
2. **Create Realm** - Start your own community
3. **Share Gate Password** - Invite others to join
4. **Create Halls** - Organize conversations
5. **Chat** - Send scrolls in real-time
6. **Ask Gandalf** - Type `@gandalf` followed by your question

## 📸 Screenshots

### Login
*"Enter Middle-earth"*

### The Shire (Dashboard)
*"Your Realms await"*

### Realm Chat
*"Real-time scrolls with Gandalf AI"*

## 🗺 Roadmap

- [x] User authentication
- [x] Create/join realms
- [x] Real-time chat
- [x] Gandalf AI integration
- [ ] Voice halls
- [ ] Direct messages
- [ ] File sharing
- [ ] Message reactions

## 👤 Author

**Arthur SJ** - [GitHub](https://github.com/ArthurSJz)


---

*"All we have to decide is what to do with the time that is given us."* - Gandalf 🧙‍♂️