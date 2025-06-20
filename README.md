# Stremio IPTV Addon (Configurable)

This is a configurable Stremio addon that provides IPTV channels from multiple .m3u files. It includes a web interface to let users select which playlists to load.

## Directory Structure

.
├── m3u/ # Folder for your .m3u playlist files
│ ├── entertainment.m3u
│ └── movies.m3u
├── public/ # Folder for the web UI
│ └── index.html
├── addon.js # Core addon logic (dynamic manifest, handlers)
├── package.json # Project dependencies and scripts
├── README.md # This file
└── server.js # Express server to host the addon and UI

## How to Test Locally

### 1. Prerequisites

- You must have Node.js installed on your computer.
- You must have the Stremio Desktop App installed.

### 2. Setup

**Create the Project Directory:**

- Create a new folder for your project.

**Create Sub-directories:**

- Inside the new folder, create two more folders: `m3u` and `public`.

**Save the Files:**

- Save all the files from the canvases above into their correct locations.
  - `server.js`, `addon.js`, `package.json`, `README.md` go in the root project folder.
  - `index.html` goes inside the `public` folder.
  - Your `.m3u` files go inside the `m3u` folder.

**Install Dependencies:**

- Open your terminal or command prompt in the root project directory and run:

  npm install

### 3. Running the Addon

**Start the Server:**

- In the same terminal, run the following command:

  npm start

- You should see a message in the console: `Addon server running. Open http://localhost:7000 to configure.`

### 4. Configuring and Installing in Stremio

**Open the Web UI:**

- Open your web browser and navigate to `http://localhost:7000`.

**Select Playlists:**

- You will see a list of the `.m3u` files from your `m3u` directory. Check the boxes for the playlists you want to include.

**Generate Link:**

- Click the "Generate Install Link" button.

**Install the Addon:**

- A new section will appear with your custom installation link. You have two options:
  - **Easy Install:** Click the "Install in Stremio" button. This should open Stremio and prompt you to install.
  - **Manual Install:** Copy the generated URL. Open the Stremio app, go to the Addons page, and paste the URL into the search bar, then press Enter.

**Confirm Installation:**

- A confirmation dialog will appear in Stremio. Click the "Install" button.

### 5. Using the Addon

**Go to the TV Channels Section:**

- Click on the TV icon in the left-hand navigation bar in Stremio.

**Find Your Catalog:**

- You should see a new catalog whose name includes the playlists you selected (e.g., "IPTV (Entertainment, Movies)"). Click on it to see the combined list of channels.

---

**Congratulations!** You now have a flexible, configurable Stremio addon.
