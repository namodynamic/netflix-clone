export const mockMovies = [
  {
    id: 1,
    title: "The Sandman",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 8.5,
    release_date: "2022-08-05",
    overview:
      "When The Sandman is pulled from his realm and imprisoned on Earth, he languishes for decades before finally escaping. Once free, he must retrieve the three tools that will restore his power and help him to rebuild his dominion, which has deteriorated in his absence.",
    genre_ids: [18, 14, 27],
  },
  {
    id: 2,
    title: "Squid Game",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 8.0,
    release_date: "2021-09-17",
    overview:
      "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
    genre_ids: [18, 53, 9648],
  },
  {
    id: 3,
    title: "Attack on London",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 7.2,
    release_date: "2023-03-15",
    overview: "A thrilling action movie about defending London from an unprecedented attack.",
    genre_ids: [28, 53],
  },
  {
    id: 4,
    title: "Raid 2",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 8.3,
    release_date: "2014-03-28",
    overview:
      "Only a short time after the first raid, Rama goes undercover with the thugs of Jakarta and plans to bring down the syndicate and uncover the corruption within his police force.",
    genre_ids: [28, 80, 53],
  },
  {
    id: 5,
    title: "Shark Whisperer",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 6.8,
    release_date: "2023-07-20",
    overview:
      "A marine biologist discovers she can communicate with sharks and must use this ability to save the ocean.",
    genre_ids: [12, 18],
  },
  {
    id: 6,
    title: "Cape Fear",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 7.3,
    release_date: "1991-11-15",
    overview:
      "A convicted rapist, released from prison after serving a fourteen-year sentence, stalks the family of the lawyer who originally defended him.",
    genre_ids: [53, 80],
  },
  {
    id: 7,
    title: "Kraven",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 7.1,
    release_date: "2024-01-12",
    overview: "The story of one of Marvel's most iconic villains, Kraven the Hunter.",
    genre_ids: [28, 12, 878],
  },
  {
    id: 8,
    title: "Infinite",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 6.5,
    release_date: "2021-06-10",
    overview: "A man discovers that his hallucinations are actually visions from past lives.",
    genre_ids: [28, 878, 53],
  },
  {
    id: 9,
    title: "Old Guard",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 6.7,
    release_date: "2020-07-10",
    overview:
      "A covert team of immortal mercenaries are suddenly exposed and must now fight to keep their identity a secret.",
    genre_ids: [28, 14, 53],
  },
  {
    id: 10,
    title: "Straw",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 7.8,
    release_date: "2023-11-03",
    overview: "A psychological thriller about a man who becomes obsessed with a mysterious woman.",
    genre_ids: [53, 18, 9648],
  },
]

for (let i = 11; i <= 35; i++) {
  mockMovies.push({
    id: i,
    title: `Movie ${i}`,
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: Math.random() * 3 + 6,
    release_date: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    overview: `This is the overview for Movie ${i}. An exciting story that will keep you on the edge of your seat.`,
    genre_ids: [28, 18, 53],
  })
}

export const mockTVShows = [
  {
    id: 101,
    title: "The Party",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 8.2,
    release_date: "2023-01-15",
    overview: "A group of friends navigate life, love, and career challenges in modern-day Lagos.",
    genre_ids: [18, 35],
  },
  {
    id: 102,
    title: "Battlefront",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 7.9,
    release_date: "2022-11-20",
    overview: "A military drama series following soldiers on the front lines of conflict.",
    genre_ids: [18, 10752],
  },
  {
    id: 103,
    title: "Untitled",
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: 8.7,
    release_date: "2023-05-10",
    overview: "A mysterious anthology series that explores the darker side of human nature.",
    genre_ids: [9648, 53, 18],
  },
]

for (let i = 104; i <= 130; i++) {
  mockTVShows.push({
    id: i,
    title: `TV Show ${i - 100}`,
    poster_path: "/placeholder.svg?height=400&width=300",
    backdrop_path: "/placeholder.svg?height=600&width=1200",
    vote_average: Math.random() * 3 + 6,
    release_date: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    overview: `This is the overview for TV Show ${i - 100}. A compelling series with great characters and storylines.`,
    genre_ids: [18, 35, 53],
  })
}

