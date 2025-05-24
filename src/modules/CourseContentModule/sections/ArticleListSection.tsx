"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction } from 'lucide-react';

export const ArticleListSection = () => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Construction className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Dalam Pengembangan</h3>
        <p className="text-gray-600 mb-6">
          Fitur article list sedang dalam pengembangan
        </p>
        <Button disabled>Coming Soon</Button>
      </CardContent>
    </Card>
  );
};