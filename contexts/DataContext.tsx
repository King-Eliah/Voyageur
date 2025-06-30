import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  image: string;
  description?: string;
  budget?: number;
  currency?: string;
}

export interface Booking {
  id: string;
  type: 'hotel' | 'car' | 'taxi' | 'attraction';
  title: string;
  location: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
  currency: string;
  image: string;
  details: any;
}

export interface SavedItem {
  id: string;
  type: 'destination' | 'hotel' | 'attraction';
  title: string;
  location: string;
  image: string;
  rating: number;
  price?: number;
}

interface DataContextType {
  trips: Trip[];
  bookings: Booking[];
  savedItems: SavedItem[];
  addTrip: (trip: Omit<Trip, 'id'>) => Promise<void>;
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  updateBooking: (id: string, booking: Partial<Booking>) => Promise<void>;
  addSavedItem: (item: SavedItem) => Promise<void>;
  removeSavedItem: (id: string) => Promise<void>;
  isItemSaved: (id: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tripsData, bookingsData, savedItemsData] = await Promise.all([
        AsyncStorage.getItem('trips'),
        AsyncStorage.getItem('bookings'),
        AsyncStorage.getItem('savedItems'),
      ]);

      if (tripsData) setTrips(JSON.parse(tripsData));
      if (bookingsData) setBookings(JSON.parse(bookingsData));
      if (savedItemsData) setSavedItems(JSON.parse(savedItemsData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const addTrip = async (trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString(),
    };
    
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    await AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  const updateTrip = async (id: string, tripData: Partial<Trip>) => {
    const updatedTrips = trips.map(trip =>
      trip.id === id ? { ...trip, ...tripData } : trip
    );
    setTrips(updatedTrips);
    await AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  const deleteTrip = async (id: string) => {
    const updatedTrips = trips.filter(trip => trip.id !== id);
    setTrips(updatedTrips);
    await AsyncStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  const addBooking = async (booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
    };
    
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    await AsyncStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const updateBooking = async (id: string, bookingData: Partial<Booking>) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === id ? { ...booking, ...bookingData } : booking
    );
    setBookings(updatedBookings);
    await AsyncStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const addSavedItem = async (item: SavedItem) => {
    const updatedSavedItems = [...savedItems, item];
    setSavedItems(updatedSavedItems);
    await AsyncStorage.setItem('savedItems', JSON.stringify(updatedSavedItems));
  };

  const removeSavedItem = async (id: string) => {
    const updatedSavedItems = savedItems.filter(item => item.id !== id);
    setSavedItems(updatedSavedItems);
    await AsyncStorage.setItem('savedItems', JSON.stringify(updatedSavedItems));
  };

  const isItemSaved = (id: string) => {
    return savedItems.some(item => item.id === id);
  
  };

  return (
    <DataContext.Provider value={{
      trips,
      bookings,
      savedItems,
      addTrip,
      updateTrip,
      deleteTrip,
      addBooking,
      updateBooking,
      addSavedItem,
      removeSavedItem,
      isItemSaved,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}