# Professional Female Counsellor Website: Mrs. Preeti Pareek

A complete, modern, trustworthy, and fully interactive counselling website for **Mrs. Preeti Pareek (MA Psychology, PG Diploma in Guidance)**. Built with high-fidelity visual design, responsive layouts, and rich vanilla JavaScript interactions.

---

## 🛠️ Technology Stack & Architecture

This application strictly complies with the requested lightweight, framework-free, and dependency-free requirements:
*   **Markup:** Semantic HTML5 with complete ARIA attributes and schema metadata.
*   **Styling:** Pure CSS3 structured through variables for color schemes, spacing hierarchies, and smooth micro-interactions.
*   **Scripting:** Native Vanilla ES6 JavaScript organized into lightweight modular bundles.

No React, Tailwind CSS, Bootstrap, or jQuery dependencies are loaded. The entire website builds into static files and can be launched locally simply by opening `index.html` in any web browser.

---

## 📂 Project Structure

```text
counsellor-website/
│
├── index.html            # Main home page with hero, services, booking form, etc.
├── about.html            # About Preeti Pareek, credentials, and institutional collaborations
├── services.html         # Deep dive into the four core counselling services
├── contact.html          # Contact page with enquiry form and location coordinates
├── privacy-policy.html   # Privacy policy and confidentiality agreements
├── terms.html            # Terms of service, cancellation policy, and health disclaimers
│
├── css/
│   ├── style.css         # Main design system, typography, cards, and theme variables
│   └── responsive.css    # Mobile-first responsiveness, hamburger navigation, and timeline stacks
│
├── js/
│   ├── main.js           # Core navigation transitions, scroll effects, statistics, and FAQs
│   ├── booking.js        # Dynamic booking form validator, local persistence, and pre-fill queries
│   └── testimonials.js   # Touch-enabled slider with swipe, dots, and auto-rotation
│
└── README.md             # Setup and developer instruction file
```

---

## ⚡ Key Interactive Features

1.  **Counselling Service Selector (Pre-Fill Stream):** Clicking the "Book This Session" or "Book Service" buttons on the homepage or the dedicated `services.html` page automatically redirects the client to the booking section on the homepage, pre-selects the requested service in the selection dropdown, and highlights the form.
2.  **Modular Form Validator & Local Log:** The booking and quick enquiry forms feature robust client-side checks, character counts, and store successfully submitted appointments inside the local browser sandbox (using standard `localStorage`).
3.  **Touch-enabled Testimonial Slider:** Highly responsive slider featuring auto-slide (pauses on hover), manual pagination dots, arrow triggers, swipe/drag gesture detection on mobile, and keyboard navigation.
4.  **Availability Banner:** A real-time weekday status message ("Appointments available this week") that is easily editable via `js/main.js`.
5.  **Non-Intrusive Appointment Prompt:** A timed exit-intent-like modal that appears 20 seconds after launch to prompt a session booking (records state in `sessionStorage` to avoid repeating after dismissal).

---

## 📝 Editing Guidelines & Placeholders

All private coordinates and numbers are marked inside obvious brackets for easy find-and-replace:

### 1. Update Contact Details & Links
To customize phone lines or WhatsApp triggers, open `/js/main.js` and locate the top config object:
```javascript
const CONFIG = {
  phone: "+91-XXXXXXXXXX",        // Enter actual phone number
  whatsapp: "91XXXXXXXXXX",      // Enter mobile code + phone without spaces for links
  whatsappMessage: "Hello, I would like to book a counselling session. Please share the available timings."
};
```
This script dynamically updates all placeholder nodes (`[WhatsApp Number]`, `[Phone Number]`) and links across the entire multi-page application.

### 2. Update Pricing Plans
In `index.html`, locate the **Session Options** pricing cards. You can directly edit the prices inside:
```html
<div class="pricing-price">[Enter Price]</div>
```
No static values have been assumed, making it clean for direct client deployment.

---

## 🚀 Running and Bundling

The app is fully integrated with a Vite-based local configuration for rapid development:

1.  **Install development tools (Vite/Rollup):**
    ```bash
    npm install
    ```
2.  **Start the local development server:**
    ```bash
    npm run dev
    ```
3.  **Compile the production-ready optimized static distribution:**
    ```bash
    npm run build
    ```
    This builds all pages (`index.html`, `about.html`, `services.html`, etc.) and compiles their bundled assets into the `dist/` directory, perfect for Cloud Run, Netlify, or Apache/Nginx webservers.
