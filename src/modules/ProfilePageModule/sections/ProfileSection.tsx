"use client";

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import useUserData from '@/lib/hooks/useUserData';

export const ProfileSection = () => {
    const { userData, isStudent, isTutor, isStaff } = useUserData();
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
                            {userData?.name || 'User'}
                        </h1>
                        <p className="text-gray-600 mb-4 text-lg">
                            {userData?.email}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {isStudent() && (
                                <Badge className="font-medium text-md bg-blue-100 text-blue-800 border-0">
                                    Student
                                </Badge>
                            )}
                            {isTutor() && (
                                <Badge className="font-medium text-md bg-green-100 text-green-800 border-0">
                                    Tutor
                                </Badge>
                            )}
                            {isStaff() && (
                                <Badge className="font-medium text-md bg-purple-100 text-purple-800 border-0">
                                    Staff
                                </Badge>
                            )}
                            {!isStudent() && !isTutor() && !isStaff() && (
                                <Badge className="font-medium text-md bg-gray-100 text-gray-800 border-0">
                                    User
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}