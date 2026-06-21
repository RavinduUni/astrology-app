import { useState, useEffect } from 'react';
import { getDailyHoroscope, getAuspiciousTimes } from '../services/api';

export const ZODIAC_DATA = {
  Aries: { symbol: '𓃵', element: 'Fire', color: '#FF6B4A', dates: 'Mar 21 – Apr 19' },
  Taurus: { symbol: '♉', element: 'Earth', color: '#4AFF8C', dates: 'Apr 20 – May 20' },
  Gemini: { symbol: '♊', element: 'Air', color: '#4AD4FF', dates: 'May 21 – Jun 20' },
  Cancer: { symbol: '♋', element: 'Water', color: '#4A8CFF', dates: 'Jun 21 – Jul 22' },
  Leo: { symbol: '♌', element: 'Fire', color: '#FFB84A', dates: 'Jul 23 – Aug 22' },
  Virgo: { symbol: '♍', element: 'Earth', color: '#8CFF4A', dates: 'Aug 23 – Sep 22' },
  Libra: { symbol: '♎', element: 'Air', color: '#D4A4FF', dates: 'Sep 23 – Oct 22' },
  Scorpio: { symbol: '♏', element: 'Water', color: '#FF4A8C', dates: 'Oct 23 – Nov 21' },
  Sagittarius: { symbol: '♐', element: 'Fire', color: '#FF884A', dates: 'Nov 22 – Dec 21' },
  Capricorn: { symbol: '♑', element: 'Earth', color: '#8CAAFF', dates: 'Dec 22 – Jan 19' },
  Aquarius: { symbol: '♒', element: 'Air', color: '#4AFFEE', dates: 'Jan 20 – Feb 18' },
  Pisces: { symbol: '♓', element: 'Water', color: '#AA88FF', dates: 'Feb 19 – Mar 20' },
};

// Fallback mock used when the backend is unavailable
function mockData(userSign) {
  const zodiac = ZODIAC_DATA[userSign] || ZODIAC_DATA['Leo'];
  const today = new Date();
  return {
    sign: userSign,
    zodiac,
    horoscope:
      'The cosmos align in your favour today. Venus in your fifth house brings unexpected joy and creative energy.',
    luckyColor: { name: 'Golden Amber', hex: '#C8973A', emoji: '🟡' },
    luckyNumber: 7,
    luckyTime: '06:00 – 07:30 AM',
    energyLevel: 78,
    mood: 'Optimistic',
    moonPhase: 'Waxing Gibbous',
    moonEmoji: '🌖',
    planets: [
      { name: 'Sun', symbol: '☉', position: 'Gemini', house: '10th', influence: 'positive' },
      { name: 'Moon', symbol: '☾', position: 'Scorpio', house: '3rd', influence: 'neutral' },
      { name: 'Mercury', symbol: '☿', position: 'Cancer', house: '11th', influence: 'positive' },
      { name: 'Venus', symbol: '♀', position: 'Leo', house: '12th', influence: 'positive' },
      { name: 'Mars', symbol: '♂', position: 'Aries', house: '8th', influence: 'caution' },
      { name: 'Jupiter', symbol: '♃', position: 'Taurus', house: '9th', influence: 'positive' },
      { name: 'Saturn', symbol: '♄', position: 'Aquarius', house: '6th', influence: 'neutral' },
      { name: 'Rahu', symbol: '☊', position: 'Pisces', house: '7th', influence: 'caution' },
      { name: 'Ketu', symbol: '☋', position: 'Virgo', house: '1st', influence: 'neutral' },
    ],
    date: today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  };
}

export function useAstroData(userId, userSign = 'Leo') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      // No userId yet — use mock so the home screen still renders during auth flow
      if (!userId) {
        setData(mockData(userSign));
        setLoading(false);
        return;
      }

      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      try {
        const horoscope = await getDailyHoroscope({ userId, date });
        if (cancelled) return;

        setData({
          sign: horoscope.sign ?? userSign,
          zodiac: ZODIAC_DATA[horoscope.sign] ?? ZODIAC_DATA[userSign],
          horoscope: horoscope.summary,
          luckyColor: horoscope.luckyColor,
          luckyNumber: horoscope.luckyNumber,
          luckyTime: horoscope.luckyTime,
          energyLevel: horoscope.energy,
          mood: horoscope.mood,
          moonPhase: horoscope.moonPhase,
          moonEmoji: horoscope.moonEmoji,
          planets: horoscope.planets,
          date: new Date(date).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
          }),
        });
      } catch (err) {
        if (cancelled) return;
        // Fall back to mock so the UI is never broken
        setData(mockData(userSign));
        setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [userId, userSign]);

  return { data, loading, error };
}
