'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function AuthCallbackPage() {
  const [msg, setMsg] = useState('Verificando email…')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const run = async () => {
      const code = params.get('code')
      if (!code) {
        setMsg('Falta código de verificación')
        setStatus('error')
        return
      }

      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setMsg('Error al verificar: ' + error.message)
          setStatus('error')
          return
        }

        setMsg('¡Email verificado! Redirigiendo…')
        setStatus('success')
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          router.replace('/account')
        }, 2000)
      } catch (error: any) {
        setMsg('Error inesperado: ' + error.message)
        setStatus('error')
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'error':
        return <XCircle className="h-8 w-8 text-red-600" />
    }
  }

  const getBgColor = () => {
    switch (status) {
      case 'loading':
        return 'bg-blue-50'
      case 'success':
        return 'bg-green-50'
      case 'error':
        return 'bg-red-50'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className={`max-w-md w-full mx-4 p-8 rounded-xl shadow-lg ${getBgColor()}`}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'loading' && 'Verificando...'}
            {status === 'success' && '¡Verificado!'}
            {status === 'error' && 'Error'}
          </h1>
          <p className="text-gray-600 mb-6">{msg}</p>
          
          {status === 'error' && (
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver al inicio
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
