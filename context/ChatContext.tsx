'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { Message } from 'ai/react'
import { Traits } from '@/types/context'

type ChatContextType = {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  hasUserTriggeredResponse: boolean
  setHasUserTriggeredResponse: React.Dispatch<React.SetStateAction<boolean>>
  mood: string
  setMood: (mood: string) => void
  customTraits: Traits | null
  setCustomTraits: React.Dispatch<React.SetStateAction<Traits | null>>
  appendMessage: (message: Message) => void
  clearMessages: () => void
  removeTypingIndicator: () => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export const defaultTraits = {
  empathy: 0.6,
  warmth: 0.6,
  supportStyle: 0.5,
  energy: 0.4,
  directness: 0.4,
}

export const jennaDefaultTraits = {
  empathy: 0.9,
  warmth: 0.85,
  supportStyle: 0.7,
  energy: 0.5,
  directness: 0.3,
};

export const marcusDefaultTraits = {
  empathy: 0.6,
  warmth: 0.65,
  supportStyle: 0.5,
  energy: 0.7,
  directness: 0.65,
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [hasUserTriggeredResponse, setHasUserTriggeredResponse] = useState(false)
  const [mood, setMood] = useState('neutral')
  const [customTraits, setCustomTraits] = useState<Traits | null>(defaultTraits)

  const appendMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const removeTypingIndicator = useCallback(() => {
    setMessages(prev => prev.filter(msg => msg.id !== 'typing-placeholder'))
  }, [])

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        input,
        setInput,
        hasUserTriggeredResponse,
        setHasUserTriggeredResponse,
        mood,
        setMood,
        customTraits,
        setCustomTraits,
        appendMessage,
        clearMessages,
        removeTypingIndicator
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}