/**
 * ProductReviews — Static review component for Kuwait Marketplace
 * Reviews are hardcoded per product category (no backend review system needed for demo)
 * Add data-testid attributes for Playwright verification
 */

interface Review {
  id: string
  author: string
  rating: number
  date: string
  title: string
  body: string
  verified: boolean
}

interface ReviewSummary {
  average: number
  total: number
  breakdown: { stars: number; count: number }[]
}

// ─── Review banks by category ───────────────────────────────────────────────

const ELECTRONICS_REVIEWS: Review[] = [
  {
    id: "e1",
    author: "Mohammed Al-Rashidi",
    rating: 5,
    date: "15 January 2026",
    title: "Exceptional performance and camera quality",
    body: "The camera on this device is absolutely stunning. I've been testing it in low-light conditions around Kuwait City at night and the results are incredible — sharp, detailed, no noise. Battery life easily gets me through a full day with heavy use. The screen brightness is perfect for outdoor use even in direct Gulf sun.",
    verified: true,
  },
  {
    id: "e2",
    author: "Ahmed Al-Muftah",
    rating: 5,
    date: "3 February 2026",
    title: "Best purchase I've made this year",
    body: "Upgraded from my previous model and the speed difference is night and day. Apps load instantly, no lag at all during multitasking. The 5G connectivity is blazing fast on Zain and Ooredoo networks here in Kuwait. Build quality feels premium — the titanium finish is gorgeous.",
    verified: true,
  },
  {
    id: "e3",
    author: "Raj Patel",
    rating: 4,
    date: "22 January 2026",
    title: "Great device, minor software quirks",
    body: "Overall an excellent product. The display is vibrant with incredible colour accuracy — perfect for watching content. Battery life is good for 80% of my use cases. Docked one star because of occasional software glitches that I hope will be resolved in the next update. Storage performance is top-tier.",
    verified: true,
  },
  {
    id: "e4",
    author: "James Mitchell",
    rating: 5,
    date: "8 February 2026",
    title: "Worth every fils",
    body: "I was hesitant about the price but this device has completely won me over. The processor handles everything I throw at it — video editing, gaming, heavy multitasking. Screen resolution is stunning. The fast charging is incredibly convenient; I go from 20% to 80% in under 30 minutes.",
    verified: true,
  },
  {
    id: "e5",
    author: "David Kim",
    rating: 4,
    date: "10 December 2025",
    title: "Solid upgrade with impressive specs",
    body: "The display quality is leagues ahead of my old device. Colours pop, refresh rate is buttery smooth, and the brightness handles the harsh Kuwait sunlight well. Battery life is decent but I'd recommend getting a portable charger for heavy days. Camera system is versatile and produces professional-grade shots.",
    verified: true,
  },
  {
    id: "e6",
    author: "Sarah Johnson",
    rating: 5,
    date: "28 January 2026",
    title: "Exceeded all my expectations",
    body: "I've owned many flagship devices and this one sits comfortably at the top. The build quality is exceptional, the camera detail is extraordinary, and the battery optimization is impressive. The face unlock is fast and reliable. Delivery from Kuwait Marketplace was surprisingly quick too!",
    verified: true,
  },
  {
    id: "e7",
    author: "Fatima Al-Sabah",
    rating: 3,
    date: "5 January 2026",
    title: "Good but gets warm under load",
    body: "The device is fast and the camera is excellent for daily photos. My main concern is thermal management — it gets noticeably warm during extended gaming or video recording sessions. The display is beautiful and the software is intuitive. Overall it's a good device but I expected better thermal performance at this price point.",
    verified: true,
  },
]

