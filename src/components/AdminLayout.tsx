"use client";
import Link from 'next/link';
import React from 'react'

function AdminLayout({children}: {children: React.ReactNode}) {
    return (
        <div className='flex h-screen bg-gray-100'>
            <aside className='w-64 bg-white shadow-md'>
                <div className='p-6 text-2xl font-bold'>Admin Panel</div>
                <nav className='mt-10'>
                    <Link href="/admin/events" className="block py-2 px-6 hover:bg-gray-200 rounded">Events</Link>
                    <Link href="/admin/destinations" className="block py-2 px-6 hover:bg-gray-200 rounded">Destinations</Link>
                    <Link href="/admin/flights" className="block py-2 px-6 hover:bg-gray-200 rounded">Flights</Link>
                    <Link href="/admin/resorts" className="block py-2 px-6 hover:bg-gray-200 rounded">Resorts</Link>
                    <Link href="/admin/cars" className="block py-2 px-6 hover:bg-gray-200 rounded">Cars</Link>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}

export default AdminLayout
