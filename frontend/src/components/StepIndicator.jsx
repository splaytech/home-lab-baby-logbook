const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />

        {/* Progress bar fill */}
        <div
          className="absolute top-5 left-0 h-1 bg-mint-500 rounded-full transition-all duration-500"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-300 relative z-10
                    ${
                      isCompleted
                        ? 'bg-mint-500 text-white'
                        : isCurrent
                        ? 'bg-mint-500 text-white ring-4 ring-mint-200 scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Label */}
                <div
                  className={`
                    mt-2 text-xs md:text-sm font-medium text-center transition-colors
                    ${isCurrent ? 'text-mint-700' : 'text-gray-600'}
                  `}
                >
                  {step.icon && <span className="block mb-1">{step.icon}</span>}
                  <span className="hidden sm:block">{step.label}</span>
                  <span className="block sm:hidden">{step.shortLabel || step.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current step title */}
      <div className="text-center mt-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800">
          {steps[currentStep].title}
        </h2>
        {steps[currentStep].description && (
          <p className="text-gray-600 mt-2">{steps[currentStep].description}</p>
        )}
      </div>
    </div>
  );
};

export default StepIndicator;