const LAPTOP_REVIEWS: Review[] = [
  {
    id: "l1",
    author: "Ahmed Al-Muftah",
    rating: 5,
    date: "20 January 2026",
    title: "The best laptop I've ever owned",
    body: "I use this for video editing and 3D rendering and it handles everything flawlessly. The processor performance is unreal — render times cut in half compared to my previous laptop. The display colour accuracy is perfect for creative work. Battery lasts a genuine 8-10 hours of moderate use. Highly recommend for professionals.",
    verified: true,
  },
  {
    id: "l2",
    author: "Tom Anderson",
    rating: 5,
    date: "14 February 2026",
    title: "Worth the premium price",
    body: "I was skeptical about the price but after two months of daily use I'm a complete convert. The build quality is exceptional — solid aluminium chassis, premium keyboard feel, beautiful trackpad. The display is stunning for both work and entertainment. Fan noise is minimal even under load.",
    verified: true,
  },
  {
    id: "l3",
    author: "Li Chen",
    rating: 4,
    date: "31 January 2026",
    title: "Excellent performance, limited port selection",
    body: "Performance is absolutely top-tier. Software compilation speeds, running VMs, data processing — all handled without breaking a sweat. Battery endurance is remarkable for the performance it delivers. My only gripe is the limited port selection requiring adapters for some legacy devices.",
    verified: true,
  },
  {
    id: "l4",
    author: "Maryam Al-Jassem",
    rating: 5,
    date: "2 February 2026",
    title: "Transformed my workflow",
    body: "As a graphic designer, having a laptop with accurate colour reproduction is essential. This delivers perfectly — the display calibration is spot-on out of the box. The keyboard is comfortable for long typing sessions and the touchpad gestures are smooth. Worth every dinar.",
    verified: true,
  },
  {
    id: "l5",
    author: "Carlos Rodriguez",
    rating: 5,
    date: "7 December 2025",
    title: "Fast, silent, and beautiful",
    body: "Coming from a Windows laptop this is a revelation. The machine is whisper-quiet even when processing heavy tasks. The display is the best I've used — crystal clear text, vibrant colours, incredible dynamic range. Battery management is excellent. Build quality is solid and premium-feeling.",
    verified: true,
  },
]

const FASHION_REVIEWS: Review[] = [
  {
    id: "f1",
    author: "Nour Al-Harbi",
    rating: 5,
    date: "8 January 2026",
    title: "Perfect fit and amazing quality",
    body: "I ordered the Medium size and the fit is perfect — not too tight, not too loose. The material feels luxurious and holds its shape beautifully after multiple washes. The colour in person matches the photos exactly. I've already recommended this to three friends.",
    verified: true,
  },
  {
    id: "f2",
    author: "Sara Al-Kandari",
    rating: 5,
    date: "25 January 2026",
    title: "Exactly what I was looking for",
    body: "The fabric quality is exceptional — smooth, breathable, and doesn't wrinkle easily which is perfect for Kuwait's climate. The cut is flattering and contemporary. I've worn this to multiple events and received many compliments. The stitching is impeccable throughout.",
    verified: true,
  },
  {
    id: "f3",
    author: "Priya Sharma",
    rating: 4,
    date: "15 February 2026",
    title: "Great quality, size runs slightly large",
    body: "The quality is undeniably premium — the material is rich and the craftsmanship is excellent. I ordered my usual size but it ran slightly large; I'd recommend sizing down. The colour is vibrant and true-to-life. Despite the sizing note, I'm very happy with this purchase.",
    verified: true,
  },
  {
    id: "f4",
    author: "Dana Al-Sultani",
    rating: 5,
    date: "3 December 2025",
    title: "My new favourite item",
    body: "I've bought from premium brands before but this exceeds expectations. The material drapes beautifully and the finish is impeccable. It's versatile enough for both casual and formal occasions. The attention to detail — buttons, seams, lining — is evident throughout.",
    verified: true,
  },
  {
    id: "f5",
    author: "Emily Watson",
    rating: 4,
    date: "18 January 2026",
    title: "Great style and comfort",
    body: "Really pleased with this purchase. The material is comfortable against the skin and breathes well. The style is elegant without being overdone. Delivery was fast and the packaging was premium. Would have given 5 stars if the size chart was more accurate.",
    verified: true,
  },
  {
    id: "f6",
    author: "Hessa Al-Fahad",
    rating: 5,
    date: "11 February 2026",
    title: "Absolute showstopper",
    body: "This piece stopped conversations when I wore it. The cut is flattering, the material is rich and substantial, and the colour is exactly as shown. The quality justifies the price completely. Already eyeing another colour variant.",
    verified: true,
  },
]

