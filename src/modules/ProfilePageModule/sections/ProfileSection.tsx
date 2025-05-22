import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Mail, Phone, MapPin, Calendar, BookOpen, Award } from 'lucide-react';

export const ProfileSection = () => {
    return (
        <section className="w-full py-20">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-12">
                    <div className="relative w-full aspect-square max-w-[240px]">
                        <Avatar className="w-full h-full relative flex shrink-0 overflow-hidden rounded-full">
                            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile Picture" className="aspect-square h-full w-full object-cover" />
                            <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-gray-200">
                                <span className="text-6xl">SK</span>
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            You Make Stray Kids Stay
                        </h1>
                        <p className="text-gray-600 mb-8 text-lg">
                            Stray Kids Everywhere All Around the World, You Make Stray Kids Stay
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}