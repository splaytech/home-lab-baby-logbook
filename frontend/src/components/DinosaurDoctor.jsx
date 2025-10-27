const DinosaurDoctor = ({ className = '', message = '' }) => {
  return (
    <div className="relative inline-block">
      <svg
        viewBox="0 0 200 200"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cute T-Rex with doctor coat */}
        <g transform="translate(100, 80)">
          {/* Body */}
          <ellipse cx="0" cy="50" rx="40" ry="35" fill="#A8E6CF" />

          {/* Head */}
          <ellipse cx="0" cy="0" rx="35" ry="30" fill="#A8E6CF" />

          {/* Eyes */}
          <circle cx="-10" cy="-5" r="4" fill="#333" />
          <circle cx="10" cy="-5" r="4" fill="#333" />
          <circle cx="-8" cy="-7" r="1.5" fill="white" />
          <circle cx="12" cy="-7" r="1.5" fill="white" />

          {/* Smile */}
          <path d="M -10 5 Q 0 10 10 5" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Rosy cheeks */}
          <ellipse cx="-18" cy="2" rx="6" ry="4" fill="#FFB5B5" opacity="0.6" />
          <ellipse cx="18" cy="2" rx="6" ry="4" fill="#FFB5B5" opacity="0.6" />

          {/* Arms */}
          <ellipse cx="-35" cy="40" rx="10" ry="20" fill="#A8E6CF" transform="rotate(-20 -35 40)" />
          <ellipse cx="35" cy="40" rx="10" ry="20" fill="#A8E6CF" transform="rotate(20 35 40)" />

          {/* Legs */}
          <rect x="-25" y="80" width="15" height="25" rx="7" fill="#A8E6CF" />
          <rect x="10" y="80" width="15" height="25" rx="7" fill="#A8E6CF" />

          {/* Tail */}
          <path d="M -35 65 Q -55 60 -60 45" stroke="#A8E6CF" strokeWidth="20" fill="none" strokeLinecap="round" />

          {/* Spikes */}
          <path d="M -8 25 L -12 15 L -4 22 M 0 22 L -4 12 L 4 20 M 8 25 L 4 15 L 12 22" fill="#98D8B8" />

          {/* Doctor coat */}
          <rect x="-30" y="45" width="60" height="40" rx="3" fill="white" opacity="0.95" />

          {/* Stethoscope */}
          <circle cx="18" cy="55" r="5" fill="#4A90E2" stroke="#333" strokeWidth="1.5" />
          <path d="M 18 60 Q 10 65 3 62" stroke="#333" strokeWidth="2" fill="none" />
          <circle cx="3" cy="62" r="2" fill="#333" />

          {/* Medical cross on coat */}
          <g fill="#E74C3C">
            <rect x="-5" y="60" width="10" height="3" />
            <rect x="-1.5" y="56.5" width="3" height="10" />
          </g>
        </g>
      </svg>

      {/* Speech bubble with message */}
      {message && (
        <div className="absolute -top-2 left-full ml-4 bg-white px-4 py-2 rounded-lg shadow-lg border-2 border-mint-200 whitespace-nowrap">
          <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
          <p className="text-sm text-gray-700 font-medium">{message}</p>
        </div>
      )}
    </div>
  );
};

export default DinosaurDoctor;
