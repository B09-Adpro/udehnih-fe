import React from 'react'
import { ProfileSection } from './sections/ProfileSection'
import { EnrolledCoursesSection } from './sections/EnrolledCoursesSection'
import { ReportListSection } from './sections/ReportListSection'

export const ProfilePageModule = () => {
    return (
        <main>
            <ProfileSection/>
            <EnrolledCoursesSection/>
            <ReportListSection/>
        </main>
    )
}