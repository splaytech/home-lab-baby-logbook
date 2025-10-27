const DinosaurWelcome = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Baby Dino */}
      <g transform="translate(280, 180)">
        <ellipse cx="0" cy="20" rx="35" ry="30" fill="#FFB5B5" />
        <circle cx="-8" cy="15" r="3" fill="#333" />
        <circle cx="8" cy="15" r="3" fill="#333" />
        <path d="M -5 22 Q 0 25 5 22" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="-12" cy="18" rx="8" ry="6" fill="#FF9999" opacity="0.5" />
        <ellipse cx="12" cy="18" rx="8" ry="6" fill="#FF9999" opacity="0.5" />
        <rect x="-20" y="45" width="12" height="18" rx="6" fill="#FFB5B5" />
        <rect x="8" y="45" width="12" height="18" rx="6" fill="#FFB5B5" />
      </g>

      {/* Parent T-Rex */}
      <g transform="translate(120, 100)">
        {/* Body */}
        <ellipse cx="0" cy="80" rx="60" ry="50" fill="#A8E6CF" />

        {/* Head */}
        <ellipse cx="0" cy="20" rx="45" ry="40" fill="#A8E6CF" />

        {/* Eyes */}
        <circle cx="-12" cy="15" r="5" fill="#333" />
        <circle cx="12" cy="15" r="5" fill="#333" />
        <circle cx="-10" cy="13" r="2" fill="white" />
        <circle cx="14" cy="13" r="2" fill="white" />

        {/* Smile */}
        <path d="M -15 25 Q 0 32 15 25" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Rosy cheeks */}
        <ellipse cx="-20" cy="22" rx="10" ry="7" fill="#98D8B8" opacity="0.6" />
        <ellipse cx="20" cy="22" rx="10" ry="7" fill="#98D8B8" opacity="0.6" />

        {/* Arms - waving */}
        <ellipse cx="-55" cy="60" rx="15" ry="35" fill="#A8E6CF" transform="rotate(-30 -55 60)" />
        <ellipse cx="55" cy="50" rx="15" ry="35" fill="#A8E6CF" transform="rotate(45 55 50)" />

        {/* Legs */}
        <rect x="-35" y="120" width="20" height="40" rx="10" fill="#A8E6CF" />
        <rect x="15" y="120" width="20" height="40" rx="10" fill="#A8E6CF" />

        {/* Tail */}
        <path d="M -50 100 Q -90 90 -100 60" stroke="#A8E6CF" strokeWidth="30" fill="none" strokeLinecap="round" />

        {/* Spikes on back */}
        <path d="M -10 55 L -15 35 L -5 50 M 0 50 L -5 30 L 5 45 M 10 55 L 5 35 L 15 50" fill="#98D8B8" />

        {/* Doctor coat */}
        <rect x="-45" y="70" width="90" height="55" rx="5" fill="white" opacity="0.9" />

        {/* Stethoscope */}
        <circle cx="25" cy="85" r="8" fill="#4A90E2" stroke="#333" strokeWidth="2" />
        <path d="M 25 93 Q 15 100 5 95" stroke="#333" strokeWidth="2.5" fill="none" />
        <circle cx="5" cy="95" r="3" fill="#333" />
      </g>

      {/* Hearts floating around */}
      <g opacity="0.6">
        <path d="M 50 60 L 55 50 Q 60 45 65 50 Q 70 45 75 50 L 65 65 Z" fill="#FFB5B5" />
        <path d="M 320 100 L 325 90 Q 330 85 335 90 Q 340 85 345 90 L 335 105 Z" fill="#A8E6CF" />
        <path d="M 180 40 L 183 33 Q 186 30 189 33 Q 192 30 195 33 L 189 43 Z" fill="#FFD4B5" />
      </g>
    </svg>
  );
};

export default DinosaurWelcome;
