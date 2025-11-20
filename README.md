# PetConnect - BackEnd

API para gerenciamento de adoção e registro de animais.

---

## 🚀 Como rodar o projeto

### **1. Instalar dependências**

```bash
npm install
```

### **2. Rodar em modo desenvolvimento (com nodemon)**

```bash
npm run dev
```

### **3. Rodar em produção**

```bash
npm start
```

### **4. Rodar testes**

```bash
npm run test
```

---

## 📦 Tecnologias Utilizadas

* Node.js
* Express
* MongoDB / Mongoose
* Jest (testes)
* Swagger (documentação)
* Nodemon (desenvolvimento)

---

## 📚 Documentação dos Endpoints

Após rodar o projeto, acesse:

```
/swagger
```

---

## 📂 Estrutura do Projeto

```
src/
 ├─ controllers/
 ├─ models/
 ├─ routes/
 └─ tests/
```

---

## 🗄️ Scripts (package.json)

```json
"scripts": {
  "start": "node app.js",
  "test": "jest --watchAll",
  "dev": "nodemon server.js"
}
```

---

## 🧪 Testes

Os testes são executados via Jest:

```bash
npm run test
```

---
