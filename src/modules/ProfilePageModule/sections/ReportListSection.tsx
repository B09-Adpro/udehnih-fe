import React from 'react';
import { REPORTS } from '../constant';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ReportListSection = () => {
  return (
    <section className="w-full pb-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Laporan Terbaru
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REPORTS.map((report) => (
            <Card key={report.id} className="border-0 shadow-md">
              <CardContent className="px-6 py-2">
                <div className="relative mb-2">
                  <Badge className="font-medium bg-primary/10 text-primary border-0 mb-4">
                    {report.status}
                  </Badge>
                  <h3 className="text-lg font-semibold mb-2">
                    {report.title}
                  </h3>
                  <p className="text-gray-600 relative z-10">
                    {report.detail}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReportListSection;