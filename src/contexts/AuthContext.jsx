import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)
        }
        setLoading(false)
      })?.catch((error) => {
        if (error?.message?.includes('Failed to fetch') || 
            error?.message?.includes('AuthRetryableFetchError')) {
          setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive.')
        }
        setLoading(false)
      })

    // Listen for auth changes - NEVER ASYNC callback
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)  // Fire-and-forget, NO AWAIT
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = (userId) => {
    supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()?.then(({ data, error }) => {
        if (error) {
          setAuthError(error?.message)
          return
        }
        setUserProfile(data)
      })?.catch((error) => {
        console.log('Profile fetch error:', error)
      })
  }

  const signIn = async (email, password) => {
    try {
      setAuthError('')
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setAuthError(error?.message)
        return { success: false, error: error?.message };
      }

      return { success: true, user: data?.user };
    } catch (error) {
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

  const signUp = async (email, password, fullName = '') => {
    try {
      setAuthError('')
      const { data, error } = await supabase?.auth?.signUp({
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
        return { success: false, error: error?.message };
      }

      return { success: true, user: data?.user, needsConfirmation: !data?.session };
    } catch (error) {
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
      const { error } = await supabase?.auth?.signOut()
      if (error) {
        setAuthError(error?.message)
        return { success: false, error: error?.message };
      }
      
      setUser(null)
      setUserProfile(null)
      return { success: true }
    } catch (error) {
      setAuthError('Failed to sign out')
      console.log('Sign out error:', error)
      return { success: false, error: 'Failed to sign out' }
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' }

      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()
      
      if (error) {
        setAuthError(error?.message)
        return { success: false, error: error?.message };
      }

      setUserProfile(data)
      return { success: true, profile: data }
    } catch (error) {
      setAuthError('Failed to update profile')
      console.log('Profile update error:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  const clearAuthError = () => setAuthError('')

  const value = {
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
  );
}