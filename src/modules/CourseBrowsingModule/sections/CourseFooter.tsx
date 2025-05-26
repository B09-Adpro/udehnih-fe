"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"
import { CourseFooterProps } from "../interface"

export function CourseFooter({ categories }: CourseFooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 text-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-black" />
              <span className="text-2xl font-bold">UdehNih</span>
            </div>
            <p className="text-gray-500">
              Platform pembelajaran online terbaik untuk mengembangkan skill dan karir Anda.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Kategori</h3>
            <ul className="space-y-2 text-gray-500">
              {categories.slice(0, 4).map((category) => (
                <li key={category}>
                  <Link href="#" className="hover:text-black">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Perusahaan</h3>
            <ul className="space-y-2 text-gray-500">
              <li>
                <Link href="#" className="hover:text-black">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Dukungan</h3>
            <ul className="space-y-2 text-gray-500">
              <li>
                <Link href="#" className="hover:text-black">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} UdehNih. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}