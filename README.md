
# Snooker Scoreboard Pro


**Snooker Scoreboard Pro** is a comprehensive, feature-rich desktop application designed for snooker enthusiasts, players, and referees. Built with modern web technologies and wrapped in Electron, it provides a seamless and intuitive interface to manage every aspect of a snooker match, from casual games to competitive tournaments.

Its elegant dark-themed UI, combined with powerful features, ensures that tracking scores, breaks, and player statistics is both simple and enjoyable.

---

## ✨ Key Features

- **Detailed Score Tracking**: Accurately track points for each player, including current break, frames won, and points remaining in the frame.
- **Full Game Flow Control**:
    - **Potting**: Simple controls for potting reds and colors. Long-press feature for potting multiple reds at once.
    - **Fouls**: Easy-to-use dialog for assigning foul points (4-7).
    - **Free Ball**: Activate and manage free ball situations.
    - **End Turn & Concessions**: Manage turn changes and frame concessions.
- **Player Management**: Create, edit, and delete player profiles with details like name, profile picture, country, date of birth, and playing hand.
- **Match Setup**: Configure matches with specific players and "best of" frame counts.
- **Comprehensive Statistics**:
    - **Live Stats**: View real-time frame history during a match.
    - **Post-Match Summary**: Get a detailed breakdown of the match, including frame-by-frame scores and highest breaks.
    - **Global Statistics**: Track all-time stats across all matches, including total matches played, frames won, highest breaks, and century breaks.
    - **Player Leaderboard**: A ranked list of players based on wins, win rate, and other metrics.
- **Match History**: Browse a chronological list of all completed matches and revisit their summaries at any time.
- **Customizable Keyboard Shortcuts**: Speed up your scoring with fully customizable keyboard shortcuts for all major actions.
- **Modern & Responsive UI**: A sleek, dark interface built with Tailwind CSS that looks great and is easy on the eyes during long matches.
- **Cross-Platform Support**: Packaged with Electron for a native desktop experience on Windows, macOS, and Linux.

---

## 💻 Technology Stack

- **Frontend**: [React](https://reactjs.org/) (with Hooks), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Desktop Framework**: [Electron](https://www.electronjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Package Management**: [npm](https://www.npmjs.com/)
- **Packaging & CI/CD**: [electron-builder](https://www.electron.build/) & [GitHub Actions](https://github.com/features/actions)

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (which includes npm) installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/snooker-scoreboard-pro.git
    cd snooker-scoreboard-pro
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

### Running in Development Mode

This command starts the Vite development server for the React app.

```sh
npm run dev
```

---

## 📦 Packaging for Production

To package the application for your local machine, run:

```sh
npm run electron:build
```

This will create a distributable file (`.exe`, `.dmg`, or `.AppImage`) inside the `release/` directory.

---

## 🤖 Continuous Integration & Release Automation

This project uses **GitHub Actions** to automatically build and release the application for Windows, macOS, and Linux.

### How It Works

1.  The workflow is defined in `.github/workflows/release.yml`.
2.  When a new version tag (e.g., `v2.1.0`) is pushed to the repository, the workflow is triggered.
3.  A `build` job runs in parallel on Windows, macOS, and Linux runners. Each runner builds its platform-specific version of the app.
4.  If all builds are successful, a `release` job starts.
5.  This job creates a new **Draft Release** on the GitHub "Releases" page.
6.  It then uploads all the built application packages (`.exe`, `.dmg`, `.AppImage`) to this draft release.
7.  You can then review the release and manually publish it.

### How to Trigger a New Release

1.  **Commit Your Changes**: Make sure all your latest code is committed to your main branch.

2.  **Set Up Code Signing (One-Time Setup)**: For users to trust your application, it must be code-signed. Go to your GitHub repository's `Settings > Secrets and variables > Actions` and add the following secrets. This is crucial for macOS and Windows.

    -   `APPLE_ID`: Your Apple Developer email address.
    -   `APPLE_APP_SPECIFIC_PASSWORD`: An [app-specific password](https://support.apple.com/en-us/HT204397) for your Apple ID.
    -   `CSC_LINK`: A base64 encoded version of your signing certificate.
        -   For macOS, this is your `.p12` file.
        -   For Windows, this is your `.pfx` file.
        -   **To create the secret**: Run the following command in your terminal and copy the output:
            ```sh
            # For macOS/Linux
            base64 -i your_certificate.p12 -o - | pbcopy 
            # For Windows (using PowerShell)
            [Convert]::ToBase64String([IO.File]::ReadAllBytes("your_certificate.pfx")) | Set-Clipboard
            ```
    -   `CSC_KEY_PASSWORD`: The password for your signing certificate.

3.  **Tag the Version**: Create a new Git tag locally. The version should match the one in `package.json`.
    ```sh
    # Example for version 2.1.0
    git tag v2.1.0
    ```

4.  **Push the Tag**: Push the tag to your GitHub repository. This is the action that triggers the release workflow.
    ```sh
    git push origin v2.1.0
    ```

5.  **Monitor and Publish**: Go to the "Actions" tab in your GitHub repository to watch the progress. Once it completes, go to the "Releases" page, find your new draft, review it, and click "Publish release".

---

## ✍️ Author

This project was crafted by **Lucian tech**.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.
