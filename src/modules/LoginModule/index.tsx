"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './sections/LoginForm';

export const LoginModule = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Masuk ke Akun</CardTitle>
          <CardDescription className="text-center">
            Masukkan kredensial Anda untuk mengakses platform pembelajaran
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-gray-600">
            Belum punya akun? <a href="/register" className="text-primary font-medium hover:underline">Daftar di sini</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginModule;