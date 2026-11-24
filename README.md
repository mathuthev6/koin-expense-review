# Koin – Receipt Scan & Expense Review

A React Native mobile application developed as part of the **Koin Software Engineering Intern (React Native) Take-Home Challenge**.

Koin Expenses simplifies expense tracking by allowing users to upload or capture receipt images, review extracted expense details, edit individual items, and save finalized expenses to their recent activity.

## 1. Features

- **Receipt Upload:** Select receipt images from the device gallery or capture them using the camera.
- **Receipt Preview:** Preview the selected receipt before reviewing its details.
- **Simulated Receipt Extraction:** Populate receipt information using predefined sample data.
- **Editable Expense Details:** Modify merchant name, date, and expense category.
- **Item Management:** Edit item names and prices, add new items, and delete existing items.
- **Dynamic Total Calculation:** Automatically recalculate the total when items are edited, added, or removed.
- **Input Validation:** Validate expense information before saving.
- **Expense Management:** Save confirmed expenses and display them in the Recent Activity list.

## 2. Technology Stack

- React Native
- Expo
- TypeScript
- Expo Router
- React Context API
- React Hooks
- Expo Image Picker
- Expo Go

## 3. Project Structure

```text
koin-expenses/
│
├── assets/
│   └── images/
│
├── scripts/
│
├── src/
│   ├── app/
│   │   ├── index.tsx
│   │   ├── review.tsx
│   │   ├── explore.tsx
│   │   └── _layout.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── app-tabs.tsx
│   │   ├── themed-text.tsx
│   │   └── themed-view.tsx
│   │
│   ├── constants/
│   │   └── theme.ts
│   │
│   ├── context/
│   │   └── ExpensesContext.tsx
│   │
│   ├── hooks/
│   │
│   ├── types/
│   │   └── expense.ts
│   │
│   └── global.css
│
├── .env.example
├── app.json
├── eas.json
├── package.json
├── package-lock.json
└── README.md
```

### Architecture Overview

The application follows a component-based architecture using Expo Router for file-based navigation.

- **Screens:** The `src/app` directory contains the main Expenses and Review Receipt screens.
- **Components:** Reusable UI components are organized under `src/components`.
- **State Management:** React Context API is used to manage shared expense data through `ExpensesContext.tsx`.
- **Types:** TypeScript definitions for expense-related data are maintained in `src/types`.
- **Theme:** Shared theme constants are maintained in `src/constants`.

This structure separates application screens, reusable components, shared state, and data types to keep the code organized and maintainable.

## 4. Installation

Clone the repository:

```bash
git clone https://github.com/mathuthev6/koin-expense-review.git
```

Navigate to the project directory:

```bash
cd koin-expense-review
```

Install dependencies:

```bash
npm install
```

## 5. Running the Application

Start the Expo development server:

```bash
npx expo start
```

Scan the displayed QR code using Expo Go on an Android or iOS device.

Alternatively, use the available emulator or simulator options.

## 6. Receipt Extraction

The application uses simulated receipt extraction with predefined sample receipt data.

When a user selects or captures a receipt image, the application displays a scanning/loading state and populates the receipt review screen with sample merchant information, date, category, and line items.

This approach allows reviewers to test the complete receipt review workflow without requiring an external OCR service or AI API.

**No external API keys or environment variables are required.**

## 7. Testing

The application was tested using Expo Go and a standalone Android APK installed on a physical Android device.

The following functionality was verified:

- Receipt image selection from the gallery.
- Receipt image capture using the camera.
- Receipt preview and simulated extraction.
- Editing merchant details, date, and category.
- Editing individual item names and prices.
- Adding and deleting expense items.
- Dynamic total recalculation.
- Input validation.
- Confirming and saving expenses.
- Displaying saved expenses in Recent Activity.

The standalone Android build was also installed and tested independently of Expo Go.

## 8. AI-Assisted Development

ChatGPT was used as an AI-assisted development tool during the implementation process.

It supported:

- Understanding and breaking down assignment requirements.
- Planning the application structure.
- Generating implementation suggestions.
- Troubleshooting and debugging.
- Reviewing functionality and identifying potential edge cases.
- Preparing project documentation.

AI-generated suggestions were reviewed and adapted during development. The application was also tested through Expo Go to verify its functionality.

## 9. Preview & Demo

### Android Testing Build

[View Android Build & Install APK](https://expo.dev/accounts/mathusa/projects/koin-expenses/builds/45eeb4c5-0bbe-4ca4-9884-c7f4d99148af)

The Android application was built using EAS Build, installed on a physical Android device, and tested successfully.

### Expo EAS Update

[View Published EAS Update](https://expo.dev/accounts/mathusa/projects/koin-expenses/updates/335b855b-59fa-467b-b24c-16a1c753d281)

Note: The published update requires a compatible installed build and cannot be opened directly using standard Expo Go.

### Local Testing with Expo Go

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the development server using `npx expo start`.
4. Scan the QR code using Expo Go.

### Demo Video

[Watch Project Demonstration] (https://drive.google.com/drive/folders/1-XiDjtz2mM4QS4pzvRej9t39LVg7e8l3?usp=sharing)

### Platform Compatibility

The application is developed using React Native and Expo and is configured for both Android and iOS.

Hands-on testing was performed on a physical Android device. iOS device testing was not performed.

---

**Developed by Mathusa Theivendran**

Koin Software Engineering Intern – Take-Home Challenge