const SHOES_REVIEWS: Review[] = [
  {
    id: "sh1",
    author: "Khalid Al-Enezi",
    rating: 5,
    date: "19 January 2026",
    title: "Incredibly comfortable from day one",
    body: "No break-in period needed — these were comfortable immediately. The cushioning is excellent and my feet feel great even after long days at the mall. The fit is true to size and the quality of materials is evident. The sole grip is excellent on smooth marble floors.",
    verified: true,
  },
  {
    id: "sh2",
    author: "Omar Al-Ajmi",
    rating: 5,
    date: "6 February 2026",
    title: "Best trainers I've owned",
    body: "Bought these for both gym use and casual wear. The responsiveness during workouts is excellent and they look great with jeans. The mesh upper breathes well in Kuwait's heat. Went with my usual EU size and the fit is perfect. Very happy with this purchase.",
    verified: true,
  },
  {
    id: "sh3",
    author: "Raj Patel",
    rating: 4,
    date: "14 December 2025",
    title: "High quality with great support",
    body: "The arch support is exceptional — I have flat feet and these are some of the most comfortable shoes I've worn. The build quality is solid. Colour accuracy matches the product photos. Size runs true to EU standard. Minor complaint: took a few days to fully soften but now they're perfect.",
    verified: true,
  },
  {
    id: "sh4",
    author: "Abdullah Al-Mutairi",
    rating: 5,
    date: "27 January 2026",
    title: "Style and performance combined",
    body: "These look fantastic and perform even better. The energy return in the sole makes long walks effortless. I've worn them to football, gym, and casual outings. The material cleans easily — just wipe down after sport. Delivery was fast and they came well-packaged.",
    verified: true,
  },
  {
    id: "sh5",
    author: "Maria Santos",
    rating: 3,
    date: "2 January 2026",
    title: "Good quality, colour slightly different",
    body: "The quality is solid — well-constructed with durable materials. My only issue is the colour in person is slightly darker than in the product photos. Comfort is good from the start and the sizing is accurate. I'd buy again but wanted to flag the colour discrepancy for other shoppers.",
    verified: true,
  },
]

const BEAUTY_REVIEWS: Review[] = [
  {
    id: "b1",
    author: "Zainab Al-Khatib",
    rating: 5,
    date: "12 January 2026",
    title: "Transformed my skin after 3 weeks",
    body: "I have combination skin and this worked beautifully. After three weeks of consistent use my skin tone is more even, pores appear smaller, and the texture is smoother. The formula absorbs quickly without leaving a greasy residue — essential in Kuwait's humid summers. Worth every fils.",
    verified: true,
  },
  {
    id: "b2",
    author: "Reem Al-Ghanem",
    rating: 5,
    date: "29 January 2026",
    title: "Holy grail product for dry skin",
    body: "As someone with dry skin who's tried dozens of products, this is the one. The hydration lasts all day even in air-conditioned offices. The texture is luxuriously rich but absorbs without heaviness. My skin looks plumper and more radiant. I've repurchased three times already.",
    verified: true,
  },
  {
    id: "b3",
    author: "Priya Sharma",
    rating: 5,
    date: "5 February 2026",
    title: "Genuine results, not just marketing",
    body: "I was skeptical about the price but after 6 weeks I can see real, measurable improvements. Fine lines around my eyes are noticeably reduced. Skin tone is brighter and more even. The packaging is elegant and the formula smells subtly luxurious. This is now a permanent part of my routine.",
    verified: true,
  },
  {
    id: "b4",
    author: "Sara Al-Kandari",
    rating: 4,
    date: "17 December 2025",
    title: "Excellent for sensitive skin",
    body: "I have sensitive skin prone to reactions and this caused zero irritation. The formula is gentle yet effective. I've seen improvement in skin texture over about 4 weeks. The amount per application needed is small so the product lasts well. Minor note: the pump dispenser is a bit stiff initially.",
    verified: true,
  },
  {
    id: "b5",
    author: "Emily Watson",
    rating: 5,
    date: "8 February 2026",
    title: "Worth importing from Kuwait!",
    body: "A friend in Kuwait recommended this and I ordered through Kuwait Marketplace. Even with international shipping it was worth it. The formula works better than anything available locally. After 4 weeks: clearer skin, reduced hyperpigmentation, and a genuine glow. Exceptional product.",
    verified: true,
  },
  {
    id: "b6",
    author: "Maryam Al-Jassem",
    rating: 3,
    date: "20 January 2026",
    title: "Good but takes time to see results",
    body: "The product quality is evident — the texture is luxurious and it absorbs well. However results took longer than the 2 weeks advertised; I only started noticing improvements after 5-6 weeks. That said, the improvement is real. If you're patient this delivers, but manage expectations on the timeline.",
    verified: true,
  },
]

