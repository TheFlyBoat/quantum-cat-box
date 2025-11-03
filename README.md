# The Quantum Cat

An interactive web-based game where users interact with "quantum cats," collect them, and uncover their stories.

## Features

*   **Quantum Cat Reveal:** Open the box to reveal a cat in one of three states: Alive, Dead, or Paradox.
*   **Cat Collection:** Collect all the different cats.
*   **Cat Diary:** Save and read messages from the cats.
*   **Badges and Achievements:** Unlock badges for reaching milestones.
*   **Customization:** Customize the look of your quantum box.
*   **Persistent Navigation:** A sidebar menu for easy navigation between sections.

## Tech Stack

*   **Primary Language:** TypeScript
*   **Framework:** Next.js (with React)
*   **Styling:** Tailwind CSS with shadcn/ui components
*   **AI/Backend:** Google's Genkit for generative AI flows
*   **Database/Backend:** Firebase for data persistence and backend services
*   **Deployment:** Firebase App Hosting

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

To deploy this application, follow these steps:

1.  **Build the Docker Image:**
    Use the provided Makefile to build the Docker image:
    ```bash
    make build-docker
    ```

2.  **Deploy to Firebase:**
    Use the provided Makefile to deploy the application to Firebase:
    ```bash
    make deploy
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.