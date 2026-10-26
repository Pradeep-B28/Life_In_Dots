// history-data.js
// Moments shown on the "History" tab and in the reveal flashback.
// Copy this file to js/history-data.js exactly as it is.
// Do not add, remove or change any event, date or rank. The self-test depends on them.
//
// date:  India date, YYYY-MM-DD
// rank:  1 is the most widely remembered. Every rank is unique. Used to pick flashbacks.
// cat:   cricket, space, tamilnadu, india, tech, sport, world
// title: short name for lists and dot details
// when:  finishes the sentence "You were 6 when ..." (no full stop, starts lowercase unless a name)

export const HISTORY_EVENTS = [
  { id: "independence",       date: "1947-08-15", rank: 4,  cat: "india",     title: "Independence Day",                   when: "India became independent" },
  { id: "republic",           date: "1950-01-26", rank: 18, cat: "india",     title: "Republic Day",                       when: "India became a republic" },
  { id: "moon-walk",          date: "1969-07-21", rank: 3,  cat: "space",     title: "First Moon walk",                    when: "humans first walked on the Moon" },
  { id: "aryabhata",          date: "1975-04-19", rank: 26, cat: "space",     title: "India's first satellite",            when: "India's first satellite went into space" },
  { id: "colour-tv",          date: "1982-08-15", rank: 22, cat: "tech",      title: "Colour TV",                          when: "colour TV broadcasts began in India" },
  { id: "wc-1983",            date: "1983-06-25", rank: 5,  cat: "cricket",   title: "1983 World Cup",                     when: "India won its first Cricket World Cup" },
  { id: "first-indian-space", date: "1984-04-03", rank: 13, cat: "space",     title: "First Indian in space",              when: "the first Indian went to space" },
  { id: "mobile-call",        date: "1995-07-31", rank: 23, cat: "tech",      title: "First mobile call",                  when: "India's first mobile phone call was made" },
  { id: "internet",           date: "1995-08-15", rank: 17, cat: "tech",      title: "Internet for everyone",              when: "the internet opened to the public in India" },
  { id: "chennai-name",       date: "1996-07-17", rank: 24, cat: "tamilnadu", title: "Madras becomes Chennai",             when: "Madras was officially renamed Chennai" },
  { id: "y2k",                date: "2000-01-01", rank: 12, cat: "world",     title: "Year 2000",                          when: "the world welcomed the year 2000" },
  { id: "t20-2007",           date: "2007-09-24", rank: 6,  cat: "cricket",   title: "First T20 World Cup",                when: "India won the first T20 World Cup" },
  { id: "chandrayaan-1",      date: "2008-10-22", rank: 25, cat: "space",     title: "First Moon mission",                 when: "India launched its first mission to the Moon" },
  { id: "wc-2011",            date: "2011-04-02", rank: 1,  cat: "cricket",   title: "2011 World Cup",                     when: "India won the Cricket World Cup for the second time" },
  { id: "ct-2013",            date: "2013-06-23", rank: 28, cat: "cricket",   title: "Champions Trophy 2013",              when: "India won the Champions Trophy" },
  { id: "mars",               date: "2014-09-24", rank: 7,  cat: "space",     title: "Mars on the first try",              when: "India reached Mars on its very first try" },
  { id: "chennai-metro",      date: "2015-06-29", rank: 20, cat: "tamilnadu", title: "Chennai Metro opens",                when: "Chennai Metro carried its first passengers" },
  { id: "upi",                date: "2016-04-11", rank: 21, cat: "tech",      title: "UPI launches",                       when: "UPI payments were launched" },
  { id: "sats-104",           date: "2017-02-15", rank: 19, cat: "space",     title: "104 satellites",                     when: "India launched 104 satellites in one go" },
  { id: "olympic-gold",       date: "2021-08-07", rank: 14, cat: "sport",     title: "Olympic gold in athletics",          when: "India won its first Olympic gold in athletics" },
  { id: "chess-olympiad",     date: "2022-07-28", rank: 31, cat: "tamilnadu", title: "Chess Olympiad in Chennai",          when: "the Chess Olympiad opened in Chennai" },
  { id: "ai-chatbot",         date: "2022-11-30", rank: 16, cat: "tech",      title: "AI chatbots go public",              when: "a free AI chatbot opened to the public" },
  { id: "chandrayaan-3",      date: "2023-08-23", rank: 2,  cat: "space",     title: "Landing near the Moon's south pole", when: "India became the first country to land near the Moon's south pole" },
  { id: "aditya-l1",          date: "2023-09-02", rank: 30, cat: "space",     title: "Mission to the Sun",                 when: "India launched its first mission to study the Sun" },
  { id: "t20-2024",           date: "2024-06-29", rank: 8,  cat: "cricket",   title: "T20 World Cup 2024",                 when: "India won the T20 World Cup for the second time" },
  { id: "chess-champion",     date: "2024-12-12", rank: 11, cat: "tamilnadu", title: "World Chess Champion",               when: "a teenager from Chennai became World Chess Champion" },
  { id: "ct-2025",            date: "2025-03-09", rank: 29, cat: "cricket",   title: "Champions Trophy 2025",              when: "India won the Champions Trophy again" },
  { id: "pamban",             date: "2025-04-06", rank: 27, cat: "tamilnadu", title: "New Pamban Bridge",                  when: "the new Pamban rail bridge opened" },
  { id: "iss",                date: "2025-06-26", rank: 15, cat: "space",     title: "Indian on the space station",        when: "an Indian astronaut reached the International Space Station for the first time" },
  { id: "women-wc",           date: "2025-11-02", rank: 9,  cat: "cricket",   title: "Women's World Cup",                  when: "India's women won their first Cricket World Cup" },
  { id: "t20-2026",           date: "2026-03-08", rank: 10, cat: "cricket",   title: "T20 World Cup 2026",                 when: "India won the T20 World Cup for the third time" }
];

// Filter chips on the History tab. "more" covers india, tech, sport and world.
export const HISTORY_FILTERS = [
  { id: "all",       label: "All",        cats: null },
  { id: "cricket",   label: "Cricket",    cats: ["cricket"] },
  { id: "space",     label: "Space",      cats: ["space"] },
  { id: "tamilnadu", label: "Tamil Nadu", cats: ["tamilnadu"] },
  { id: "more",      label: "More",       cats: ["india", "tech", "sport", "world"] }
];
