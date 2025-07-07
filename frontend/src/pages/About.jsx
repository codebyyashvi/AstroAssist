import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 to-gray-100 min-h-screen text-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">About MOSDAC Chatbot</h2>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <section className="mb-6">
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Our Project</h3>
          <p className="text-gray-600">
            The MOSDAC Chatbot is an AI-powered web application designed for the MOSDAC competition to enhance access to meteorological and oceanographic data. Built with ReactJS, it provides an intuitive interface for users to explore satellite data, live updates, and PDF resources, supporting ISRO’s mission to advance space research and public data access.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Our Mission</h3>
          <p className="text-gray-600">
            Our mission is to create a user-friendly, scalable platform that leverages AI for geospatial intelligence and information retrieval. By integrating chat-based queries, real-time event visualization, and PDF analysis, we aim to empower researchers, scientists, and the public with seamless access to MOSDAC’s vast data resources. The app is designed to be modular, reusable for other ISRO portals like BHUVAN.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Key Features</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>Chat Interface</strong>: Ask questions about MOSDAC data (e.g., “What is INSAT-3D?”) with a history sidebar.
            </li>
            <li>
              <strong>Live Updates</strong>: View real-time events on a map and query locations by clicking coordinates (e.g., “Weather at lat: 13.08, lng: 80.27”).
            </li>
            <li>
              <strong>PDF Viewing</strong>: Browse and filter MOSDAC PDFs by topic (e.g., Satellite Manuals).
            </li>
            <li>
              <strong>PDF Bot</strong>: Analyze PDFs with a side-by-side chat interface, supporting AI-driven queries (mocked for now).
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Our Vision</h3>
          <p className="text-gray-600">
            Our team is committed to building innovative tools that bridge technology and space science. We aim to make MOSDAC data accessible to all, fostering collaboration and discovery. This frontend is a foundation for a full-stack solution, ready for backend integration with FastAPI, MongoDB, and Qdrant.
          </p>
        </section>

        <div className="text-center">
          <Link
            to="/"
            className="inline-block p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            aria-label="Go to Chat page"
          >
            Try the Chatbot
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;