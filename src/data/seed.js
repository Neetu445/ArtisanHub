// Demo seed data – Varanasi & UP artisans. Replaced by Supabase in production.
const img = (seed) => `/img/${seed}.jpg`

export const users = [
  { id: 'u1', name: 'Rahul Maurya', email: 'rahul@artisan.com', password: 'demo123', role: 'artisan', artisanId: 'a1' },
  { id: 'u2', name: 'Saira Bano', email: 'saira@artisan.com', password: 'demo123', role: 'artisan', artisanId: 'a2' },
  { id: 'u3', name: 'Priya Sharma', email: 'priya@customer.com', password: 'demo123', role: 'customer' },
  { id: 'u4', name: 'Arjun Mehta', email: 'arjun@customer.com', password: 'demo123', role: 'customer' },
]

export const artisans = [
  { id: 'a1', userId: 'u1', name: 'Rahul Maurya', craft: 'Pottery & Terracotta', location: 'Ramnagar, Varanasi, Uttar Pradesh',
    avatar: img('rahul', 200, 200), cover: img('pottery-cover', 1200, 400), yearsExp: 18,
    story: 'Third-generation potter from Ramnagar. My family has worked the Ganga clay for over 60 years, making diyas, kulhads and decorative terracotta.',
    process: 'Clay is sourced from the riverbank, wedged by hand, thrown on a kick wheel, sun-dried and fired in a traditional wood kiln.', rating: 4.8, reviews: 34 },
  { id: 'a2', userId: 'u2', name: 'Saira Bano', craft: 'Banarasi Handloom Weaving', location: 'Madanpura, Varanasi, Uttar Pradesh',
    avatar: img('saira', 200, 200), cover: img('weave-cover', 1200, 400), yearsExp: 22,
    story: 'I weave Banarasi silk sarees and dupattas on a pit loom, following patterns passed down from my mother. Every zari motif is hand-drawn before it reaches the loom.',
    process: 'Silk yarn is dyed, warped and woven with real zari using the traditional kadhua technique. A single saree takes 15–40 days.', rating: 4.9, reviews: 51 },
  { id: 'a3', userId: null, name: 'Mohan Lal Kunder', craft: 'Channapatna Wooden Toys', location: 'Channapatna, Karnataka',
    avatar: img('mohan', 200, 200), cover: img('toys-cover', 1200, 400), yearsExp: 30,
    story: 'Channapatna is the toy town of India. I turn and lacquer wooden toys the way my grandfather taught me – safe for children, coloured only with vegetable dyes.',
    process: 'Seasoned ivory-wood is turned on a hand lathe and coloured with natural lac while spinning.', rating: 4.7, reviews: 19 },
  { id: 'a4', userId: null, name: 'Nazneen Ansari', craft: 'Meenakari Jewellery', location: 'Jaipur, Rajasthan',
    avatar: img('nazneen', 200, 200), cover: img('meena-cover', 1200, 400), yearsExp: 14,
    story: 'Jaipur meenakari – enamel on silver and gold – has been practised in our family since the Mughal era. I make pendants, earrings and miniature birds.',
    process: 'Silver is engraved, filled with enamel, fired in a kiln and polished, one colour at a time.', rating: 4.9, reviews: 27 },
  { id: 'a5', userId: null, name: 'Deepak Prajapati', craft: 'Blue Pottery', location: 'Sanganer, Jaipur, Rajasthan',
    avatar: img('deepak', 200, 200), cover: img('blue-cover', 1200, 400), yearsExp: 11,
    story: 'Jaipur blue pottery is made without clay – from quartz, glass and multani mitti. I blend traditional cobalt patterns with modern tableware shapes.',
    process: 'Dough is pressed into moulds, hand-painted with cobalt and copper oxides and fired once at low temperature.', rating: 4.6, reviews: 12 },
  { id: 'a6', userId: null, name: 'Lakshmi Devi', craft: 'Madhubani Painting', location: 'Madhubani, Bihar',
    avatar: img('lakshmi', 200, 200), cover: img('madhubani-cover', 1200, 400), yearsExp: 25,
    story: 'Mithila painting was taught to me by my grandmother on the walls of our home. Today I paint on handmade paper, canvas and fabric for homes across India.',
    process: 'Natural pigments from turmeric, indigo and soot applied with bamboo nib and cotton – no empty space left, as tradition demands.', rating: 4.9, reviews: 43 },
  { id: 'a7', userId: null, name: 'Bhavesh Vankar', craft: 'Kutch Handloom & Embroidery', location: 'Bhujodi, Kutch, Gujarat',
    avatar: img('bhavesh', 200, 200), cover: img('kutch-cover', 1200, 400), yearsExp: 16,
    story: 'Our Vankar community has woven shawls in Bhujodi for 500 years. I combine desi wool weaving with mirror-work embroidery done by women of our village.',
    process: 'Hand-spun wool is woven on a pit loom with extra-weft motifs; embroidery and mirrors are added by hand.', rating: 4.8, reviews: 22 },
  { id: 'a8', userId: null, name: 'Rinku Das', craft: 'Terracotta & Dokra Metal Craft', location: 'Bishnupur, West Bengal',
    avatar: img('rinku', 200, 200), cover: img('dokra-cover', 1200, 400), yearsExp: 12,
    story: 'From the temple town of Bishnupur, I make the famous Bankura horse and dokra figurines using the 4000-year-old lost-wax method.',
    process: 'A wax model is coated in clay, heated so the wax melts out, and molten brass is poured in – every piece is one of a kind.', rating: 4.7, reviews: 15 },
]

