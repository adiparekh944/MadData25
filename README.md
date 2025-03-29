

## 📖 README.md - Instructions for Running ClaimReady

## 🚀 Running the Application

To run the application, follow these steps:

---

### **Step 1: Install Docker**
Ensure you have **Docker** installed on your machine.  
- [Download Docker here](https://www.docker.com/products/docker-desktop/)  
- Follow the installation instructions for your operating system.

---

### **Step 2: Navigate to the Project Directory**
1. Open your terminal.
2. Navigate to the `MadData` directory:
---

### **Step 3: Run the Application**
Depending on your goal, use one of the following commands:

### ➤ **For Development (Auto-rebuild on Changes)**
To run the application and automatically rebuild on file changes:

```bash
docker-compose -f docker-compose-build-run.yml up
```

### ➤ **For Deployment (Production Mode)**
To run the application without rebuilding on file changes:

```bash
docker-compose -f docker-compose-run.yml up
```

---

### **Step 4: Access the Application**
✅ **React Development Server:**  
- URL: [https://localhost:3000](https://localhost:3000)  
- Visit this URL after running one of the above commands to view the application.

✅ **Flask REST API (For Endpoint Testing):**  
- URL: [https://localhost:8080](https://localhost:8080)  
- This endpoint allows you to interact with the backend API.

---

### ⚠️ **Troubleshooting**
If you encounter issues:
- Ensure Docker is running. (docker desktop application always has to be running)
- If there are dependency issues, try rebuilding the containers:

```bash
docker-compose -f docker-compose-build-run.yml up --build
```

---

