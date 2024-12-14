import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from './ui/dialog';

const AddEventModal = ({ isOpen, onClose, onSave, selectedDate, event }) => {
  const [eventName, setEventName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#007bff'); // Default color
  const [isAllDay, setIsAllDay] = useState(false);

  useEffect(() => {
    if (event) {
      setEventName(event.name);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setDescription(event.description);
      setColor(event.color || '#007bff');
      setIsAllDay(event.isAllDay || false);
    } else {
      setEventName('');
      setStartTime('');
      setEndTime('');
      setDescription('');
      setColor('#007bff');
      setIsAllDay(false);
    }
  }, [event]);

  const handleSave = () => {
    onSave({
      name: eventName,
      startTime: isAllDay ? '00:00' : startTime,
      endTime: isAllDay ? '23:59' : endTime,
      description,
      date: selectedDate,
      color,
      isAllDay
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription>
            Add a new event to the calendar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="eventName" className="text-right">
              Event Name
            </label>
            <Input
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="startTime" className="text-right">
              Start Time
            </label>
            <Input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="col-span-3"
              disabled={isAllDay}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="endTime" className="text-right">
              End Time
            </label>
            <Input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="col-span-3"
              disabled={isAllDay}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="color" className="text-right">
              Color
            </label>
            <Input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="allDay" className="text-right">
              All-day
            </label>
            <Checkbox
              id="allDay"
              checked={isAllDay}
              onCheckedChange={setIsAllDay}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