const PERFUME_REVIEWS: Review[] = [
  {
    id: "p1",
    author: "Fatima Al-Sabah",
    rating: 5,
    date: "10 January 2026",
    title: "Extraordinary sillage and longevity",
    body: "I sprayed this in the morning and people were still complimenting the scent by evening. The opening is bold and distinctive, the heart notes are beautifully balanced, and the base lingers beautifully. The bottle is display-worthy — elegant and substantial. A masterpiece of perfumery.",
    verified: true,
  },
  {
    id: "p2",
    author: "Nour Al-Harbi",
    rating: 5,
    date: "22 January 2026",
    title: "My signature scent",
    body: "I've been searching for my signature scent for years and this is it. The opening is fresh and distinctive, evolving beautifully over 8+ hours. The projection is excellent without being overpowering — perfect for office environments. The bottle quality matches the fragrance quality.",
    verified: true,
  },
  {
    id: "p3",
    author: "Dana Al-Sultani",
    rating: 4,
    date: "14 February 2026",
    title: "Beautiful but very powerful — use sparingly",
    body: "This fragrance is a statement piece. The scent itself is gorgeous — complex, rich, and distinctive. My only caution is that it projects powerfully; one or two sprays is more than enough. With restraint it's a wonderful daily companion. The longevity is exceptional — 12+ hours easily.",
    verified: true,
  },
  {
    id: "p4",
    author: "Carlos Rodriguez",
    rating: 5,
    date: "3 December 2025",
    title: "Received constant compliments",
    body: "Bought this as a treat for myself and the reaction has been extraordinary. I've received compliments virtually every day I've worn it. The scent opens bright, transitions through rich florals and spices, then settles into a warm, inviting base that lasts all day. Exceptional quality.",
    verified: true,
  },
  {
    id: "p5",
    author: "Hessa Al-Fahad",
    rating: 5,
    date: "7 February 2026",
    title: "Worth the investment",
    body: "Kuwait has a strong perfume culture and this lives up to the highest standards. The quality of raw materials is evident — nothing synthetic or harsh. The longevity is remarkable even in Kuwait's heat. The elegance of the bottle makes it perfect as a gift. Genuinely exceptional.",
    verified: true,
  },
]

const FOOD_REVIEWS: Review[] = [
  {
    id: "fo1",
    author: "Mohammed Al-Rashidi",
    rating: 5,
    date: "16 January 2026",
    title: "Finest quality dates I've tasted",
    body: "These dates are exceptional — plump, moist, and naturally sweet without being cloying. The packaging arrived in perfect condition with each date individually protected. The freshness is evident from the first bite. I ordered for Ramadan hosting and my guests couldn't stop complimenting them.",
    verified: true,
  },
  {
    id: "fo2",
    author: "Khalid Al-Enezi",
    rating: 5,
    date: "4 February 2026",
    title: "Authentic quality, fast delivery",
    body: "The quality matches premium specialty stores but at a better price. The taste is rich and the texture is perfect — neither too dry nor too soft. Packaging is beautiful and would make an excellent gift. Delivery was prompt and the cold-chain packaging kept everything fresh.",
    verified: true,
  },
  {
    id: "fo3",
    author: "Abdullah Al-Mutairi",
    rating: 4,
    date: "29 December 2025",
    title: "Excellent quality, great value",
    body: "Very pleased with this purchase. The product quality is genuine and the taste is authentic. I've bought from specialty shops in Mubarakiya before and this compares favourably. The 1kg size offers good value. Would have been 5 stars if the packaging wasn't slightly bulky to store.",
    verified: true,
  },
  {
    id: "fo4",
    author: "Maria Santos",
    rating: 5,
    date: "19 January 2026",
    title: "Amazing freshness and taste",
    body: "I'm Filipino and dates aren't a staple in my culture, but a Kuwaiti colleague gifted me some and I became hooked. These are exactly that quality. The freshness is remarkable — each one is soft and flavourful. I now order regularly and have introduced my whole family to them.",
    verified: true,
  },
  {
    id: "fo5",
    author: "Yousef Al-Bahar",
    rating: 5,
    date: "11 February 2026",
    title: "Perfect for gifting",
    body: "Ordered these as Ramadan gifts for colleagues and the feedback was overwhelmingly positive. The presentation is elegant, the quality is premium, and the taste delivers. Several colleagues asked where I bought them. Kuwait Marketplace delivered on time for the occasion. Excellent service.",
    verified: true,
  },
  {
    id: "fo6",
    author: "Faisal Al-Marzouk",
    rating: 3,
    date: "25 November 2025",
    title: "Good quality but 1kg is less than expected",
    body: "The quality of the product is genuinely good — fresh, flavourful, well-packaged. My only gripe is the 1kg seemed slightly under-portioned compared to what I expected. That said, the taste and freshness are excellent and I would repurchase for quality reasons.",
    verified: true,
  },
]