export const products = [
  { id: 'p1', artisanId: 'a1', name: 'Hand-painted Terracotta Diya Set (12)', category: 'Pottery', material: 'Terracotta', price: 349, stock: 40, lowStock: 10, image: img('diya'), tags: ['diwali','diya','decor'],
    description: 'Twelve hand-thrown diyas painted with natural colours. Perfect for Diwali and festive décor.', descriptionHi: 'बारह हाथ से बने दीये, प्राकृतिक रंगों से सजाए गए। दिवाली और त्योहारों के लिए उत्तम।' },
  { id: 'p2', artisanId: 'a1', name: 'Kulhad Chai Cups (Set of 6)', category: 'Pottery', material: 'Terracotta', price: 199, stock: 6, lowStock: 10, image: img('kulhad'), tags: ['kulhad','chai','kitchen'],
    description: 'Unglazed clay cups that give chai its earthy Banarasi flavour. Reusable and eco-friendly.', descriptionHi: 'बिना ग्लेज़ के मिट्टी के कुल्हड़ जो चाय को बनारसी मिट्टी का स्वाद देते हैं।' },
  { id: 'p3', artisanId: 'a1', name: 'Terracotta Ganesha Idol (8 inch)', category: 'Pottery', material: 'Terracotta', price: 899, stock: 8, lowStock: 5, image: img('ganesha'), tags: ['idol','ganesha','decor'],
    description: 'Eco-friendly Ganesha idol, hand-sculpted and sun-dried. Dissolves safely in water.', descriptionHi: 'पर्यावरण-अनुकूल गणेश प्रतिमा, हाथ से गढ़ी और धूप में सुखाई गई।' },
  { id: 'p4', artisanId: 'a2', name: 'Banarasi Katan Silk Saree – Red & Gold', category: 'Textiles', material: 'Pure Silk, Zari', price: 12500, stock: 3, lowStock: 2, image: img('saree1'), tags: ['saree','silk','wedding'],
    description: 'Pure katan silk with kadhua-woven zari butis and a rich brocade pallu. Woven over 28 days.', descriptionHi: 'शुद्ध कतान रेशम, कढ़ुआ ज़री बूटियों और ब्रोकेड पल्लू के साथ। 28 दिनों में बुनी गई।' },
  { id: 'p5', artisanId: 'a2', name: 'Banarasi Silk Dupatta – Teal', category: 'Textiles', material: 'Silk, Zari', price: 3200, stock: 7, lowStock: 3, image: img('dupatta'), tags: ['dupatta','silk'],
    description: 'Lightweight silk dupatta with floral jaal in antique gold zari.', descriptionHi: 'हल्का रेशमी दुपट्टा, एंटीक गोल्ड ज़री में फूलों का जाल।' },
  { id: 'p6', artisanId: 'a2', name: 'Brocade Cushion Covers (Pair)', category: 'Textiles', material: 'Silk Brocade', price: 1450, stock: 15, lowStock: 5, image: img('cushion'), tags: ['home','cushion','brocade'],
    description: 'Made from handloom brocade offcuts – zero-waste luxury for your living room.', descriptionHi: 'हैंडलूम ब्रोकेड के बचे कपड़े से बने – आपके घर के लिए ज़ीरो-वेस्ट लक्ज़री।' },
  { id: 'p7', artisanId: 'a3', name: 'Wooden Lacquer Chess Set', category: 'Woodwork', material: 'Koraiya Wood, Lac', price: 2400, stock: 5, lowStock: 3, image: img('chess'), tags: ['chess','toys','gift'],
    description: 'GI-tagged Channapatna lacquerware. Hand-turned pieces in traditional red, yellow and green vegetable-dye lac.', descriptionHi: 'GI-टैग चन्नपटना लाख का शतरंज सेट, हाथ से बने मोहरे।' },
  { id: 'p8', artisanId: 'a3', name: 'Wooden Stacking Rings & Tops – Set of 5', category: 'Woodwork', material: 'Wood, Lac', price: 299, stock: 30, lowStock: 10, image: img('lattu'), tags: ['toys','kids'],
    description: 'Classic Channapatna toys with cotton string. Safe natural lac colours.', descriptionHi: 'पारंपरिक चन्नपटना खिलौने, सुरक्षित प्राकृतिक लाख रंगों में।' },
  { id: 'p9', artisanId: 'a4', name: 'Meenakari Peacock Pendant', category: 'Jewellery', material: 'Silver, Enamel', price: 4800, stock: 4, lowStock: 2, image: img('pendant'), tags: ['jewellery','pendant','meenakari'],
    description: 'Sterling silver peacock with hand-fired multicolour enamel. Comes with a silver chain.', descriptionHi: 'स्टर्लिंग चाँदी का मोर, हाथ से भरी मीनाकारी के साथ।' },
  { id: 'p10', artisanId: 'a4', name: 'Meenakari Miniature Birds (Set of 3)', category: 'Jewellery', material: 'Silver, Enamel', price: 6500, stock: 2, lowStock: 2, image: img('birds'), tags: ['decor','collectible'],
    description: 'Collectible miniature parrots – the signature piece of Jaipur meenakari.', descriptionHi: 'संग्रहणीय लघु तोते – जयपुर मीनाकारी की पहचान।' },
  { id: 'p11', artisanId: 'a5', name: 'Blue Glazed Dinner Plates (Set of 4)', category: 'Pottery', material: 'Quartz Ceramic', price: 1800, stock: 12, lowStock: 4, image: img('plates'), tags: ['kitchen','tableware'],
    description: 'Jaipur blue pottery plates with hand-painted cobalt floral pattern.', descriptionHi: 'हाथ से बने कोबाल्ट फूलों के पैटर्न वाली जयपुर ब्लू पॉटरी प्लेटें।' },
  { id: 'p12', artisanId: 'a5', name: 'Ceramic Planter – Indigo Drip', category: 'Pottery', material: 'Quartz Ceramic', price: 650, stock: 0, lowStock: 3, image: img('planter'), tags: ['garden','planter'],
    description: 'Wheel-thrown planter with drainage hole and indigo drip glaze.', descriptionHi: 'चाक पर बना गमला, जल निकासी छेद और इंडिगो ड्रिप ग्लेज़ के साथ।' },
  { id: 'p13', artisanId: 'a6', name: 'Madhubani Painting – Tree of Life (18x24 in)', category: 'Painting', material: 'Handmade paper, natural dyes', price: 3500, stock: 4, lowStock: 2, image: img('madhubani'), tags: ['painting','madhubani','wall art'],
    description: 'Hand-painted Mithila Tree of Life with fish and peacocks, natural pigments on handmade paper.', descriptionHi: 'हाथ से बनी मिथिला जीवन-वृक्ष पेंटिंग, हस्तनिर्मित कागज़ पर प्राकृतिक रंग।' },
  { id: 'p14', artisanId: 'a6', name: 'Madhubani Painted Cotton Stole', category: 'Textiles', material: 'Cotton', price: 1200, stock: 10, lowStock: 3, image: img('stole'), tags: ['stole','madhubani','wearable'],
    description: 'Soft cotton stole hand-painted with Madhubani fish motifs. Every piece is unique.', descriptionHi: 'मधुबनी मछली रूपांकनों से हाथ से चित्रित नरम सूती स्टोल।' },
  { id: 'p15', artisanId: 'a7', name: 'Kutchi Woollen Shawl with Mirror Work', category: 'Textiles', material: 'Desi wool', price: 2800, stock: 6, lowStock: 2, image: img('shawl'), tags: ['shawl','kutch','wool'],
    description: 'Handwoven Bhujodi shawl with extra-weft motifs and hand-stitched mirror embroidery.', descriptionHi: 'हाथ से बुनी भुजोड़ी शॉल, अतिरिक्त बाने के रूपांकन और हाथ की शीशा कढ़ाई।' },
  { id: 'p16', artisanId: 'a8', name: 'Bankura Terracotta Horse (12 inch)', category: 'Pottery', material: 'Terracotta', price: 950, stock: 9, lowStock: 3, image: img('bankura'), tags: ['bankura','horse','decor'],
    description: 'The iconic Bankura horse, hand-built in the Panchmura tradition and fired to a deep terracotta red.', descriptionHi: 'प्रसिद्ध बांकुड़ा घोड़ा, पंचमुरा परंपरा में हाथ से बना।' },
  { id: 'p17', artisanId: 'a8', name: 'Dokra Brass Elephant Figurine', category: 'Metalwork', material: 'Brass (lost-wax)', price: 1650, stock: 5, lowStock: 2, image: img('dokra'), tags: ['dokra','brass','figurine'],
    description: 'Lost-wax cast brass elephant with signature dokra wire-work texture. No two pieces are identical.', descriptionHi: 'लॉस्ट-वैक्स विधि से ढला पीतल का हाथी, विशिष्ट ढोकरा तार-कला के साथ।' },
]


