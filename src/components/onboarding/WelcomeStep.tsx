
import React from 'react';

interface WelcomeStepProps {
  onGetStarted: () => void;
  onAddIdeaFirst: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onGetStarted, onAddIdeaFirst }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" data-ev="onboarding_welcome_shown">
      <main
        role="main"
        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg max-w-2xl w-full text-center"
        aria-labelledby="welcome-title"
        aria-describedby="welcome-subtitle"
      >
        {/* Placeholder for icon/emoji */}
        <div className="text-6xl mb-4">✨</div>

        <h1 id="welcome-title" className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
          Revive your side projects.
        </h1>
        <p id="welcome-subtitle" className="text-base md:text-lg text-muted-foreground mb-8">
          One tiny next step at a time.
        </p>

        <div className="flex flex-col space-y-4">
          <button
            className="h-12 px-6 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onGetStarted}
            onKeyDown={(e) => e.key === 'Enter' && onGetStarted()}
            aria-label="Get Started"
            data-ev="onboarding_path_start"
          >
            Get Started
          </button>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={(e) => {
              e.preventDefault();
              onAddIdeaFirst();
            }}
            aria-label="I'll add an idea first"
            data-ev="onboarding_jump_to_idea"
          >
            I’ll add an idea first
          </a>
        </div>
      </main>
    </div>
  );
};

export default WelcomeStep;
