/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Layout from './components/Layout';
import { JobBriefing } from './components/JobBriefing';
import { RiskAssessment } from './components/RiskAssessment';
import { HealthAssessment } from './components/HealthAssessment';
import { MediaDocumentation } from './components/MediaDocumentation';
import { WorkOrder } from './components/WorkOrder';
import { Consultation } from './components/Consultation';
import { TreeSurvey } from './components/TreeSurvey';
import { StormDamage } from './components/StormDamage';
import { WeeklySafetyMeeting } from './components/WeeklySafetyMeeting';
import { EquipmentInspection } from './components/EquipmentInspection';
import { PrintableTemplates } from './components/PrintableTemplates';
import { SiteProvider } from './context/SiteContext';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const [activeTab, setActiveTab] = useState('briefing');
  const { user, loading, signIn } = useFirebase();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 font-serif italic">ArborGuard</h1>
          <p className="text-gray-600 mb-8">Please sign in to access the field forms and safety documentation.</p>
          <button
            onClick={signIn}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'briefing':
        return <JobBriefing />;
      case 'risk':
        return <RiskAssessment />;
      case 'health':
        return <HealthAssessment />;
      case 'workorder':
        return <WorkOrder />;
      case 'consultation':
        return <Consultation />;
      case 'survey':
        return <TreeSurvey />;
      case 'storm':
        return <StormDamage />;
      case 'safety':
        return <WeeklySafetyMeeting />;
      case 'equipment':
        return <EquipmentInspection />;
      case 'media':
        return <MediaDocumentation />;
      default:
        return <JobBriefing />;
    }
  };

  return (
    <SiteProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
      <PrintableTemplates />
    </SiteProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <AppContent />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