const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString()

export const orders = [
  { id: 'o1', customerId: 'u3', artisanId: 'a1', type: 'regular', productId: 'p1', qty: 3, amount: 1047, status: 'delivered', createdAt: daysAgo(21), address: 'Indiranagar, Bengaluru' },
  { id: 'o2', customerId: 'u4', artisanId: 'a1', type: 'regular', productId: 'p2', qty: 2, amount: 398, status: 'shipped', createdAt: daysAgo(3), address: 'Vasant Kunj, New Delhi' },
  { id: 'o3', customerId: 'u3', artisanId: 'a1', type: 'regular', productId: 'p3', qty: 1, amount: 899, status: 'in_progress', createdAt: daysAgo(1), address: 'Indiranagar, Bengaluru' },
  { id: 'o4', customerId: 'u3', artisanId: 'a2', type: 'regular', productId: 'p5', qty: 1, amount: 3200, status: 'delivered', createdAt: daysAgo(40), address: 'Indiranagar, Bengaluru' },
  { id: 'o5', customerId: 'u4', artisanId: 'a2', type: 'regular', productId: 'p4', qty: 1, amount: 12500, status: 'received', createdAt: daysAgo(0.2), address: 'Vasant Kunj, New Delhi' },
  { id: 'o6', customerId: 'u4', artisanId: 'a1', type: 'regular', productId: 'p1', qty: 5, amount: 1745, status: 'delivered', createdAt: daysAgo(55), address: 'Vasant Kunj, New Delhi' },
  { id: 'o7', customerId: 'u3', artisanId: 'a1', type: 'regular', productId: 'p2', qty: 4, amount: 796, status: 'delivered', createdAt: daysAgo(70), address: 'Indiranagar, Bengaluru' },
  // custom orders
  { id: 'c1', customerId: 'u3', artisanId: 'a1', type: 'custom', title: 'Personalised name-engraved kulhads for wedding (150 pcs)', qty: 150,
    brief: 'Need 150 kulhads with "Priya & Rohan – 14 Feb" engraved. Terracotta natural finish, 120 ml.',
    referenceImage: img('ref-kulhad', 500, 400), status: 'approved', quote: { price: 6750, days: 12, note: 'Rs 45 per piece incl. engraving. Firing in 3 batches.' }, createdAt: daysAgo(6), address: 'Indiranagar, Bengaluru', amount: 6750 },
  { id: 'c2', customerId: 'u4', artisanId: 'a1', type: 'custom', title: 'Large terracotta wall plate with Ganga ghat scene', qty: 1,
    brief: '18-inch wall plate, relief work of Dashashwamedh ghat, earthy tones.',
    referenceImage: img('ref-plate', 500, 400), status: 'quote_requested', quote: null, createdAt: daysAgo(0.5), address: 'Vasant Kunj, New Delhi', amount: 0 },
  { id: 'c3', customerId: 'u3', artisanId: 'a2', type: 'custom', title: 'Bridal lehenga dupatta in maroon with peacock motif', qty: 1,
    brief: 'Pure silk, heavy zari border with peacock motifs matching attached photo. Needed before 20 Nov.',
    referenceImage: img('ref-dupatta', 500, 400), status: 'quoted', quote: { price: 9800, days: 25, note: 'Kadhua weaving, real zari. 50% advance.' }, createdAt: daysAgo(2), address: 'Indiranagar, Bengaluru', amount: 9800 },
]

