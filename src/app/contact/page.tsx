import React from 'react';
import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact — GlukonddVerse',
  description: 'Transmit directly to the private server.',
};

export default function ContactPage() {
  return <ContactClient />;
}
