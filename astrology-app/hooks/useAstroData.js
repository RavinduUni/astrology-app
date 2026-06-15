import { useState, useEffect } from 'react';

const ZODIAC_DATA = {
  Aries:       { symbol: '𓃵', element: 'Fire',  color: '#FF6B4A', dates: 'Mar 21 – Apr 19' },
  Taurus:      { symbol: '♉', element: 'Earth', color: '#4AFF8C', dates: 'Apr 20 – May 20' },
  Gemini:      { symbol: '♊', element: 'Air',   color: '#4AD4FF', dates: 'May 21 – Jun 20' },
  Cancer:      { symbol: '♋', element: 'Water', color: '#4A8CFF', dates: 'Jun 21 – Jul 22' },
  Leo:         { symbol: '♌', element: 'Fire',  color: '#FFB84A', dates: 'Jul 23 – Aug 22' },
  Virgo:       { symbol: '♍', element: 'Earth', color: '#8CFF4A', dates: 'Aug 23 – Sep 22' },
  Libra:       { symbol: '♎', element: 'Air',   color: '#D4A4FF', dates: 'Sep 23 – Oct 22' },
  Scorpio:     { symbol: '♏', element: 'Water', color: '#FF4A8C', dates: 'Oct 23 – Nov 21' },
  Sagittarius: { symbol: '♐', element: 'Fire',  color: '#FF884A', dates: 'Nov 22 – Dec 21' },
  Capricorn:   { symbol: '♑', element: 'Earth', color: '#8CAAFF', dates: 'Dec 22 – Jan 19' },
  Aquarius:    { symbol: '♒', element: 'Air',   color: '#4AFFEE', dates: 'Jan 20 – Feb 18' },
  Pisces:      { symbol: '♓', element: 'Water', color: '#AA88FF', dates: 'Feb 19 – Mar 20' },
};

const DAILY_HOROSCOPES = [
  "The cosmos align in your favour today. Venus in your fifth house brings unexpected joy and creative energy. Trust your instincts — a meaningful connection awaits.",
  "Mercury retrograde ends today, clearing mental fog. Ideas that have been dormant now bloom. Share your vision boldly with someone you trust.",
  "The Moon trines Jupiter, amplifying your emotional intelligence. Relationships deepen and financial decisions made now carry long-term benefit.",
  "Saturn reminds you of your discipline today. What feels like a setback is actually cosmic redirection. Stay grounded — your path is divinely guided.",
  "Mars energises your ambitions powerfully. A window of opportunity opens this afternoon. Move swiftly, but with intention.",
];

const PLANETS = [
  { name: 'Sun',     symbol: '☉', position: 'Gemini',      house: '10th', influence: 'positive' },
  { name: 'Moon',    symbol: '☾', position: 'Scorpio',     house: '3rd',  influence: 'neutral'  },
  { name: 'Mercury', symbol: '☿',  position: 'Cancer',      house: '11th', influence: 'positive' },
  { name: 'Venus',   symbol: '♀',  position: 'Leo',         house: '12th', influence: 'positive' },
  { name: 'Mars',    symbol: '♂',  position: 'Aries',       house: '8th',  influence: 'caution'  },
  { name: 'Jupiter', symbol: '♃',  position: 'Taurus',      house: '9th',  influence: 'positive' },
  { name: 'Saturn',  symbol: '♄',  position: 'Aquarius',    house: '6th',  influence: 'neutral'  },
  { name: 'Rahu',    symbol: '☊',  position: 'Pisces',      house: '7th',  influence: 'caution'  },
  { name: 'Ketu',    symbol: '☋',  position: 'Virgo',       house: '1st',  influence: 'neutral'  },
];

const LUCKY_COLORS = [
  { name: 'Royal Purple', hex: '#7B4FFF', emoji: '🟣' },
  { name: 'Golden Amber', hex: '#C8973A', emoji: '🟡' },
  { name: 'Ocean Teal',   hex: '#4AD4CC', emoji: '🔵' },
  { name: 'Rose Gold',    hex: '#E8A898', emoji: '🩷' },
  { name: 'Forest Green', hex: '#4AFF8C', emoji: '🟢' },
  { name: 'Deep Crimson', hex: '#FF4A6A', emoji: '🔴' },
];

const LUCKY_NUMBERS = [3, 7, 11, 14, 21, 28, 33, 42, 9, 18, 27];
const LUCKY_TIMES = [
  '06:00 – 07:30 AM',
  '09:15 – 10:45 AM',
  '12:00 – 01:30 PM',
  '03:30 – 05:00 PM',
  '07:00 – 08:30 PM',
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function useAstroData(userSign = 'Leo') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const rand = seededRandom(seed);

    const zodiac = ZODIAC_DATA[userSign] || ZODIAC_DATA['Leo'];
    const horoscope = DAILY_HOROSCOPES[Math.floor(rand() * DAILY_HOROSCOPES.length)];
    const luckyColor = LUCKY_COLORS[Math.floor(rand() * LUCKY_COLORS.length)];
    const luckyNumber = LUCKY_NUMBERS[Math.floor(rand() * LUCKY_NUMBERS.length)];
    const luckyTime = LUCKY_TIMES[Math.floor(rand() * LUCKY_TIMES.length)];
    const energyLevel = Math.floor(rand() * 30) + 65; // 65–95

    const moodOptions = ['Optimistic', 'Focused', 'Creative', 'Reflective', 'Energetic', 'Calm'];
    const mood = moodOptions[Math.floor(rand() * moodOptions.length)];

    setTimeout(() => {
      setData({
        sign: userSign,
        zodiac,
        horoscope,
        luckyColor,
        luckyNumber,
        luckyTime,
        energyLevel,
        mood,
        planets: PLANETS,
        date: today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        moonPhase: 'Waxing Gibbous',
        moonEmoji: '🌖',
      });
      setLoading(false);
    }, 600);
  }, [userSign]);

  return { data, loading };
}

export { ZODIAC_DATA };