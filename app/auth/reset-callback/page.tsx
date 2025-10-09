'use client'
import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, CheckCircle, XCircle, Lock } from 'lucide-react'

function ResetCallbackContent() {
  const [stage, setStage] = useState<'verifying'|'ready'|'done'|'error'>('verifying')
  const [err, setErr] = useState<string>('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const code = params.get('code')
      if (!code) { 
        setStage('error')
        setErr('Falta código de verificación')
        return 
      }
      
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) { 
          setStage('error')
          setErr(error.message)
          return 
        }
        setStage('ready')
      } catch (error: any) {
        setStage('error')
        setErr(error.message)
      }
    }
    run()
  }, [params])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setErr('Las contraseñas no coinciden')
      return
    }
    
    if (password.length < 6) {
      setErr('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)
    setErr('')

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) { 
        setStage('error')
        setErr(error.message)
        return 
      }
      setStage('done')
    } catch (error: any) {
      setStage('error')
      setErr(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (stage === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4 p-8 rounded-xl shadow-lg bg-blue-50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificando...</h1>
            <p className="text-gray-600">Validando tu enlace de recuperación</p>
          </div>
        </div>
      </div>
    )
  }

  if (stage === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4 p-8 rounded-xl shadow-lg bg-red-50">
          <div className="text-center">
            <XCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-red-600 mb-6">{err}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (stage === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4 p-8 rounded-xl shadow-lg bg-green-50">
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Contraseña actualizada!</h1>
            <p className="text-gray-600 mb-6">Ya puedes iniciar sesión con tu nueva contraseña</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4 p-8 rounded-xl shadow-lg bg-white">
        <div className="text-center mb-6">
          <Lock className="h-8 w-8 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nueva contraseña</h1>
          <p className="text-gray-600">Ingresa tu nueva contraseña</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Nueva contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
            />
          </div>

          {err && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Actualizando...
              </>
            ) : (
              'Actualizar contraseña'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ResetCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4 p-8 rounded-xl shadow-lg bg-blue-50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Cargando...</h1>
            <p className="text-gray-600">Preparando recuperación de contraseña</p>
          </div>
        </div>
      </div>
    }>
      <ResetCallbackContent />
    </Suspense>
  )
}
