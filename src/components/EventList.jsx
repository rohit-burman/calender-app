import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const EventList = ({ events, onEdit, onDelete }) => {
  if (events.length === 0) {
    return <p>No events for this day.</p>;
  }

  return (
    <div>
      {events.map((event, index) => (
        <Card key={index} className="mb-2">
          <CardHeader>
            <CardTitle>{event.name}</CardTitle>
            <CardDescription>
              {event.startTime} - {event.endTime}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {event.description && <p>{event.description}</p>}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => onEdit(index, event)}>
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(index)} className="ml-2">
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default EventList;
