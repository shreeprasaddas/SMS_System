import React from 'react';

function Footer() {
  return (
    <footer className="bg-white border-t border-secondary-200 py-4 px-6 text-center text-sm text-secondary-500">
      <p>&copy; {new Date().getFullYear()} School Management System. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
