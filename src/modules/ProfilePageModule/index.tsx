import React from 'react'
import { ProfileSection } from './sections/ProfileSection'
import { EnrolledCoursesSection } from './sections/EnrolledCoursesSection'
import { UserReviewsSection } from './sections/UserReviewsSection'
import { ReportListSection } from './sections/ReportListSection'

export const ProfilePageModule = () => {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <ProfileSection />
                <EnrolledCoursesSection />
                <UserReviewsSection />
                <ReportListSection />
            </div>
        </main>
    )
}   