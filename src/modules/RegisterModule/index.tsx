import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from './sections/RegisterForm';

export const RegisterModule = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Buat Akun Baru</CardTitle>
          <CardDescription className="text-center">
            Daftar untuk mendapatkan akses ke semua kursus kami
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-gray-600">
            Sudah punya akun? <a href="/login" className="text-primary font-medium hover:underline">Masuk di sini</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
