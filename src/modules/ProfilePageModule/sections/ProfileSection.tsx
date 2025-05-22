import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const ProfileSection = () => {
    return (
        <section className="w-full py-20">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-12">
                    <div className="relative w-full aspect-square max-w-[180px]">
                        <Avatar className="w-full h-full relative flex shrink-0 overflow-hidden rounded-full">
                            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile Picture" className="aspect-square h-full w-full object-cover" />
                            <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-gray-200"/>
                        </Avatar>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Stray Kids
                        </h1>
                        <p className="text-gray-600 mb-4 text-lg">
                            straykids@jype.com
                        </p>
                        <Badge className="font-medium text-md bg-primary/10 text-primary border-0">
                            Student
                        </Badge>
                    </div>
                </div>
            </div>
        </section>
    )
}