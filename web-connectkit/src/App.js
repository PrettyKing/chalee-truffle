import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Web ConnectKit
          </h1>
          <p className="text-lg text-gray-600">
            React application with Tailwind CSS
          </p>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Welcome to your React App!
            </h2>
            <p className="text-gray-600 mb-4">
              This project is set up with:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>React 17.0.2</li>
              <li>Tailwind CSS 3.3.0</li>
              <li>Modern build tools</li>
              <li>Ready for ConnectKit integration</li>
            </ul>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                🚀 Getting Started
              </h3>
              <p className="text-gray-600">
                Run <code className="bg-gray-100 px-2 py-1 rounded">npm start</code> to start the development server.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                🎨 Styling
              </h3>
              <p className="text-gray-600">
                Tailwind CSS is configured and ready to use. Edit the classes to customize your design.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;