const HOME_REVIEWS: Review[] = [
  {
    id: "h1",
    author: "Hessa Al-Fahad",
    rating: 5,
    date: "11 January 2026",
    title: "Professional results at home",
    body: "This appliance has completely changed my kitchen. The performance is exceptional — powerful, precise, and consistent. The build quality is clearly premium; it feels solid and durable. The results match what I'd expect from a professional kitchen. Cleaning is easy and the design is stunning on my countertop.",
    verified: true,
  },
  {
    id: "h2",
    author: "Mohammed Al-Rashidi",
    rating: 4,
    date: "27 January 2026",
    title: "Great performance, takes up counter space",
    body: "The performance is excellent — it handles everything from delicate pastries to heavy doughs without straining. The build is solid and it feels like it'll last decades. My only consideration is the size — it's a significant countertop footprint. If you have the space, absolutely worth it.",
    verified: true,
  },
  {
    id: "h3",
    author: "Li Chen",
    rating: 5,
    date: "8 February 2026",
    title: "Best kitchen investment I've made",
    body: "I bake weekly and this has transformed my results. The precision and consistency are remarkable. The motor handles all types of dough without any strain. The design is beautiful and the colour options are stylish. Delivery was fast and packaging protected the product perfectly.",
    verified: true,
  },
  {
    id: "h4",
    author: "Emily Watson",
    rating: 5,
    date: "16 December 2025",
    title: "Exceptional quality and performance",
    body: "This is the kitchen appliance you buy once and keep forever. The engineering is superb — every movement is smooth and precise. The attachments are high quality and versatile. My baking has noticeably improved since switching to this. Worth every fils for serious home cooks.",
    verified: true,
  },
  {
    id: "h5",
    author: "Tom Anderson",
    rating: 4,
    date: "3 February 2026",
    title: "Outstanding but requires adjustment period",
    body: "The performance once you understand the settings is outstanding. I'd recommend taking time to read through the manual — the speed settings and attachment combinations matter. Once mastered, results are professional-quality. Solidly built and a pleasure to use.",
    verified: true,
  },
]

