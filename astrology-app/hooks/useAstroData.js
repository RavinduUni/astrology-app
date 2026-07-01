import { useAuth } from '../app/context/AuthContext';

export const ZODIAC_DATA = {
  Aries:       { symbol: '♈', element: 'Fire',  color: '#FF6B4A', dates: 'Mar 21 – Apr 19' },
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

/**
 * Returns home dashboard data sourced from AuthContext.
 * No direct API calls — data is fetched once at login by AuthContext.
 *
 * Returns the same shape the Home screen components expect:
 * { sign, zodiac, horoscope, luckyColor, luckyNumber, luckyTime,
 *   energyLevel, mood, moonPhase, moonEmoji, planets, date, loading, error }
 */
export function useAstroData() {
  const { homeData, homeDataLoading } = useAuth();

  if (!homeData) {
    return {
      data: null,
      loading: homeDataLoading,
      error: null,
    };
  }

  const sign   = homeData.sign || 'Leo';
  const zodiac = ZODIAC_DATA[sign] || ZODIAC_DATA['Leo'];

  const data = {
    sign,
    zodiac,
    horoscope:   homeData.summary    || '',
    luckyColor:  homeData.luckyColor || { name: 'Gold', hex: '#C8973A', emoji: '🟡' },
    luckyNumber: homeData.luckyNumber ?? 7,
    luckyTime:   homeData.luckyTime   || '',
    energyLevel: homeData.energy      ?? 70,
    mood:        homeData.mood        || 'Balanced',
    moonPhase:   homeData.moonPhase   || '',
    moonEmoji:   homeData.moonEmoji   || '🌕',
    planets:     homeData.planets     || [],
    date: homeData.date
      ? new Date(homeData.date).toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric',
        })
      : new Date().toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric',
        }),
  };

  return {
    data,
    loading: homeDataLoading,
    error: null,
  };
}
