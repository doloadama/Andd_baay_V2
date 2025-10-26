
import React from 'react';
import { User } from '../types';

interface ContactFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: User;
}

const ContactFarmerModal: React.FC<ContactFarmerModalProps> = ({ isOpen, onClose, farmer }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Message sent to ${farmer.name}! (Feature is for demonstration)`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Contact {farmer.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Farmer's contact email: <a href={`mailto:${farmer.contact}`} className="text-green-600 underline">{farmer.contact}</a></p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <input type="text" id="subject" defaultValue={`Inquiry about your harvest`} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea id="message" rows={5} placeholder={`Hi ${farmer.name}, I'm interested in...`} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactFarmerModal;
