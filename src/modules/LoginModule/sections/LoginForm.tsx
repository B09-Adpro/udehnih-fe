"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, AlertCircle } from 'lucide-react';
import { loginSchema, LoginFormValues } from '../constant';
import { AuthService } from '@/lib/services/auth.service';
import useUserData from '@/lib/hooks/useUserData';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUserData } = useUserData();
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    
    try {
      await AuthService.login(data.email, data.password);
      toast.success('Berhasil masuk');
      await refreshUserData();
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error?.message || 'Email atau password salah');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Alamat Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="email@example.com" 
          className={`h-11 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
          disabled={isLoading}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1 flex items-start">
            <AlertCircle className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
            {errors.email.message}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-xs text-gray-500 hover:text-primary"
            disabled={isLoading}
          >
            {showPassword ? (
              <span className="flex items-center">
                <EyeOffIcon className="h-3.5 w-3.5 mr-1" />
                Sembunyikan
              </span>
            ) : (
              <span className="flex items-center">
                <EyeIcon className="h-3.5 w-3.5 mr-1" />
                Lihat
              </span>
            )}
          </button>
        </div>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"} 
            placeholder="Masukkan password" 
            className={`h-11 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
            disabled={isLoading}
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1 flex items-start">
            <AlertCircle className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
            {errors.password.message}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            disabled={isLoading}
            {...register('remember')}
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">
            Ingat saya
          </label>
        </div>
        
        <a href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
          Lupa password?
        </a>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-11" 
        disabled={isLoading}
      >
        {isLoading ? 'Sedang Masuk...' : 'Masuk'}
      </Button>
    </form>
  );
};

export default LoginForm;