const SPORTS_REVIEWS: Review[] = [
  {
    id: "sp1",
    author: "Faisal Al-Marzouk",
    rating: 5,
    date: "14 January 2026",
    title: "Game-changing fitness equipment",
    body: "The accuracy of the health metrics is impressive. Heart rate monitoring is reliable even during intense interval training. The GPS tracking is precise and the battery easily lasts multi-day use. The build quality is rugged and it's survived intensive workouts and a light desert 5K without issues.",
    verified: true,
  },
  {
    id: "sp2",
    author: "Khalid Al-Enezi",
    rating: 5,
    date: "1 February 2026",
    title: "Best fitness tracker money can buy",
    body: "I've used several fitness trackers and this is in a different league. The data accuracy is exceptional — sleep tracking, VO2 max estimates, recovery metrics all feel genuinely useful. The display is clear and readable outdoors in Kuwait's bright sunlight. Battery life is remarkable.",
    verified: true,
  },
  {
    id: "sp3",
    author: "Tom Anderson",
    rating: 4,
    date: "19 December 2025",
    title: "Excellent performance tracker",
    body: "The fitness data is comprehensive and accurate. I particularly appreciate the detailed sleep analysis and the training load recommendations. The build quality is excellent for the price. My only critique is the companion app could be more intuitive, but the device itself is superb.",
    verified: true,
  },
  {
    id: "sp4",
    author: "David Kim",
    rating: 5,
    date: "9 February 2026",
    title: "Elevates every workout",
    body: "This tracks every metric I care about with precision. The real-time coaching features have genuinely improved my training. Sweat-resistant and comfortable even in Kuwait's humidity during outdoor runs. The display is crisp and the touchscreen is responsive. Outstanding product.",
    verified: true,
  },
]

// ─── Category → reviews mapping ──────────────────────────────────────────────

function getReviewsForHandle(handle: string): { reviews: Review[]; summary: ReviewSummary } {
  const h = handle.toLowerCase()

  let reviews: Review[]

  // Match electronics
  if (h.includes("samsung") || h.includes("iphone") || h.includes("apple") ||
      h.includes("sony") || h.includes("headphone") || h.includes("tablet") ||
      h.includes("ipad") || h.includes("macbook") || h.includes("laptop") ||
      h.includes("drone") || h.includes("playstation") || h.includes("gaming") ||
      h.includes("watch") || h.includes("dyson") || h.includes("nespresso") ||
      h.includes("logitech") || h.includes("anker") || h.includes("canon") ||
      h.includes("jbl") || h.includes("speaker") || h.includes("phone") ||
      h.includes("electronic") || h.includes("webcam") || h.includes("keyboard")) {
    if (h.includes("laptop") || h.includes("macbook")) {
      reviews = LAPTOP_REVIEWS
    } else {
      reviews = ELECTRONICS_REVIEWS
    }
  }
  // Match shoes / footwear
  else if (h.includes("shoe") || h.includes("sneaker") || h.includes("air-max") ||
           h.includes("ultraboost") || h.includes("birkenstock") || h.includes("trainer")) {
    reviews = SHOES_REVIEWS
  }
  // Match fashion (non-shoe)
  else if (h.includes("fashion") || h.includes("shirt") || h.includes("jean") ||
           h.includes("abaya") || h.includes("hoodie") || h.includes("polo") ||
           h.includes("linen") || h.includes("tote") || h.includes("bag") ||
           h.includes("sunglasses") || h.includes("bracelet") || h.includes("earring") ||
           h.includes("pandora") || h.includes("swarovski") || h.includes("zara") ||
           h.includes("levi") || h.includes("tommy") || h.includes("under-armour") ||
           h.includes("longchamp") || h.includes("michael-kors") || h.includes("cartier")) {
    reviews = FASHION_REVIEWS
  }
  // Match beauty / skincare / makeup
  else if (h.includes("beauty") || h.includes("skincare") || h.includes("serum") ||
           h.includes("moisturiz") || h.includes("foundation") || h.includes("blush") ||
           h.includes("fenty") || h.includes("olaplex") || h.includes("ordinary") ||
           h.includes("foreo") || h.includes("laneige") || h.includes("la-mer") ||
           h.includes("charlotte") || h.includes("nars") || h.includes("drunk") ||
           h.includes("airwrap") || h.includes("makeup") || h.includes("lip")) {
    reviews = BEAUTY_REVIEWS
  }
  // Match perfume / fragrance
  else if (h.includes("perfume") || h.includes("fragrance") || h.includes("oud") ||
           h.includes("rose") || h.includes("jo-malone") || h.includes("armani") ||
           h.includes("edp") || h.includes("eau-de")) {
    reviews = PERFUME_REVIEWS
  }
  // Match food
  else if (h.includes("date") || h.includes("saffron") || h.includes("olive") ||
           h.includes("honey") || h.includes("ghee") || h.includes("coffee") ||
           h.includes("salt") || h.includes("rice") || h.includes("chocolate") ||
           h.includes("protein") || h.includes("food") || h.includes("grocery") ||
           h.includes("organic") || h.includes("basmati") || h.includes("manuka") ||
           h.includes("ajwa") || h.includes("tamr")) {
    reviews = FOOD_REVIEWS
  }
  // Match sports / fitness
  else if (h.includes("sport") || h.includes("fitness") || h.includes("yoga") ||
           h.includes("garmin") || h.includes("lululemon") || h.includes("trx") ||
           h.includes("fitlife") || h.includes("gym") || h.includes("dumbbell") ||
           h.includes("resistance") || h.includes("cycling") || h.includes("running")) {
    reviews = SPORTS_REVIEWS
  }
  // Match home / kitchen
  else if (h.includes("kitchen") || h.includes("home") || h.includes("mixer") ||
           h.includes("instant-pot") || h.includes("philips") || h.includes("smeg") ||
           h.includes("roomba") || h.includes("kitchenaid") || h.includes("cookware") ||
           h.includes("lamp") || h.includes("hue") || h.includes("blender")) {
    reviews = HOME_REVIEWS
  }
  // Default fallback
  else {
    reviews = ELECTRONICS_REVIEWS
  }

  // Compute summary from reviews
  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }))

  // Inflate counts for more realistic-looking totals
  const multiplier = Math.floor(Math.random() * 5) + 6 // 6-10x
  const inflatedBreakdown = ratingCounts.map((b) => ({
    stars: b.stars,
    count: b.count * multiplier + (b.stars >= 4 ? Math.floor(Math.random() * 5) : 0),
  }))

  const totalReviews = inflatedBreakdown.reduce((acc, b) => acc + b.count, 0)
  const avgRating =
    inflatedBreakdown.reduce((acc, b) => acc + b.stars * b.count, 0) / totalReviews

  return {
    reviews,
    summary: {
      average: Math.round(avgRating * 10) / 10,
      total: totalReviews,
      breakdown: inflatedBreakdown,
    },
  }
}

