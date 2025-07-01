# Job Tracker

> A Huntr.co clone for tracking online job applications.

## Built With

- Libraries: React
- Framework: Next.js
- Major languages: TypeScript

## Backend repository

- [Job Tracker Backend](https://github.com/Hombre2014/job-tracker-backend)

## Screenshots

- The Dashboard

  ![Dashboard](/public/images/Dashboard.png)

- The job application

  ![Job Application](/public/images/Job_Application.png)

## Deployment

- Deployed on Vercel: [Job Tracker](https://online-job-trackr.vercel.app/)

## Usage

### Requirements

- Node.js (v21 or later)
- Docker

### Start the backend

- Clone the backend: `git clone https://github.com/Hombre2014/job-tracker-backend`
- Change the directory: `cd job-tracker-backend`
- Start your Docker daemon or Docker Desktop
- Run the docker DB: `docker compose up postgres_dev`
- Create `.env` file in the backend's root directory and populate it according the `.env.backend.example` file
- You will need Appwrite account for the file upload functionality. You can get it from [Appwrite](https://appwrite.io/). Create a new project and copy the PROJECT_ID and BUCKET_ID to your `.env` file.
- You will need a Resend account with token and notification email address, which is required for sending emails. You can get it from [Resend](https://resend.com/). Create a new account and copy the token to your `.env` file. Also set the notification email address in the `.env` file.
- Run the migrations: `yarn run typeorm migration:run -d src/data-source.ts`
- Run the backend: `yarn run start`

### Start the frontend

- Clone the repository: `git clone https://github.com/Hombre2014/job-tracker-frontend`
- Change the directory: `cd job-tracker-frontend`
- Install the dependencies: `npm install`
- Run the app: `npm run dev`
- Open browser: `http://localhost:3000`

## Authors

👤 **Yuriy Chamkoriyski**

- GitHub: [@Hombre2014](https://github.com/Hombre2014)
- Twitter: [@Chamkoriyski](https://twitter.com/Chamkoriyski)
- LinkedIn: [axebit](https://linkedin.com/in/axebit)

👤 **Bohdan Shcherbak**

- GitHub: [@akucintavalent](https://github.com/akucintavalent)
- LinkedIn: [Bohdan Shcherbak](https://www.linkedin.com/in/bohdan-shcherbak/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/Hombre/job-tracker-frontend/issues).

## Show your support

Give a ⭐️ if you like this project!

## 📝 License

This project is [MIT](./license.md) licensed.
