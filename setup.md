# Setting Up the Repo

## Clone the Repo

```bash
git clone https://github.com/cmorman89/raw-food-calc
```

> [!NOTE]
> Select "React" and "TypeScript" if prompted. -->

```bash
cd raw-food-calc
cd frontend
npm install
```

> [!NOTE]
> This will create the project and install the dependencies.
> This command is run from the root directory.

> [!IMPORTANT]
> You must have Node.js installed.
> - [Node.js](https://nodejs.org/en/download/)

---

## Run the Frontend (Every Time)

```bash
npm run dev
```

> [!NOTE]
> - This will run the project on `http://localhost:5173/`.
> - This command must be run from the `frontend` directory.

---

## Build the Frontend (Only on deploy)

```bash
npm run build
```

> [!NOTE]
> This will build the project and output the files to the `dist` directory.
> This command must be run from the `frontend` directory.
