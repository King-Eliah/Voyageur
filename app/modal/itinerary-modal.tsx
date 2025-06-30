import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import {
  X,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Edit3,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Circle,
  ChevronRight,
  Hotel,
  Bus,
  Utensils,
  Activity,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

interface ItineraryItem {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  type: 'activity' | 'accommodation' | 'transport' | 'meal';
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Trip {
  id: string;
  title: string;
  itinerary?: ItineraryItem[];
  status: string;
}

interface NewItemState {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  type: 'activity' | 'accommodation' | 'transport' | 'meal';
  completed: boolean;
}

interface ItineraryModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ItineraryModal({ visible, onClose }: ItineraryModalProps) {
  const { colors } = useTheme();
  const { trips, updateTrip } = useData();
  
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end' | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPickerField, setCurrentPickerField] = useState<'start' | 'end'>('start');
  
  const [newItem, setNewItem] = useState<NewItemState>({
    title: '',
    description: '',
    location: '',
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // Default 1 hour duration
    type: 'activity',
    completed: false,
  });

  const typeOptions = [
    { value: 'activity', label: 'Activity', icon: <Activity size={16} />, color: '#3B82F6' },
    { value: 'accommodation', label: 'Accommodation', icon: <Hotel size={16} />, color: '#8B5CF6' },
    { value: 'transport', label: 'Transport', icon: <Bus size={16} />, color: '#10B981' },
    { value: 'meal', label: 'Meal', icon: <Utensils size={16} />, color: '#F59E0B' },
  ];

  const availableTrips = useMemo(() => {
    return trips.filter(trip => trip.status !== 'completed');
  }, [trips]);

  useEffect(() => {
    if (availableTrips.length > 0 && !selectedTrip) {
      setSelectedTrip(availableTrips[0]);
    }
  }, [availableTrips, selectedTrip]);

  const groupedItinerary = useMemo(() => {
    if (!selectedTrip?.itinerary) return {};
    
    const grouped: Record<string, ItineraryItem[]> = {};
    selectedTrip.itinerary.forEach(item => {
      const day = new Date(item.startTime).toDateString();
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(item);
    });
    
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    });
    
    return grouped;
  }, [selectedTrip]);

  const resetForm = () => {
    setNewItem({
      title: '',
      description: '',
      location: '',
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 60 * 60 * 1000),
      type: 'activity',
      completed: false,
    });
    setShowAddForm(false);
    setEditingItem(null);
    setShowDatePicker(false);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      if (currentPickerField === 'start') {
        const newStartTime = selectedDate;
        const newEndTime = new Date(newStartTime.getTime() + 60 * 60 * 1000);
        
        setNewItem(prev => ({
          ...prev,
          startTime: newStartTime,
          endTime: prev.endTime < newStartTime ? newEndTime : prev.endTime
        }));
      } else {
        setNewItem(prev => ({
          ...prev,
          endTime: selectedDate > prev.startTime ? selectedDate : new Date(prev.startTime.getTime() + 60 * 60 * 1000)
        }));
      }
    }
  };

  const openTimePicker = (field: 'start' | 'end') => {
    setCurrentPickerField(field);
    setTempDate(field === 'start' ? newItem.startTime : newItem.endTime);
    setShowDatePicker(true);
  };

  const handleAddItem = () => {
    if (!newItem.title.trim()) {
      Alert.alert('Error', 'Please enter a title for the itinerary item');
      return;
    }

    if (!selectedTrip) {
      Alert.alert('Error', 'Please select a trip first');
      return;
    }

    const item: ItineraryItem = {
      id: Date.now().toString(),
      ...newItem,
      createdAt: new Date().toISOString(),
    };

    const updatedTrip = {
      ...selectedTrip,
      itinerary: [...(selectedTrip.itinerary || []), item],
    };

    updateTrip(selectedTrip.id, updatedTrip);
    setSelectedTrip(updatedTrip);
    resetForm();
  };

  const handleEditItem = (item: ItineraryItem) => {
    setEditingItem(item.id);
    setShowAddForm(true);
    setNewItem({
      title: item.title,
      description: item.description || '',
      location: item.location || '',
      startTime: new Date(item.startTime),
      endTime: new Date(item.endTime),
      type: item.type,
      completed: item.completed,
    });
  };

  const handleUpdateItem = () => {
    if (!selectedTrip || !editingItem) return;
    
    const updatedItinerary = (selectedTrip.itinerary || []).map(item => 
      item.id === editingItem ? { 
        ...item, 
        ...newItem,
        updatedAt: new Date().toISOString()
      } : item
    );

    const updatedTrip = {
      ...selectedTrip,
      itinerary: updatedItinerary
    };

    updateTrip(selectedTrip.id, updatedTrip);
    setSelectedTrip(updatedTrip);
    resetForm();
  };

  const toggleItemCompletion = (itemId: string) => {
    if (!selectedTrip) return;
    
    const updatedItinerary = (selectedTrip.itinerary || []).map(item => 
      item.id === itemId ? { 
        ...item, 
        completed: !item.completed,
        updatedAt: new Date().toISOString()
      } : item
    );

    const updatedTrip = {
      ...selectedTrip,
      itinerary: updatedItinerary
    };

    updateTrip(selectedTrip.id, updatedTrip);
    setSelectedTrip(updatedTrip);
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (!selectedTrip) return;
            
            const updatedItinerary = (selectedTrip.itinerary || []).filter(
              item => item.id !== itemId
            );
            
            const updatedTrip = {
              ...selectedTrip,
              itinerary: updatedItinerary
            };

            updateTrip(selectedTrip.id, updatedTrip);
            setSelectedTrip(updatedTrip);
          }
        }
      ]
    );
  };

  const getTypeColor = (type: string) => {
    const option = typeOptions.find(opt => opt.value === type);
    return option ? option.color : colors.primary;
  };

  const getTypeIcon = (type: string) => {
    const option = typeOptions.find(opt => opt.value === type);
    return option ? option.icon : '📝';
  };

  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (start: Date, end: Date) => {
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return `${duration.toFixed(1)}h`;
  };

  const renderDayGroup = (day: string, items: ItineraryItem[]) => {
    const { colors } = useTheme();
    const isExpanded = expandedDays[day];
    
    return (
      <View 
        key={day} 
        style={[styles.dayGroup, { backgroundColor: colors.card }]}
      >
        <TouchableOpacity
          style={styles.dayHeader}
          onPress={() => setExpandedDays(prev => ({
            ...prev,
            [day]: !isExpanded
          }))}
        >
          <View style={styles.dayInfo}>
            <Text style={[styles.dayTitle, { color: colors.text }]}>
              {formatDate(day)}
            </Text>
            <Text style={[styles.daySubtitle, { color: colors.textSecondary }]}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
          {isExpanded ? (
            <ChevronUp size={20} color={colors.textSecondary} />
          ) : (
            <ChevronDown size={20} color={colors.textSecondary} />
          )}
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.dayContent}>
            {items.map(item => renderItineraryItem(item))}
          </View>
        )}
      </View>
    );
  };

  const renderTripSelector = () => (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Trip</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tripSelectorContainer}
      >
        {availableTrips.map(trip => (
          <TouchableOpacity
            key={trip.id}
            style={[
              styles.tripSelectorItem,
              {
                backgroundColor: selectedTrip?.id === trip.id ? colors.primary : colors.background,
                borderColor: colors.border,
              }
            ]}
            onPress={() => setSelectedTrip(trip)}
          >
            <Text
              style={[
                styles.tripSelectorText,
                { color: selectedTrip?.id === trip.id ? 'white' : colors.text }
              ]}
              numberOfLines={1}
            >
              {trip.title}
            </Text>
            {selectedTrip?.id === trip.id && (
              <ChevronRight size={16} color="white" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderItineraryItem = (item: ItineraryItem) => {
    const typeOption = typeOptions.find(opt => opt.value === item.type);
    
    return (
      <View
        key={item.id}
        style={[
          styles.itineraryItem,
          {
            backgroundColor: colors.background,
            borderLeftColor: getTypeColor(item.type),
            opacity: item.completed ? 0.7 : 1,
          }
        ]}
      >
        <View style={styles.itemHeader}>
          <TouchableOpacity
            onPress={() => toggleItemCompletion(item.id)}
            style={styles.completionButton}
          >
            {item.completed ? (
              <CheckCircle size={20} color={colors.primary} />
            ) : (
              <Circle size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
          
          <View style={styles.itemInfo}>
            <View style={styles.itemTitleRow}>
              <View style={[styles.typeIconContainer, { backgroundColor: getTypeColor(item.type) + '20' }]}>
                {typeOption?.icon}
              </View>
              <Text
                style={[
                  styles.itemTitle,
                  {
                    color: colors.text,
                    textDecorationLine: item.completed ? 'line-through' : 'none',
                  }
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </View>
            
            <View style={styles.timeContainer}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.itemTime, { color: colors.textSecondary }]}>
                {formatTime(item.startTime)} - {formatTime(item.endTime)}
                {'  '}•{'  '}
                {formatDuration(new Date(item.startTime), new Date(item.endTime))}
              </Text>
            </View>
            
            {item.location && (
              <View style={styles.itemLocation}>
                <MapPin size={14} color={colors.textSecondary} />
                <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.itemActions}>
            <TouchableOpacity
              onPress={() => handleEditItem(item)}
              style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
            >
              <Edit3 size={16} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteItem(item.id)}
              style={[styles.actionButton, { backgroundColor: '#ef444420' }]}
            >
              <Trash2 size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        
        {item.description && (
          <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        )}
      </View>
    );
  };

  const renderAddForm = () => (
    <View style={[styles.addForm, { backgroundColor: colors.card }]}>
      <View style={styles.formHeader}>
        <Text style={[styles.formTitle, { color: colors.text }]}>
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </Text>
        <TouchableOpacity onPress={resetForm}>
          <X size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="Item title"
        placeholderTextColor={colors.textSecondary}
        value={newItem.title}
        onChangeText={(text) => setNewItem(prev => ({ ...prev, title: text }))}
      />
      
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="Location (optional)"
        placeholderTextColor={colors.textSecondary}
        value={newItem.location}
        onChangeText={(text) => setNewItem(prev => ({ ...prev, location: text }))}
      />
      
      <TextInput
        style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
        placeholder="Description (optional)"
        placeholderTextColor={colors.textSecondary}
        value={newItem.description}
        onChangeText={(text) => setNewItem(prev => ({ ...prev, description: text }))}
        multiline
        numberOfLines={3}
      />
      
      <View style={styles.typeSelector}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Type</Text>
        <View style={[styles.typeOptionsContainer, { borderColor: colors.border }]}>
          {typeOptions.map(type => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeOption,
                {
                  backgroundColor: newItem.type === type.value ? type.color : colors.background,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setNewItem(prev => ({ 
                ...prev, 
                type: type.value as 'activity' | 'accommodation' | 'transport' | 'meal' 
              }))}
            >
              <View style={styles.typeOptionContent}>
                {React.cloneElement(type.icon, { 
                  size: 16, 
                  color: newItem.type === type.value ? 'white' : colors.text 
                })}
                <Text
                  style={[
                    styles.typeText,
                    { color: newItem.type === type.value ? 'white' : colors.text }
                  ]}
                >
                  {type.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.timeSection}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Time</Text>
        <View style={styles.timeInputsContainer}>
          <TouchableOpacity
            style={[styles.timeInput, { borderColor: colors.border }]}
            onPress={() => openTimePicker('start')}
          >
            <Clock size={16} color={colors.textSecondary} />
            <Text style={[styles.timeText, { color: colors.text }]}>
              {formatTime(newItem.startTime)}
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.durationIndicator, { backgroundColor: colors.border }]}>
            <Text style={[styles.durationText, { color: colors.textSecondary }]}>
              {formatDuration(newItem.startTime, newItem.endTime)}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.timeInput, { borderColor: colors.border }]}
            onPress={() => openTimePicker('end')}
          >
            <Clock size={16} color={colors.textSecondary} />
            <Text style={[styles.timeText, { color: colors.text }]}>
              {formatTime(newItem.endTime)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.formActions}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={editingItem ? handleUpdateItem : handleAddItem}
        >
          <Save size={16} color="white" />
          <Text style={styles.saveButtonText}>
            {editingItem ? 'Update Item' : 'Add Item'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {showDatePicker && (
        <RNDateTimePicker
          value={tempDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          minuteInterval={15}
          textColor={colors.text}
          themeVariant={colors.mode === 'dark' ? 'dark' : 'light'}
        />
      )}
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Itinerary</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderTripSelector()}
          
          {selectedTrip && (
            <>
              <View style={[styles.section, { backgroundColor: colors.card }]}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {selectedTrip.title} Itinerary
                  </Text>
                  <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                    onPress={() => setShowAddForm(true)}
                  >
                    <Plus size={16} color="white" />
                    <Text style={styles.addButtonText}>Add Item</Text>
                  </TouchableOpacity>
                </View>
                
                {Object.keys(groupedItinerary).length > 0 ? (
                  Object.entries(groupedItinerary)
                    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                    .map(([day, items]) => renderDayGroup(day, items))
                ) : (
                  <View style={styles.emptyState}>
                    <Calendar size={48} color={colors.textSecondary} />
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>
                      No itinerary items yet
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                      Add your first itinerary item to get started
                    </Text>
                    <TouchableOpacity
                      style={[styles.addButton, { backgroundColor: colors.primary, marginTop: 16 }]}
                      onPress={() => setShowAddForm(true)}
                    >
                      <Plus size={16} color="white" />
                      <Text style={styles.addButtonText}>Add First Item</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              
              {showAddForm && renderAddForm()}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingBottom: 16,
  },
  section: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tripSelectorContainer: {
    paddingVertical: 8,
  },
  tripSelectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  tripSelectorText: {
    fontSize: 14,
    fontWeight: '500',
    maxWidth: 150,
  },
  dayGroup: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dayInfo: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  daySubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  dayContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  itineraryItem: {
    borderRadius: 8,
    borderLeftWidth: 4,
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  completionButton: {
    marginRight: 12,
    marginTop: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeIconContainer: {
    padding: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 14,
    marginLeft: 4,
  },
  itemLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  itemActions: {
    flexDirection: 'row',
    marginLeft: 8,
    gap: 4,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  addForm: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  typeSelector: {
    marginBottom: 16,
  },
  typeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  typeOption: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  typeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  timeSection: {
    marginBottom: 16,
  },
  timeInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeText: {
    fontSize: 14,
    marginLeft: 8,
  },
  durationIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  formActions: {
    marginTop: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
});