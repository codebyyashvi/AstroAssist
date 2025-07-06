import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white p-4 text-center">
      <div className="container mx-auto">
        <p>&copy; 2025 MOSDAC. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="https://mosdac.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
            MOSDAC Website
          </a>
          <a href="mailto:support@mosdac.gov.in" className="hover:text-blue-300">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;