export const mockGames = [
  { id: 1, name: "GTA: San Andreas", icon: "https://occ-0-7334-1168.1.nflxso.net/dnm/api/v6/OZJggtSD_YDhN6m75VpSfcXfBD4/AAAABehVxPVms0HkBI58mxAmR5X8nwPR1snSY69YCvS1XU1aCLtBcWn3B6BsZ0uhB4gAHhZkIitcX7K6k2MhAnt6beZyZEFiU4J2MDTmnmrMnIaS-ssIACNAOY_LhWmqH4xlDdsVXA.png?r=ee1" },
  { id: 2, name: "Squid Game: Unleashed", icon: "https://occ-0-7334-1168.1.nflxso.net/dnm/api/v6/OZJggtSD_YDhN6m75VpSfcXfBD4/AAAABVA0uLKPqvdNGdMDKAKvtf3XHr6MX5o-Uy3KT7DU6mSEG7_ZjAiSG14NjkPGlpYUl1tR5sxNLSR4u-GgXPIEyS8_lGHwnWLRTALrllk2iTZBp7FC0QFF7RC8Ro8s1XAefYqN5Q.png?r=f70" },
  { id: 3, name: "Football Manager 2024 Mobile", icon: "https://occ-0-7334-1168.1.nflxso.net/dnm/api/v6/OZJggtSD_YDhN6m75VpSfcXfBD4/AAAABXk1YU83wKoVEAvMkfnh60zeIqx-UX9rhJqD54587Jj27E4-TbLCrh38Rdip1KSZyh1kasajqP7Hq8ZYs82FdkPOeSfuMjjhG05jDB1P4ymFyQFgzeqn37j9XHcu5ysaK8SyrQ.png?r=b63" },
  { id: 4, name: "Asphalt Xtreme", icon: "https://occ-0-7334-1168.1.nflxso.net/dnm/api/v6/OZJggtSD_YDhN6m75VpSfcXfBD4/AAAABRcFv83Gpm-bL6MPEhlqyJTfbD6BBGtpuwMs4NbiCU9LmzRauUaNWL9eT3q4JCrpV8z9gnb3N3RV04KsSPCLlxAgLRt7GI-9UQ6-Eh8X2l2koP6aK8bxyYvUkBS30PcP9cmAeA.png?r=925" },
  { id: 5, name: "Street Fighter IV CE", icon: "https://occ-0-7334-1168.1.nflxso.net/dnm/api/v6/OZJggtSD_YDhN6m75VpSfcXfBD4/AAAABbNRpsSLUUod4mXhHaRkB7qzpyr6Y8RhaiZPexSzoE82iSUWFATEdEG51BsZ6EFM_j6_4Rl4fSQ13lvp1ThRoOnjOFw6pChq5kyDRQ9vYTbCXi2iGp_uT0FII86iEk_11Eg7pw.png?r=b7c" },
  { id: 6, name: "Solitaire", icon: "https://occ-0-7334-1168.1.nflxso.net/dnm/api/v6/OZJggtSD_YDhN6m75VpSfcXfBD4/AAAABf8S8ar1JXGKtvCdpUAY1Aks7XjwFqjveNQYL5w0dIMXa3T0wEqOb9XKGnlWaX-ut1pttbDDI2j2WXuUtXBTA6vwguXJfdnV316HGezf2fqLIuqRK2ndIF2Iu7eom0rRHLuqaw.png?r=a6a" },
  { id: 7, name: "Into the Dead 2: Unleashed", icon: "https://occ-0-7334-1168.1.nflxso.net/dnm/api/v6/OZJggtSD_YDhN6m75VpSfcXfBD4/AAAABctujXKXxfr_4ETkdWhjFn53QRjNfKeVHxxbYqPhW2Ab8AI9vsd4DGIood_xgsPcPlIrJcc558i2Baa8iqCUrJ5BQI1unDQ4kCJ8mm6Vc1V8ETWqzWj4wo7mfikCBfqT8uYiCw.png?r=0f7" },
  { id: 8, name: "Sonic Mania Plus", icon: "https://occ-0-7334-1168.1.nflxso.net/dnm/api/v6/OZJggtSD_YDhN6m75VpSfcXfBD4/AAAABa888vB0aECcylzH9D2I4Ovh4Y75XPwKAKElh8WcVLnCZdwvwkmGpTgzOBqbP4wliMwIbyFrRPUw2q-oLVdLnwEGAVG4dXotivl3PQWXeaPXBd9S2ncgjljjNPBinVT1K8TFbg.png?r=773" },
]
