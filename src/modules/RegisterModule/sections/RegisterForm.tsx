"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { registerSchema, PASSWORD_CRITERIA } from '../constant';
import { RegisterFormValues } from '../interface';
import { AuthService } from '@/lib/services/auth.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);  

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch 
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      terms: false
    }
  });

  const password = watch('password');

  React.useEffect(() => {
    if (password) {
      let strength = 0;
      PASSWORD_CRITERIA.forEach(criteria => {
        if (!criteria.optional && criteria.regex.test(password)) {
          strength += 1;
        }
      });

      if (/[^A-Za-z0-9]/.test(password)) {
        strength += 1;
      }
      
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      await AuthService.register(data.email, data.name, data.password);
      toast.success('Berhasil membuat akun');
      router.push('/login');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Terjadi kesalahan pada server, silakan coba lagi nanti');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input 
          id="name" 
          placeholder="Masukkan nama lengkap" 
          className={`h-11 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1 flex items-start">
            <AlertCircle className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
            {errors.name.message}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Alamat Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="email@example.com" 
          className={`h-11 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
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
            placeholder="Minimal 8 karakter" 
            className={`h-11 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1 flex items-start">
            <AlertCircle className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
            {errors.password.message}
          </p>
        )}
        
        {password && (
          <>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Kekuatan Password</span>
                <span className="text-xs font-medium">
                  {passwordStrength === 0 && 'Lemah'}
                  {passwordStrength === 1 && 'Cukup'}
                  {passwordStrength === 2 && 'Sedang'}
                  {passwordStrength === 3 && 'Kuat'}
                  {passwordStrength === 4 && 'Sangat Kuat'}
                </span>
              </div>
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    passwordStrength === 0 ? 'bg-red-500' : 
                    passwordStrength === 1 ? 'bg-orange-500' : 
                    passwordStrength === 2 ? 'bg-yellow-500' : 
                    passwordStrength === 3 ? 'bg-green-500' : 
                    'bg-green-600'
                  }`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1 mt-2">
              {PASSWORD_CRITERIA.filter(c => !c.optional || (c.optional && c.id !== 'special')).map((criteria) => (
                <div key={criteria.id} className="flex items-center">
                  {criteria.regex.test(password) ? 
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" /> : 
                    <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-gray-300" />
                  }
                  <span>{criteria.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <input
          id="terms"
          type="checkbox"
          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          {...register('terms')}
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          Saya menyetujui <a href="#" className="text-primary hover:underline">Syarat dan Ketentuan</a> serta <a href="#" className="text-primary hover:underline">Kebijakan Privasi</a>
        </label>
      </div>
      {errors.terms && (
        <p className="text-xs text-red-500 mt-1 flex items-start">
          <AlertCircle className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
          {errors.terms.message}
        </p>
      )}
      
      <Button type="submit" className="w-full h-11 mt-6" disabled={isLoading} onClick={handleSubmit(onSubmit)}>
        {isLoading ? 'Membuat akun...' : 'Daftar Sekarang'}
      </Button>
    </form>
  );
};

export default RegisterForm;