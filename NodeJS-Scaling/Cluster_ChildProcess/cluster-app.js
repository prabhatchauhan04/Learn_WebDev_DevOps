const cluster = require('node:cluster');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    const path = require('path');
    const express = require('express');
    const app = express();
    const PORT = 4444;

    app.set('view engine', 'hbs');
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
        res.send(`Hello ${process.pid}`);
    })


    app.listen(PORT, () => {
        console.log(`http://localhost:` + PORT);
    });


    console.log(`Worker ${process.pid} started`);
}


/*

---

# ✅ **What This Code Does (Simple Explanation)**

This code makes your Node.js app use **all CPU cores** instead of just one.

Normally, Node.js apps run on **one core**, so they can get slow under heavy traffic.
Using the **cluster module**, this code starts **multiple copies** of your server — one copy on each CPU core — so your app can handle more requests at the same time.

---

# 🧠 **Two types of processes**

This code creates **two kinds of processes**:

### **1️⃣ Primary process (the boss)**

* It does **not** run the server.
* It only **creates worker processes**.

### **2️⃣ Worker processes**

* Each worker **runs the Express server**.
* They all listen on the same port (4444).
* Node.js automatically distributes requests between them.

---

# 🏗️ Part-by-Part Explanation

## **1. Check if current process is the primary (boss)**

```js
if (cluster.isPrimary) {
```

If it’s the boss process:

### ✔ It prints its PID

```js
console.log(`Primary ${process.pid} is running`);
```

### ✔ It creates one worker per CPU core

```js
for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
}
```

If your computer has 8 CPU cores → it creates **8 worker processes**.

### ✔ It listens for when a worker dies

```js
cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
});
```

So you can know if a worker crashes.

---

## **2. If it's NOT the primary, then it's a worker**

```js
} else {
```

This part runs inside **every worker process**.

### ✔ The worker creates an Express server

```js
const express = require('express');
const app = express();
const PORT = 4444;
```

### ✔ A simple route that shows which worker handled the request

```js
app.get('/', (req, res) => {
    res.send(`Hello ${process.pid}`);
})
```

Every worker has a unique PID.
Refreshing the browser will show different PIDs → meaning different workers are handling the requests.

### ✔ Start the server

```js
app.listen(PORT, () => {
    console.log(`http://localhost:` + PORT);
});
```

### ✔ Log that the worker started

```js
console.log(`Worker ${process.pid} started`);
```

---

# 📊 **What happens when you run this code**

Example:
Your PC has **4 cores**.

1. **Primary process starts**
2. It creates **4 worker processes**
3. Each worker starts an Express server on **port 4444**
4. When you visit `http://localhost:4444`:

   * You may see different worker PIDs on each refresh
     (because Node distributes traffic between workers)

This makes your server faster and more scalable.

---

# 🎉 **In one sentence**

This code runs your Express server on **all CPU cores**, not just one, which increases performance and handles more users at once.

---
*/