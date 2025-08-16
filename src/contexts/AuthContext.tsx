'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface User {
  id: string
  email: string
  full_name?: string
  tier?: string
}

interface UserProfile {
  id: string
  full_name: string
  tier: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  authError: string
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string; user?: User; needsConfirmation?: boolean }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string; profile?: UserProfile }>
  clearAuthError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user as User)
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    }).catch((error) => {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive.')
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user as User)
          fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = (userId: string) => {
    supabase.from('user_profiles').select('*').eq('id', userId).single().then(({ data, error }) => {
      if (error) {
        setAuthError(error?.message)
        return
      }
      setUserProfile(data as UserProfile)
    }).catch((error) => {
      console.log('Profile fetch error:', error)
    })
  }

  const signIn = async (email: string, password: string) => {
    try {
      setAuthError('')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setAuthError(error?.message)
        return { success: false, error: error?.message }
      }

      return { success: true, user: data?.user as User }
    } catch (error: any) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive.')
      } else {
        setAuthError('Something went wrong. Please try again.')
        console.log('JavaScript error in signIn:', error)
      }
      return { success: false, error: authError }
    }
  }

  const signUp = async (email: string, password: string, fullName: string = '') => {
    try {
      setAuthError('')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            tier: 'free'
          }
        }
      })
      
      if (error) {
        setAuthError(error?.message)
        return { success: false, error: error?.message }
      }

      return { success: true, user: data?.user as User, needsConfirmation: !data?.session }
    } catch (error: any) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or deleted.')
      } else {
        setAuthError('Something went wrong. Please try again.')
        console.log('JavaScript error in signUp:', error)
      }
      return { success: false, error: authError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setAuthError(error?.message)
        return { success: false, error: error?.message }
      }
      
      setUser(null)
      setUserProfile(null)
      return { success: true }
    } catch (error: any) {
      setAuthError('Failed to sign out')
      console.log('Sign out error:', error)
      return { success: false, error: 'Failed to sign out' }
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' }

      const { data, error } = await supabase.from('user_profiles').update(updates).eq('id', user?.id).select().single()
      
      if (error) {
        setAuthError(error?.message)
        return { success: false, error: error?.message }
      }

      setUserProfile(data as UserProfile)
      return { success: true, profile: data as UserProfile }
    } catch (error: any) {
      setAuthError('Failed to update profile')
      console.log('Profile update error:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  const clearAuthError = () => setAuthError('')

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    updateProfile,
    clearAuthError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}