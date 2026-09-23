// Gemini image -> bilingual listing. Uses VITE_GEMINI_API_KEY if present, else a realistic mock.
const KEY = import.meta.env.VITE_GEMINI_API_KEY

const PROMPT = `You are helping an Indian artisan list a handmade product. Look at the image and return ONLY JSON:
{"name":"short product title (English)","category":"one of Pottery|Textiles|Woodwork|Jewellery|Metalwork|Other","material":"main materials","description":"2 sentence English description highlighting handmade craft","descriptionHi":"same description in Hindi (Devanagari)","tags":["3-5 lowercase search tags"],"suggestedPrice":number in INR}`

const MODELS = ['gemini-3-flash-preview', 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-2.5-flash-lite']

export async function generateListing(file) {
  if (!KEY) { await new Promise(r => setTimeout(r, 1400)); return mock(file) }
  const b64 = await toBase64(file)
  const body = JSON.stringify({ contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: file.type || 'image/jpeg', data: b64 } }] }], generationConfig: { responseMimeType: 'application/json' } })
  let lastErr
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
      if (res.ok) {
        const j = await res.json()
        const text = j.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
        return JSON.parse(text.replace(/```json|```/g, ''))
      }
      lastErr = `${model}: ${res.status}`
      if (res.status === 404 || res.status === 400) break          // model not available → next model
      await new Promise(r => setTimeout(r, 1200))                   // 429/503 → retry once, then next
    }
  }
  throw new Error('Gemini unavailable right now (' + lastErr + '). Please try again.')
}

export const toBase64 = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(',')[1]); r.onerror = rej; r.readAsDataURL(file) })
export const toDataUrl = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file) })

function mock(file) {
  const n = (file?.name || '').toLowerCase()
  if (n.includes('saree') || n.includes('silk')) return { name: 'Handwoven Banarasi Silk Saree', category: 'Textiles', material: 'Pure Silk, Zari', description: 'A handwoven Banarasi silk saree with intricate zari work, crafted on a traditional pit loom. Each motif is woven by hand over several weeks.', descriptionHi: 'पारंपरिक करघे पर बुनी गई बनारसी रेशमी साड़ी, बारीक ज़री के काम के साथ। हर बूटी कई हफ्तों में हाथ से बुनी गई है।', tags: ['saree','silk','banarasi','handloom'], suggestedPrice: 8500 }
  return { name: 'Hand-thrown Terracotta Vase', category: 'Pottery', material: 'Terracotta', description: 'A hand-thrown terracotta vase shaped on a traditional potter\'s wheel and fired in a wood kiln. Its natural earthy finish makes it ideal for dried flowers and home décor.', descriptionHi: 'पारंपरिक चाक पर बना और लकड़ी की भट्टी में पकाया गया मिट्टी का फूलदान। इसकी प्राकृतिक मिट्टी की चमक इसे सूखे फूलों और घर की सजावट के लिए आदर्श बनाती है।', tags: ['vase','terracotta','decor','handmade'], suggestedPrice: 549 }
}
