'use client';
import { getCompletedItinerary } from '@/redux/completedTourSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { format, parseISO } from 'date-fns';
import { jsPDF } from 'jspdf';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import SummaryDialog from './SummaryDialog';

const Completed = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      dispatch(getCompletedItinerary(currentUser.id));
    }
  }, [dispatch, currentUser]);

  const getAllSummary = useSelector(
    (state: RootState) => state.summary.completedItineraries
  );

  const generatePDF = (summary: any) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text('Completed Tour Summary', 10, 10);

    doc.setFontSize(16);
    doc.text(`Trip Name: ${summary.tripName}`, 10, 30);
    doc.text(
      `Travel Dates: ${format(
        parseISO(summary.startDate),
        'MMM dd, yyyy'
      )} to ${format(parseISO(summary.endDate), 'MMM dd, yyyy')}`,
      10,
      40
    );
    doc.text(`Destinations: ${summary.destinations.join(', ')}`, 10, 50);
    doc.text(`Category: ${summary.category}`, 10, 60);
    doc.text(`Description: ${summary.description}`, 10, 70);
    doc.text(`Cost: ${summary.cost}`, 10, 80);
    doc.text(`Travelled Distance: ${summary.travelledDistance}`, 10, 90);

    // Display Activities
    let yPosition = 100;
    doc.text('Activities:', 10, yPosition);
    yPosition += 10;

    Object.entries(summary.activities).forEach(([destination, activities]) => {
      if (Array.isArray(activities)) {
        doc.text(`${destination}: ${activities.join(', ')}`, 10, yPosition);
        yPosition += 10;
      }
    });

    doc.text(`Summary: ${summary.summary}`, 10, yPosition + 10);

    doc.save(`${summary.tripName}_summary.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Completed Tours</h1>
      <div className="flex justify-end mr-10 mb-4">
        <SummaryDialog />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {getAllSummary.map((summary) => (
          <div key={summary.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  {summary.tripName}
                </h3>
                <p>
                  <strong>
                    {format(parseISO(summary.startDate), 'MMM dd, yyyy')} to{' '}
                    {format(parseISO(summary.endDate), 'MMM dd, yyyy')}
                  </strong>
                </p>
                <p>
                  <strong>Destinations:</strong>{' '}
                  {summary.destinations.join(', ')}
                </p>
                <p>
                  <strong>Category:</strong> {summary.category}
                </p>
                <p>
                  <strong>Description:</strong> {summary.description}
                </p>
                <p>
                  <strong>Cost:</strong> {summary.cost}
                </p>
                <p>
                  <strong>Travelled Distance:</strong>{' '}
                  {summary.travelledDistance}
                </p>
                {/* Display Activities */}
                <p>
                  <strong>Activities:</strong>{' '}
                  {Object.entries(summary.activities).length > 0
                    ? Object.entries(summary.activities).map(
                        ([destination, activities]) => (
                          <div key={destination}>
                            <strong>{destination}:</strong>{' '}
                            {activities.join(', ')}
                          </div>
                        )
                      )
                    : 'No activities'}
                </p>
                <p>
                  <strong>Summary:</strong> {summary.summary}
                </p>
                <Button className="w-fit" onClick={() => generatePDF(summary)}>
                  PDF
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Completed;