// ─── Star renderer ───────────────────────────────────────────────────────────

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  const starSize = size === "lg" ? "text-2xl" : "text-sm"

  return (
    <span
      className={`${starSize} text-yellow-400`}
      data-testid="star-rating"
      aria-label={`${rating} out of 5 stars`}
    >
      {"★".repeat(full)}
      {half && "½"}
      {"☆".repeat(empty)}
    </span>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

interface ProductReviewsProps {
  productHandle: string
}

export default function ProductReviews({ productHandle }: ProductReviewsProps) {
  const { reviews, summary } = getReviewsForHandle(productHandle)
  const maxBarCount = Math.max(...summary.breakdown.map((b) => b.count))

  return (
    <section
      className="mt-16 pt-8 border-t border-gray-200"
      data-testid="product-reviews-section"
    >
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* ── Summary block ── */}
      <div
        className="flex flex-col sm:flex-row gap-8 mb-10 p-6 bg-gray-50 rounded-lg"
        data-testid="review-summary"
      >
        {/* Average + stars */}
        <div className="flex flex-col items-center justify-center min-w-[140px]">
          <span className="text-5xl font-bold text-gray-900">{summary.average}</span>
          <StarRating rating={summary.average} size="lg" />
          <span className="text-sm text-gray-500 mt-1">out of 5</span>
          <span className="text-sm text-gray-500">({summary.total} reviews)</span>
        </div>

        {/* Star breakdown bars */}
        <div className="flex-1 space-y-2">
          {summary.breakdown.map((b) => (
            <div key={b.stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8 text-right">{b.stars}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${Math.round((b.count / maxBarCount) * 100)}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-10">({b.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Individual reviews ── */}
      <div className="space-y-8">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-100 pb-8 last:border-0"
            data-testid="review-card"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span
                  className="font-semibold text-gray-900"
                  data-testid="review-author"
                >
                  {review.author}
                </span>
                {review.verified && (
                  <span
                    className="ml-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5"
                    data-testid="verified-badge"
                  >
                    Verified Purchase
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-400">{review.date}</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={review.rating} />
              <span className="font-medium text-gray-800 text-sm">{review.title}</span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
