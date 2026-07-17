// Centralized Mock Database utilizing browser's localStorage for Pulih App

export interface Psychologist {
  id: number;
  name: string;
  category: "Psikolog Umum" | "Psikolog Klinis";
  price: number;
  rating: number;
  availableToday: boolean;
  imageSrc: string;
  description: string;
  testimonial: {
    author: string;
    rating: number;
    text: string;
  };
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  cleanDays: string[];
  successRate: number;
}

export interface Booking {
  id: number;
  patientName: string;
  name: string;
  specialty: string;
  date: string;
  time: string;
  duration: string;
  challenge: string;
  image: string;
  status: "pending" | "accepted" | "rescheduled";
  meetLink?: string;
  rescheduleReason?: string;
  type?: "chat" | "meet";
}

export interface Post {
  id: number;
  text: string;
  author: string;
  time: string;
  streak: number;
  comments: number;
  likes: number;
  category: "Advice" | "Support" | "Motivation";
  likedByUser?: boolean;
}

// Minimalist, premium-looking vector avatars as Data URIs so they load reliably offline
const generateAvatar = (seed: string, bgColor: string, accentColor: string, isFemale = false) => {
  const hair = isFemale 
    ? `<path d="M 25 45 C 20 20, 80 20, 75 45 C 80 60, 70 70, 75 80" stroke="${accentColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
       <circle cx="50" cy="30" r="16" fill="${accentColor}"/>`
    : `<path d="M 30 35 C 40 20, 60 20, 70 35" stroke="${accentColor}" stroke-width="10" fill="none" stroke-linecap="round"/>`;

  const features = isFemale 
    ? `<circle cx="43" cy="46" r="3" fill="${accentColor}"/>
       <circle cx="57" cy="46" r="3" fill="${accentColor}"/>
       <path d="M 46 54 Q 50 58 54 54" stroke="${accentColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    : `<circle cx="42" cy="48" r="3" fill="${accentColor}"/>
       <circle cx="58" cy="48" r="3" fill="${accentColor}"/>
       <path d="M 45 56 Q 50 60 55 56" stroke="${accentColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="24" fill="${bgColor}"/>
      <!-- Hair background for female -->
      ${isFemale ? hair : ""}
      <!-- Body/Shoulders -->
      <path d="M 20 90 Q 20 70 50 70 Q 80 70 80 90" fill="${accentColor}" opacity="0.85"/>
      <!-- Head -->
      <circle cx="50" cy="48" r="20" fill="#FFF1EB"/>
      <!-- Hair for male -->
      ${!isFemale ? hair : ""}
      <!-- Features -->
      ${features}
      <!-- Glasses if doctor look -->
      <circle cx="42" cy="48" r="7" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.6"/>
      <circle cx="58" cy="48" r="7" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.6"/>
      <line x1="49" y1="48" x2="51" y2="48" stroke="${accentColor}" stroke-width="2"/>
    </svg>
  `.trim().replace(/"/g, "'").replace(/\s+/g, " ");

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const DEFAULT_PSYCHOLOGISTS: Psychologist[] = [
  {
    id: 1,
    name: "Dr. Ayu Rahmawati, M.Psi.",
    category: "Psikolog Umum",
    price: 150000,
    rating: 4.5,
    availableToday: true,
    imageSrc: generateAvatar("ayu", "#EFFBF4", "#0b744f", true),
    description: "Spesialis dalam kecemasan umum, stres akademik, dan pengembangan diri. Berpengalaman 5+ tahun membimbing pemuda bangkit dari kebiasaan buruk.",
    testimonial: {
      author: "Ano**mp",
      rating: 4.5,
      text: "Sangat sabar mendengarkan. Penjelasannya terstruktur dan memberikan langkah konkrit untuk latihan pernapasan saat cemas datang."
    }
  },
  {
    id: 2,
    name: "Dr. Budi Santoso, Psi.",
    category: "Psikolog Klinis",
    price: 200000,
    rating: 4.8,
    availableToday: false,
    imageSrc: generateAvatar("budi", "#EBF5FF", "#1E40AF", false),
    description: "Fokus pada terapi kognitif perilaku (CBT), kecanduan media sosial/game/pornografi, serta pemulihan trauma emosional masa lalu.",
    testimonial: {
      author: "Daf**aa",
      rating: 5,
      text: "Sesi konseling yang luar biasa. Saya jadi memahami pemicu utama (triggers) saya dan bagaimana cara melakukan distraksi sehat."
    }
  },
  {
    id: 3,
    name: "Dr. Citra Dewi, M.Psi.",
    category: "Psikolog Umum",
    price: 120000,
    rating: 4.3,
    availableToday: true,
    imageSrc: generateAvatar("citra", "#FEF3C7", "#D97706", true),
    description: "Membantu mengatasi kesepian mendalam, kecemasan sosial, dan manajemen emosi sehari-hari melalui mindfulness dan konseling empatik.",
    testimonial: {
      author: "Riz**ky",
      rating: 4,
      text: "Sangat menenangkan diajak bicara. Suasana konsultasi santai tapi tetap profesional."
    }
  },
  {
    id: 4,
    name: "Dr. Dimas Prakoso, Psi.",
    category: "Psikolog Klinis",
    price: 175000,
    rating: 4.7,
    availableToday: true,
    imageSrc: generateAvatar("dimas", "#F3E8FF", "#6D28D9", false),
    description: "Ahli dalam manajemen depresi klinis, adiksi berat, dan kecemasan dengan komorbiditas fisik. Menggunakan pendekatan holistik.",
    testimonial: {
      author: "Ir**fan",
      rating: 5,
      text: "Dr. Dimas sangat memahami beban psikologis adiksi. Penjelasannya secara sains tentang dopamin sangat mencerahkan."
    }
  },
  {
    id: 5,
    name: "Dr. Eka Putri, M.Psi.",
    category: "Psikolog Klinis",
    price: 250000,
    rating: 4.9,
    availableToday: false,
    imageSrc: generateAvatar("eka", "#FCE7F3", "#DB2777", true),
    description: "Pendampingan klinis intensif untuk pemulihan adiksi jangka panjang, hubungan interpersonal beracun, dan penguatan konsep diri.",
    testimonial: {
      author: "Sa**ra",
      rating: 5,
      text: "Pelayanan terbaik! Sangat dihargai, tidak dihakimi sama sekali. Benar-benar ruang aman (safe space)."
    }
  }
];

const DEFAULT_POSTS: Post[] = [
  {
    id: 1,
    text: "Hindari pemicu (triggers) sekecil apa pun. Jauhkan HP dari kasur sebelum tidur terbukti sangat membantu mengurangi kecenderungan relapse.",
    author: "djd*****",
    time: "08:43",
    streak: 12,
    comments: 2,
    likes: 15,
    category: "Advice",
  },
  {
    id: 2,
    text: "Menerapkan aturan tanpa gadget setelah jam 20:30. Pikiran jadi jauh lebih tenang dan tidur lebih nyenyak tanpa gangguan godaan malam.",
    author: "Dav*****",
    time: "23:59",
    streak: 54,
    comments: 4,
    likes: 38,
    category: "Advice",
  },
  {
    id: 3,
    text: "Baru saja melewati fase kritis dorongan kuat (urgency) malam ini. Menyetel timer 20 menit dan push-up terbukti mengalihkan fokus otak saya!",
    author: "Eri*****",
    time: "02:59",
    streak: 5,
    comments: 7,
    likes: 42,
    category: "Support",
  },
  {
    id: 4,
    text: "Ada yang punya tips menghadapi rasa bosan di akhir pekan? Biasanya rasa bosan adalah celah paling rawan bagi saya.",
    author: "Far*****",
    time: "21:30",
    streak: 7,
    comments: 11,
    likes: 9,
    category: "Support",
  },
  {
    id: 5,
    text: "Setiap hari bersih adalah kemenangan yang layak dirayakan. Jangan bandingkan prosesmu dengan orang lain. Semangat berjuang kawan! 💚",
    author: "And*****",
    time: "06:00",
    streak: 30,
    comments: 3,
    likes: 89,
    category: "Motivation",
  }
];

// Helper to check for client side
const isClient = () => typeof window !== "undefined";

export const mockDb = {
  // Psychologist API
  getPsychologists: (): Psychologist[] => {
    if (!isClient()) return DEFAULT_PSYCHOLOGISTS;
    const data = localStorage.getItem("pulih-psychologists");
    if (!data) {
      localStorage.setItem("pulih-psychologists", JSON.stringify(DEFAULT_PSYCHOLOGISTS));
      return DEFAULT_PSYCHOLOGISTS;
    }
    return JSON.parse(data);
  },

  getPsychologistById: (id: number): Psychologist | undefined => {
    const list = mockDb.getPsychologists();
    return list.find((p) => p.id === id);
  },

  // Booking API
  getBookings: (): Booking[] => {
    if (!isClient()) return [];
    const data = localStorage.getItem("pulih-bookings");
    let bookings: Booking[] = [];
    if (!data) {
      // Seed default data
      const defaults: Booking[] = [
        {
          id: 101,
          patientName: "Alex Morgan",
          name: "Dr. Ayu Rahmawati, M.Psi.",
          specialty: "Psikolog Umum",
          date: "17 July 2026",
          time: "13:00 WIB",
          duration: "1 Hour",
          challenge: "Mengalami kecemasan berlebih saat hendak presentasi.",
          image: generateAvatar("ayu", "#EFFBF4", "#0b744f", true),
          status: "pending",
          type: "chat"
        }
      ];
      localStorage.setItem("pulih-bookings", JSON.stringify(defaults));
      bookings = defaults;
    } else {
      bookings = JSON.parse(data);
    }

    // Dynamic seeding for custom psychologist if they don't have bookings yet
    const savedName = localStorage.getItem("psychologist-name");
    const savedProfession = localStorage.getItem("psychologist-profession");
    if (savedName) {
      const hasBookingsForCustom = bookings.some(b => b.name === savedName);
      if (!hasBookingsForCustom) {
        const specialty = savedProfession === "umum" ? "Psikolog Umum" : "Psikolog Klinis";
        const customDefaults: Booking[] = [
          {
            id: Date.now() + 1,
            patientName: "Aditya Pratama",
            name: savedName,
            specialty,
            date: "17 July 2026",
            time: "14:00 - 15:00 WIB",
            duration: "1 Hour",
            challenge: "Mengalami stres berat karena tekanan pekerjaan dan kesulitan membagi waktu.",
            image: generateAvatar("aditya", "#EBF5FF", "#1E40AF", false),
            status: "accepted",
            type: "chat"
          },
          {
            id: Date.now() + 2,
            patientName: "Rian Hidayat",
            name: savedName,
            specialty,
            date: "17 July 2026",
            time: "16:00 - 17:00 WIB",
            duration: "1 Hour",
            challenge: "Sering mengalami panic attack tiba-tiba di tempat kerja.",
            image: generateAvatar("rian", "#F3E8FF", "#6D28D9", false),
            status: "accepted",
            meetLink: "https://meet.google.com/abc-defg-hij",
            type: "meet"
          },
          {
            id: Date.now() + 3,
            patientName: "Siti Aminah",
            name: savedName,
            specialty,
            date: "18 July 2026",
            time: "10:00 - 11:00 WIB",
            duration: "1 Hour",
            challenge: "Kecemasan akademik menjelang ujian akhir kelulusan.",
            image: generateAvatar("siti", "#FCE7F3", "#DB2777", true),
            status: "pending",
            type: "meet"
          }
        ];
        bookings = [...customDefaults, ...bookings];
        localStorage.setItem("pulih-bookings", JSON.stringify(bookings));
      }
    }

    return bookings;
  },

  saveBooking: (booking: Omit<Booking, "id" | "status">): Booking => {
    const list = mockDb.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: Date.now(),
      status: "pending"
    };
    const updated = [newBooking, ...list];
    localStorage.setItem("pulih-bookings", JSON.stringify(updated));
    return newBooking;
  },

  updateBookingStatus: (
    id: number,
    status: "accepted" | "rescheduled",
    updates?: { meetLink?: string; date?: string; time?: string; rescheduleReason?: string }
  ): Booking | undefined => {
    const list = mockDb.getBookings();
    let updatedBooking: Booking | undefined;

    const updated = list.map((item) => {
      if (item.id === id) {
        updatedBooking = {
          ...item,
          status,
          ...updates
        };
        return updatedBooking;
      }
      return item;
    });

    localStorage.setItem("pulih-bookings", JSON.stringify(updated));
    return updatedBooking;
  },

  // Community Feed API
  getCommunityPosts: (): Post[] => {
    if (!isClient()) return DEFAULT_POSTS;
    const data = localStorage.getItem("pulih-posts");
    if (!data) {
      localStorage.setItem("pulih-posts", JSON.stringify(DEFAULT_POSTS));
      return DEFAULT_POSTS;
    }
    return JSON.parse(data);
  },

  saveCommunityPost: (text: string, category: "Advice" | "Support" | "Motivation"): Post => {
    const list = mockDb.getCommunityPosts();
    const activeStreak = mockDb.getUserStats().currentStreak;
    const newPost: Post = {
      id: Date.now(),
      text,
      category,
      author: "Me (You)",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      streak: activeStreak,
      comments: 0,
      likes: 0
    };
    const updated = [newPost, ...list];
    localStorage.setItem("pulih-posts", JSON.stringify(updated));
    return newPost;
  },

  likeCommunityPost: (id: number): Post | undefined => {
    const list = mockDb.getCommunityPosts();
    let updatedPost: Post | undefined;

    const updated = list.map((post) => {
      if (post.id === id) {
        const liked = !post.likedByUser;
        updatedPost = {
          ...post,
          likedByUser: liked,
          likes: liked ? post.likes + 1 : post.likes - 1
        };
        return updatedPost;
      }
      return post;
    });

    localStorage.setItem("pulih-posts", JSON.stringify(updated));
    return updatedPost;
  },

  // User Stats API
  getUserStats: (): UserStats => {
    if (!isClient()) {
      return { currentStreak: 0, longestStreak: 0, cleanDays: [], successRate: 100 };
    }
    const streak = localStorage.getItem("pulih-streak");
    const longest = localStorage.getItem("pulih-longest-streak");
    const cleanDaysData = localStorage.getItem("pulih-clean-days");
    
    const currentStreak = streak ? Number(streak) : 0;
    const longestStreak = longest ? Number(longest) : 0;
    const cleanDays = cleanDaysData ? JSON.parse(cleanDaysData) : [];
    
    const relapses = localStorage.getItem("pulih-relapses");
    const relapseCount = relapses ? Number(relapses) : 0;
    
    const totalDays = cleanDays.length + relapseCount;
    const successRate = totalDays > 0 ? Math.round((cleanDays.length / totalDays) * 100) : 100;
    
    return {
      currentStreak,
      longestStreak,
      cleanDays,
      successRate
    };
  },

  checkIn: (): UserStats => {
    const stats = mockDb.getUserStats();
    const todayStr = new Date().toISOString().split("T")[0];
    
    let updatedCleanDays = [...stats.cleanDays];
    let updatedStreak = stats.currentStreak;
    
    if (!updatedCleanDays.includes(todayStr)) {
      updatedCleanDays.push(todayStr);
      updatedStreak += 1;
    }
    
    const updatedLongest = Math.max(stats.longestStreak, updatedStreak);
    
    localStorage.setItem("pulih-streak", String(updatedStreak));
    localStorage.setItem("pulih-longest-streak", String(updatedLongest));
    localStorage.setItem("pulih-clean-days", JSON.stringify(updatedCleanDays));
    
    return {
      currentStreak: updatedStreak,
      longestStreak: updatedLongest,
      cleanDays: updatedCleanDays,
      successRate: mockDb.getUserStats().successRate
    };
  },

  recordRelapse: (): UserStats => {
    const stats = mockDb.getUserStats();
    
    const relapses = localStorage.getItem("pulih-relapses");
    const relapseCount = (relapses ? Number(relapses) : 0) + 1;
    localStorage.setItem("pulih-relapses", String(relapseCount));
    
    localStorage.setItem("pulih-streak", "0");
    
    const todayStr = new Date().toISOString().split("T")[0];
    const updatedCleanDays = stats.cleanDays.filter(d => d !== todayStr);
    localStorage.setItem("pulih-clean-days", JSON.stringify(updatedCleanDays));
    
    return {
      currentStreak: 0,
      longestStreak: stats.longestStreak,
      cleanDays: updatedCleanDays,
      successRate: mockDb.getUserStats().successRate
    };
  }
};