export const messages = [
  { id: 'm1', orderId: 'c1', senderId: 'u3', text: 'Hi Rahul ji, can you do the engraving in Devanagari as well?', at: daysAgo(5.5) },
  { id: 'm2', orderId: 'c1', senderId: 'u1', text: 'Yes, Devanagari works well on terracotta. I will send a sample photo after the first batch.', at: daysAgo(5.4) },
  { id: 'm3', orderId: 'c1', senderId: 'u3', text: 'Perfect, thank you!', at: daysAgo(5.3) },
  { id: 'm4', orderId: 'c3', senderId: 'u2', text: 'Namaste Priya, I have sent a quote. The peacock motif needs extra jacquard cards, that is why 25 days.', at: daysAgo(1.9) },
  { id: 'm5', orderId: 'o2', senderId: 'u1', text: 'Your kulhads have been packed and handed to the courier.', at: daysAgo(1) },
]

export const STATUS = {
  regular: ['received', 'in_progress', 'shipped', 'delivered'],
  custom: ['quote_requested', 'quoted', 'approved', 'in_progress', 'shipped', 'delivered'],
}
export const STATUS_LABEL = {
  received: 'Received', in_progress: 'In Progress', shipped: 'Shipped', delivered: 'Delivered',
  quote_requested: 'Quote Requested', quoted: 'Quoted', approved: 'Approved', cancelled: 'Cancelled', declined: 'Declined',
}
export const STATUS_COLOR = {
  received: 'bg-blue-100 text-blue-700', in_progress: 'bg-amber-100 text-amber-700', shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700', quote_requested: 'bg-stone-200 text-stone-700', quoted: 'bg-sky-100 text-sky-700',
  approved: 'bg-teal-100 text-teal-700', cancelled: 'bg-red-100 text-red-700', declined: 'bg-red-100 text-red-700',
}
