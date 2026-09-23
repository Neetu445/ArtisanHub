import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { useStore, fmtTime } from '../lib/store'

export default function Chat({ orderId }) {
  const { db, user, sendMessage, userById } = useStore()
  const [text, setText] = useState('')
  const end = useRef()
  const msgs = db.messages.filter((m) => m.orderId === orderId)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs.length])
  const send = (e) => { e.preventDefault(); if (!text.trim()) return; sendMessage(orderId, text.trim()); setText('') }
  return (
    <div className="card flex flex-col h-80">
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {msgs.length === 0 && <div className="text-center text-sm text-stone-400 mt-10">No messages yet. Say hello!</div>}
        {msgs.map((m) => { const mine = m.senderId === user?.id; return (
          <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${mine ? 'bg-terra-600 text-white rounded-br-sm' : 'bg-stone-100 rounded-bl-sm'}`}>
              {!mine && <div className="text-[10px] font-medium opacity-70 mb-0.5">{userById(m.senderId)?.name}</div>}
              {m.text}
              <div className={`text-[10px] mt-1 ${mine ? 'text-terra-100' : 'text-stone-400'}`}>{fmtTime(m.at)}</div>
            </div>
          </div>) })}
        <div ref={end}/>
      </div>
      <form onSubmit={send} className="border-t border-stone-200 p-2 flex gap-2">
        <input className="input" placeholder="Type a message…" value={text} onChange={(e) => setText(e.target.value)}/>
        <button className="btn-primary px-3"><Send size={16}/></button>
      </form>
    </div>
  )
}
