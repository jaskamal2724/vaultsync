"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SparklesCore } from "@/components/ui/sparkles"
import { MovingGradientText } from "@/components/ui/moving-gradient-text"
import Link from 'next/link'
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react'


const Login = () => {
  const [mode, setMode]=useState("login")

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-purple-900 to-black p-4">
      <div className="absolute inset-0 overflow-hidden">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#8B5CF6"
        />
      </div>

      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-purple-500/20">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            <MovingGradientText text={mode === 'login' ? 'Welcome Back' : 'Create Account'} />
          </CardTitle>
          <CardDescription className="text-gray-400">
            {mode === 'login' 
              ? 'Enter your credentials to access your account'
              : 'Sign up to start storing your files securely'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-gray-200">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-10 bg-purple-900/20 border-purple-500/20 focus:border-purple-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-200">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 bg-purple-900/20 border-purple-500/20 focus:border-purple-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-200">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-purple-900/20 border-purple-500/20 focus:border-purple-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm text-gray-200">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 bg-purple-900/20 border-purple-500/20 focus:border-purple-500"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-sm text-right">
                <Link href="/forgot-password" className="text-purple-400 hover:text-purple-300">
                  Forgot password?
                </Link>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-center">
          <div className="w-full text-gray-400">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <Link href="#" className="text-purple-400 hover:text-purple-300" onClick={()=>setMode("register")}>
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href="#" className="text-purple-400 hover:text-purple-300" onClick={()=>setMode("login")}>
                  Sign in
                </Link>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login