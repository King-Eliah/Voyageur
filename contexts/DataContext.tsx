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
  clearSavedItems: () => Promise<void>; // Added clear function
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Track loading state

  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveData();
    }
  }, [trips, bookings, savedItems]);

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
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoaded(true);
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('trips', JSON.stringify(trips)),
        AsyncStorage.setItem('bookings', JSON.stringify(bookings)),
        AsyncStorage.setItem('savedItems', JSON.stringify(savedItems)),
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addTrip = async (trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString(),
    };
    setTrips(prev => [...prev, newTrip]);
  };

  const updateTrip = async (id: string, tripData: Partial<Trip>) => {
    setTrips(prev => 
      prev.map(trip => trip.id === id ? { ...trip, ...tripData } : trip)
    );
  };

  const deleteTrip = async (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
  };

  const addBooking = async (booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBooking = async (id: string, bookingData: Partial<Booking>) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, ...bookingData } : booking
      )
    );
  };

  const addSavedItem = async (item: SavedItem) => {
    // Prevent duplicates
    if (!savedItems.some(savedItem => savedItem.id === item.id)) {
      setSavedItems(prev => [...prev, item]);
    }
  };

  const removeSavedItem = async (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  const clearSavedItems = async () => {
    setSavedItems([]);
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
      clearSavedItems, // Added clear function
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