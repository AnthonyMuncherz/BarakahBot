'use client';

import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(ArcElement, Tooltip, Legend);

const mockDonations = [
  { name: 'Fatima Yousra', amount: 500000 },
  { name: 'Jane Smith', amount: 3000040 },
  { name: 'Ali Baba', amount: 200000 },
  { name: 'Maria Lee', amount: 34450 },
  { name: 'Ahmed Khan', amount: 333100 },
];

export default function DonationReport() {
  const [showChart, setShowChart] = useState(false);

  const data = {
    labels: mockDonations.map((d) => d.name),
    datasets: [
      {
        label: 'Donations (RM)',
        data: mockDonations.map((d) => d.amount),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ],
      },
    ],
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Donation Report', 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [['Donor', 'Amount (RM)']],
      body: mockDonations.map((donor) => [donor.name, `RM ${donor.amount}`]),
    });
    doc.save('donation-report.pdf');
  };

  const downloadCSV = () => {
    const headers = 'Donor,Amount (RM)\n';
    const rows = mockDonations.map((d) => `${d.name},${d.amount}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'donation-report.csv';
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold text-brand-dark-green">Donation Breakdown</h2>

      <table className="w-full text-left border mt-4">
        <thead>
          <tr className="bg-muted text-sm">
            <th className="px-4 py-2">Donor</th>
            <th className="px-4 py-2">Amount (RM)</th>
          </tr>
        </thead>
        <tbody>
          {mockDonations.map((donor, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{donor.name}</td>
              <td className="px-4 py-2">RM {donor.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-wrap gap-4">
        <Button onClick={() => setShowChart(!showChart)} variant="outline">
          {showChart ? 'Hide' : 'Show'} Pie Chart
        </Button>
        <Button onClick={downloadPDF}>Download PDF</Button>
        <Button onClick={downloadCSV} variant="ghost">
          Download CSV
        </Button>
      </div>

      {showChart && (
        <div className="max-w-md mt-6">
          <Pie data={data} />
        </div>
      )}
    </div>
  );
}
