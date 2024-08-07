# LIVE : https://minstagram1.web.app/

# Minstagram

Minstagram is a full-stack photo-sharing application developed using React, TypeScript, Material UI, Firebase, and Firestore. This application allows users to register, upload, like, comment on, and report photos.

## Features

- User Registration and Authentication
- Photo Upload
- Like Photos
- Comment on Photos
- Report Photos
- Real-time Data Updates with Firestore
- Profile Management with Photo Uploads
- Responsive and User-Friendly Design

## Technologies Used

- **Frontend:** React, TypeScript, Material UI
- **Backend:** Firebase Firestore, Firebase Storage
- **Authentication:** Firebase Authentication
- **Deployment:** Firebase Hosting

## Installation and Setup

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sahinmeric/minstagram.git
   cd minstagram
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a Firebase project:**

   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click on "Add Project" and follow the steps to create a new Firebase project

4. **Setup Firebase:**

   - In your Firebase project, navigate to Project Settings and find your Firebase SDK configuration
   - Create a `.env` file in the root of your project and add your Firebase configuration like this:

   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

5. **Enable Firebase Services:**

   - Enable Firestore, Firebase Storage, and Firebase Authentication (Email/Password) in the Firebase Console

6. **Start the development server:**

   ```bash
   npm start
   ```

7. **Deploy to Firebase Hosting:**
   - Install Firebase CLI if you haven't already:
     ```bash
     npm install -g firebase-tools
     ```
   - Login to Firebase:
     ```bash
     firebase login
     ```
   - Initialize Firebase in your project:
     ```bash
     firebase init
     ```
   - Follow the prompts to set up Firebase Hosting and select your Firebase project
   - Deploy your project:
     ```bash
     npm run build
     firebase deploy
     ```

## Usage

- **Register:** Create a new account by providing an email, password, and username.
- **Login:** Login to your account using your registered email and password.
- **Upload Photo:** Upload a new photo with a description.
- **Like Photos:** Like your favorite photos.
- **Comment on Photos:** Add comments to photos.
- **Report Photos:** Report inappropriate photos.
- **Profile Management:** Update your profile information and profile picture.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or feedback, please contact:

- **Your Name**
- [Your Email](mailto:sahinmeric22@gmail.com)
- [Your LinkedIn](https://www.linkedin.com/in/sahinmeric)
