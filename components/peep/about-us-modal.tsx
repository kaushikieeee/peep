'use client';

import { X } from 'lucide-react';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-gray-700 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">About PEEP</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-gray-300 space-y-6">
          {/* Project Overview */}
          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Project Overview</h3>
            <p className="text-sm leading-relaxed">
              PEEP is a community-driven approach to environmental monitoring and reporting. 
              Our platform empowers citizens to report environmental issues, track their status, 
              and collaborate with authorities to create a cleaner, healthier community. 
              With features for real-time mapping, evidence management, and authority escalation, 
              PEEP bridges the gap between citizens and environmental officials.
            </p>
          </section>

          {/* Tech Stack */}
          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Technology Stack</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-white">Languages</p>
                <p>TypeScript, JavaScript</p>
              </div>
              <div>
                <p className="font-semibold text-white">Frontend Framework</p>
                <p>Next.js 16.0.3 with React 19, Tailwind CSS 4</p>
              </div>
              <div>
                <p className="font-semibold text-white">Build Tool</p>
                <p>Turbopack (bundler for Next.js)</p>
              </div>
              <div>
                <p className="font-semibold text-white">UI Components & Icons</p>
                <p>Custom UI library with Lucide React icons</p>
              </div>
              <div>
                <p className="font-semibold text-white">Package Manager</p>
                <p>npm / pnpm</p>
              </div>
            </div>
          </section>

          {/* Database & Backend */}
          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Database & Backend</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-white">Primary Data Source</p>
                <p>Google Sheets API for evidence and reports management</p>
              </div>
              <div>
                <p className="font-semibold text-white">Backend API</p>
                <p>Next.js API Routes (server-side rendering and API endpoints)</p>
              </div>
              <div>
                <p className="font-semibold text-white">Geolocation</p>
                <p>Browser Geolocation API for user location tracking</p>
              </div>
              <div>
                <p className="font-semibold text-white">Data Format</p>
                <p>JSON-based REST API responses</p>
              </div>
            </div>
          </section>

          {/* Architecture & Setup */}
          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Architecture & Setup</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-white">Frontend Architecture</p>
                <p>Client-side components with React hooks, server-side data fetching, and dynamic routing</p>
              </div>
              <div>
                <p className="font-semibold text-white">Module Structure</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>/app - Page routes (admin, peep user sections)</li>
                  <li>/components - Reusable UI components</li>
                  <li>/lib - Utilities and API helpers</li>
                  <li>/styles - Global styling and animations</li>
                  <li>/data - Mock data and seed files</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white">Key Features</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Real-time interactive mapping with live pin updates</li>
                  <li>Evidence escalation system to authorities</li>
                  <li>Bulk operations for evidence management</li>
                  <li>Statistical dashboard with analytics</li>
                  <li>Advanced filtering and search capabilities</li>
                  <li>Responsive design for mobile and desktop</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Environment & Deployment */}
          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Environment & Deployment</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-white">Development Server</p>
                <p>Next.js Dev Server (localhost:3001)</p>
              </div>
              <div>
                <p className="font-semibold text-white">Build Process</p>
                <p>Next.js with TypeScript strict mode, zero compilation errors</p>
              </div>
              <div>
                <p className="font-semibold text-white">Configuration</p>
                <p>Environment variables via .env.local for API endpoints and sensitive data</p>
              </div>
            </div>
          </section>

          {/* Team */}
          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Team</h3>
            <div className="space-y-2 text-sm">
              <p>Created by:</p>
              <div className="space-y-2 ml-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span>Pragadeesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span>Aadhityan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span>Yashwanth</span>
                </div>
              </div>
            </div>
          </section>

          {/* License & Support */}
          <section>
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Support & Contribution</h3>
            <p className="text-sm leading-relaxed">
              PEEP is built with the community in mind. We welcome feedback, bug reports, 
              and feature suggestions to make environmental monitoring more accessible and effective.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
