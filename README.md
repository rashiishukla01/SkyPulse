# SkyPulse
# 🌤️ SkyPulse - Advanced Weather Dashboard

SkyPulse is a premium, full-scale front-end weather application designed to deliver real-time meteorological tracking within a modern glassmorphism user interface. Built with pure semantic HTML5, advanced modern CSS3, and dynamic asynchronous JavaScript, it integrates seamlessly with multiple live OpenWeatherMap API endpoints.

Live Weather. Live Better.

---

## ✨ Features

- 🔍 **Global City Search:** Instantly look up weather telemetry for any city across the world.
- 📍 **Geolocation Detection:** Automatically find and display the weather context for your current position via your browser's secure location services.
- 🌓 **Memory-Retained Dark & Light Modes:** Features smooth transitions across custom root variable property mappings, preserving your choice automatically upon reloading.
- 📊 **Comprehensive Real-Time Analytics:** Tracks critical metrics including temperature, feels-like thresholds, humidity percentages, wind speed, and air pressure.
- 🌬️ **Advanced Environmental Tracking:** 
  - **Air Quality Index (AQI):** Monitors real-time environmental metrics and reports current pollution safety levels.
  - **Timezone-Aware UV Index:** Provides custom mathematical estimations of peak UV radiation adjusted to the queried target city's solar noon alignment.
- 🌅 **Sun Cycle Tracking:** Displays local sunrise and sunset timings configured precisely to the location's specific UTC timezone shifts.
- 🪄 **Dynamic AI Weather Insight Assistant:** Continuously parses incoming condition codes to deliver custom, helpful advice like safety reminders or umbrella alerts.
- 📅 **Dynamic Forecast Tracks:**
  - **Hourly Carousel:** Displays rolling atmospheric snapshots spanning the next 24 hours.
  - **5-Day Linear Track:** Groups incoming 3-hour chunks into a daily high-temperature map.
- ⭐️ **Interactive State Lists:** Pin your top locations via the local storage caching pool with support for immediate history recall chips.

---

## 🛠️ Architecture & Technologies Used

- **Markup & Context:** HTML5
- **Style Design:** Premium Neumorphic Glassmorphism via advanced CSS3 backdrop-filters and smooth transitions.
- **Graphic Assets:** Custom Brand Logo, [FontAwesome v6](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css) iconography core.
- **Logic Engine:** Vanilla JavaScript (ES6+) utilizing `async/await` asynchronous architecture and `Fetch API`.
- **Primary Data Provider:** OpenWeatherMap API Endpoints (Current Weather, 5-Day/3-Hour Forecast, and Air Pollution Core).

---

## 📁 Repository Structure

skypulse/
├── index.html     # Semantic structure and core grid layout components
├── style.css      # Custom design properties, glass styles, animations & theme layers
├── script.js      # Core logic, live data formatting, storage lists & APIs
└── logo.png       # SkyPulse brand image asset


🚀 Local Installation & Deployment
Follow these quick steps to launch the repository locally:

1.Clone the Repository:
git clone [https://github.com/your-username/skypulse.git](https://github.com/your-username/skypulse.git)
cd skypulse

2.Setup Your Credentials: Open script.js and locate the configuration block on line 35. Make sure the API key variable holds your authorized string:
const API_KEY = 'YOUR_API_KEY';

3.Run Locally: Right-click inside index.html within your code editor to activate the Live Server extension, or simply run the index inside your chosen web browser using a local system reader.

Hosting on Vercel
SkyPulse is structurally optimized for serverless edge deployments. Since it utilizes native web stacks:

Push your repository folder directly up to GitHub.

Connect your repository to the Vercel workspace panel.

Vercel will instantly index the branch and provide a production-ready edge server URL!

📜 License
This project is open-source and free to adapt for educational purposes.
