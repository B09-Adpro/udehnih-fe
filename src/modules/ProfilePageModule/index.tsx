import React from 'react'
import { ProfileSection } from './sections/ProfileSection'
import { EnrolledCoursesSection } from './sections/EnrolledCoursesSection'

export const ProfilePageModule = () => {
    return (
        <main>
            <ProfileSection/>
            <EnrolledCoursesSection/>
        </main>
    )
}