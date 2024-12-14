import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addDays } from 'date-fns';
import AddEventModal from './AddEventModal.jsx';
import EventList from './EventList.jsx';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents).map((event) => ({ ...event, date: new Date(event.date) })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  let clickTimeout;

  const handleDayClick = (day) => {
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      setSelectedDate(day);
    }, 200);
  };

  const handleDayDoubleClick = (day) => {
    clearTimeout(clickTimeout);
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setEditingEventIndex(null);
  };

  const handleSaveEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
    };
    const overlaps = events.some(
      (existingEvent) =>
        isSameDay(existingEvent.date, newEvent.date) &&
        ((newEvent.startTime >= existingEvent.startTime && newEvent.startTime < existingEvent.endTime) ||
          (newEvent.endTime > existingEvent.startTime && newEvent.endTime <= existingEvent.endTime) ||
          (newEvent.startTime <= existingEvent.startTime && newEvent.endTime >= existingEvent.endTime))
    );

    if (overlaps) {
      alert('Error: This event overlaps with an existing event.');
    } else {
      setEvents([...events, newEvent]);
      setIsModalOpen(false);
    }
  };

  const handleEditEvent = (index, event) => {
    setEditingEventIndex(index);
    setIsEditModalOpen(true);
  };

  const handleDeleteEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const handleUpdateEvent = (event) => {
    if (editingEventIndex !== null) {
      const overlaps = events.some(
        (existingEvent, i) =>
          i !== editingEventIndex &&
          isSameDay(existingEvent.date, event.date) &&
          ((event.startTime >= existingEvent.startTime && event.startTime < existingEvent.endTime) ||
            (event.endTime > existingEvent.startTime && event.endTime <= existingEvent.endTime) ||
            (event.startTime <= existingEvent.startTime && event.endTime >= existingEvent.endTime))
      );

      if (overlaps) {
        alert('Error: This event overlaps with an existing event.');
      } else {
        setEvents(events.map((e, i) => (i === editingEventIndex ? event : e)));
        setIsEditModalOpen(false);
        setEditingEventIndex(null);
      }
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const filteredEvents = selectedDate
    ? events.filter((event) => isSameDay(event.date, selectedDate) && (
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
      ))
    : [];

  const exportEventsAsJSON = () => {
    const eventsToExport = events.filter((event) => isSameMonth(event.date, currentMonth));
    const json = JSON.stringify(eventsToExport);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `events-${format(currentMonth, 'MMMM-yyyy')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportEventsAsCSV = () => {
    const eventsToExport = events.filter((event) => isSameMonth(event.date, currentMonth));
    const header = 'Name,Start Time,End Time,Description,Date,Color,All Day\n';
    const csv = eventsToExport
      .map((event) =>
        `"${event.name}","${event.startTime}","${event.endTime}","${event.description}","${format(
          event.date,
          'yyyy-MM-dd'
        )}","${event.color}","${event.isAllDay ? 'Yes' : 'No'}"`
      )
      .join('\n');
    const csvContent = header + csv;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `events-${format(currentMonth, 'MMMM-yyyy')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const eventId = draggableId;
    const sourceDate = new Date(source.droppableId);
    const destinationDate = new Date(destination.droppableId);
    const dayDifference = Math.floor((destinationDate.getTime() - sourceDate.getTime()) / (1000 * 60 * 60 * 24));

    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((event) => {
        if (event.id === eventId) {
          const newDate = addDays(event.date, dayDifference);
          return { ...event, date: newDate };
        }
        return event;
      });
      return updatedEvents;
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handlePrevMonth} variant="outline">Previous</Button>
          <div className="text-center text-xl font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <Button onClick={handleNextMonth} variant="outline">Next</Button>
        </div>
        <div className="flex justify-center mb-4">
          <Button onClick={() => handleDayDoubleClick(new Date())}>Add Event</Button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          <div className="text-center font-bold">Sun</div>
          <div className="text-center font-bold">Mon</div>
          <div className="text-center font-bold">Tue</div>
          <div className="text-center font-bold">Wed</div>
          <div className="text-center font-bold">Thu</div>
          <div className="text-center font-bold">Fri</div>
          <div className="text-center font-bold">Sat</div>

          {/* Calendar days */}
          {daysInMonth.map((day) => (
            <Droppable droppableId={day.toISOString()} key={day.toISOString()}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  onClick={() => handleDayClick(day)}
                  onDoubleClick={() => handleDayDoubleClick(day)}
                  className={`text-center border p-2 cursor-pointer ${
                    isSameMonth(day, currentMonth) ? '' : 'text-gray-400'
                  } ${isSameDay(day, new Date()) ? 'bg-blue-200' : ''} ${
                    selectedDate && isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : ''
                  }`}
                >
                  {format(day, 'd')}
                  {events
                    .filter((event) => isSameDay(event.date, day))
                    .map((event, index) => (
                      <Draggable key={event.id} draggableId={event.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mt-1"
                          >
                            <CardHeader>
                              <CardTitle className="text-sm">{event.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <CardDescription className="text-xs">
                                {event.isAllDay ? 'All-day' : `${event.startTime} - ${event.endTime}`}
                              </CardDescription>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>

        <AddEventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          selectedDate={selectedDate || new Date()}
        />

        {isEditModalOpen && editingEventIndex !== null && (
          <AddEventModal
            isOpen={isEditModalOpen}
            onClose={handleCloseModal}
            onSave={handleUpdateEvent}
            selectedDate={selectedDate || new Date()}
            event={events[editingEventIndex]}
          />
        )}

        {selectedDate && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Events for {format(selectedDate, 'MMMM d, yyyy')}:</h3>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border p-2 mb-2"
            />
            <EventList
              events={filteredEvents}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          </div>
        )}
        <div className="mt-4">
          <Button onClick={exportEventsAsJSON} variant="outline">Export as JSON</Button>
          <Button onClick={exportEventsAsCSV} variant="outline">Export as CSV</Button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Calendar;
