'use client';

import { Calendar, Heart, MapPin, MessageCircle, Search, Shield, Users } from 'lucide-react';
import { useState } from 'react';

export default function DemoPage() {
  const [selectedChild, setSelectedChild] = useState(0);
  const matches = [
    {
      name: 'Emma Thompson',
      age: 8,
      distance: '0.8 mi away',
      compatibility: 95,
      interests: ['Arts & Crafts', 'Reading', 'Nature'],
      avatar: '👧',
      parent: 'Sarah Thompson',
      nextAvailable: 'Saturday 2pm',
    },
    {
      name: 'Lucas Martinez',
      age: 7,
      distance: '1.2 mi away',
      compatibility: 88,
      interests: ['LEGO Building', 'Science', 'Board Games'],
      avatar: '👦',
      parent: 'Maria Martinez',
      nextAvailable: 'Sunday 10am',
    },
    {
      name: 'Olivia Chen',
      age: 8,
      distance: '0.5 mi away',
      compatibility: 92,
      interests: ['Reading', 'Music', 'Arts & Crafts'],
      avatar: '👧',
      parent: 'Wei Chen',
      nextAvailable: 'Friday 4pm',
    },
  ];

  const children = [
    {
      name: 'Sophia',
      age: 8,
      interests: ['Arts & Crafts', 'Reading', 'Music'],
      avatar: '👧',
    },
    {
      name: 'Noah',
      age: 6,
      interests: ['Sports', 'LEGO', 'Outdoor Play'],
      avatar: '👦',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  PlayConnect
                </h1>
                <p className="text-xs text-gray-500">DEMO MODE - No Database Required</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Your Children */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Your Children
              </h2>
              <div className="space-y-3">
                {children.map((child, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedChild(idx)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedChild === idx
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{child.avatar}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">{child.name}</h3>
                        <p className="text-sm text-gray-500">{child.age} years old</p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {child.interests.slice(0, 2).map((interest, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-white rounded-full text-purple-600"
                        >
                          {interest}
                        </span>
                      ))}
                      {child.interests.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-500">
                          +{child.interests.length - 2}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button className="w-full mt-4 py-2 px-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-all">
                + Add Another Child
              </button>
            </div>
          </div>

          {/* Main Content - Matches */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Perfect Matches for {children[selectedChild].name} ✨
              </h2>
              <p className="text-gray-600">
                We found {matches.length} amazing playdate opportunities nearby
              </p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm border-2 border-purple-300 text-purple-600 font-medium">
                All Matches
              </button>
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm hover:border-purple-200 border-2 border-transparent">
                This Week
              </button>
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm hover:border-purple-200 border-2 border-transparent">
                Nearby
              </button>
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm hover:border-purple-200 border-2 border-transparent">
                High Compatibility
              </button>
            </div>

            {/* Match Cards */}
            <div className="space-y-4">
              {matches.map((match, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-transparent hover:border-purple-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{match.avatar}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{match.name}</h3>
                        <p className="text-gray-600">{match.age} years old</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {match.distance}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-green-700">
                          {match.compatibility}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Shared Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.interests.map((interest, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm text-purple-700 font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Parent Info */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Parent: {match.parent} • Verified Profile</span>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Next Available: {match.nextAvailable}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Send Playdate Request
                    </button>
                    <button className="py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <button className="px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-purple-200 text-purple-600 font-medium">
                Load More Matches
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Features Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Why Parents Love PlayConnect
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Smart Matching</h3>
              <p className="text-gray-600 text-sm">
                Our AI finds the perfect playdate matches based on interests, age, and location
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Safety First</h3>
              <p className="text-gray-600 text-sm">
                Verified profiles, background checks, and privacy controls you can trust
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Scheduling</h3>
              <p className="text-gray-600 text-sm">
                Coordinate playdates effortlessly with built-in calendar and messaging
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
